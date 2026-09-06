import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ProctoringEngine from '../../lib/proctoringEngine';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

export default function SecureTest() {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [violation, setViolation] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [mediaError, setMediaError] = useState(null);
  
  const proctorRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Initialize proctoring
    const handleViolation = (desc, type) => {
      setViolation({ desc, type });
      setViolationCount(prev => prev + 1);
      
      // Auto-hide the violation after 5 seconds if they acknowledge it, or we could force them to close it.
      // Let's force them to acknowledge it by rendering an overlay block.
    };

    proctorRef.current = new ProctoringEngine(sessionId, handleViolation);
    proctorRef.current.start();
    
    // Start Camera & Mic
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access camera/mic", err);
        setMediaError("Camera and microphone access is required for this secure test.");
      }
    };
    startMedia();
    
    loadTestData();

    // Prevent accidental navigation
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have an active test. Are you sure you want to leave?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (proctorRef.current) {
        proctorRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  const loadTestData = async () => {
    try {
      // Load assessment & duration
      const { data: assm, error: assmError } = await supabase
        .from('company_assessments')
        .select('*')
        .eq('id', id)
        .single();
      if (assmError) throw assmError;
      setAssessment(assm);
      
      // Load questions (this uses RLS to ensure candidate has right to view)
      const { data: qData, error: qError } = await supabase
        .from('assessment_questions')
        .select('id, question_text, type, options, points')
        .eq('assessment_id', id);
      if (qError) throw qError;
      
      setQuestions(qData || []);
      
      // Start timer
      const durationSeconds = (assm.duration_minutes || 60) * 60;
      setTimeLeft(durationSeconds);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load test. Please contact support.');
      navigate('/dashboard');
    }
  };

  const submitTest = async (autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (proctorRef.current) proctorRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      // In a real implementation, you would calculate score securely on the server (Edge Function)
      // For this demo, we assume a simple calculation or just store answers
      
      // Random mock score generation based on completion
      const answeredCount = Object.keys(answers).length;
      const total = questions.length || 1;
      const baseScore = Math.round((answeredCount / total) * 100);
      // Random variance to simulate checking
      const finalScore = Math.max(0, Math.min(100, baseScore - Math.floor(Math.random() * 20))); 
      
      const { error } = await supabase
        .from('assessment_candidates')
        .update({ 
          status: 'Completed',
          completed_at: new Date().toISOString(),
          answers: answers,
          overall_score: finalScore,
          score_details: {
            technical: finalScore,
            aptitude: Math.min(100, finalScore + 5),
            coding: Math.max(0, finalScore - 10)
          }
        })
        .eq('id', sessionId);
        
      if (error) throw error;
      
      // Navigate to a success page or dashboard
      navigate('/dashboard');
      alert(`Test ${autoSubmit ? 'auto-submitted due to time limit' : 'submitted successfully'}. Your score is being evaluated.`);
      
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit test. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (val, idx = null) => {
    const qId = questions[currentIdx].id;
    if (idx !== null) {
      setAnswers(prev => ({ ...prev, [qId]: { value: val, index: idx } }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: { value: val } }));
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Secure Environment...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <Card className="p-8 max-w-md w-full">
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
          <p className="text-sm text-brand-ink-500 mb-6">The recruiter has not added any questions to this assessment yet.</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  if (mediaError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <Card className="p-8 max-w-md w-full border-red-200 bg-red-50">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-red-900">Access Denied</h2>
          <p className="text-sm text-red-700 mb-6">{mediaError}</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full justify-center bg-red-600 hover:bg-red-700">Exit Test</Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Test Header */}
      <header className="bg-white border-b border-brand-ink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="font-bold text-brand-ink-900">{assessment?.title}</h1>
          <p className="text-xs text-brand-ink-500">{assessment?.role}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-bold bg-brand-ink-50 px-3 py-1.5 rounded-lg border border-brand-ink-100">
            <Clock size={16} className={timeLeft < 300 ? 'text-red-500' : 'text-brand-blue-600'} />
            <span className={timeLeft < 300 ? 'text-red-600' : 'text-brand-ink-900'}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => {
              if(window.confirm('Are you sure you want to submit? You cannot return.')) submitTest();
            }}
            loading={isSubmitting}
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* Violation Overlay */}
      {violation && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-md w-full bg-white shadow-2xl border-red-500 border-t-4 p-6 sm:p-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <AlertTriangle className="text-red-600 w-8 h-8" />
            </div>
            
            <div className="mt-8 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Proctoring Warning</h2>
              <p className="text-sm font-semibold text-red-600 mb-4 tracking-wide uppercase">{violation.type}</p>
              <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {violation.desc}
              </p>
              
              <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-lg text-left mb-6 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>This incident has been recorded. Multiple violations may result in immediate test termination and a high-risk flag on your profile.</p>
              </div>

              <Button 
                variant="primary" 
                className="w-full justify-center !bg-slate-900 hover:!bg-slate-800"
                onClick={() => setViolation(null)}
              >
                I Understand, Return to Test
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-brand-ink-500 mb-2">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>{answeredCount} Answered</span>
          </div>
          <ProgressBar value={progress} color="blue" height="h-2" />
        </div>

        {/* Question Area */}
        <Card className="p-6 md:p-10 flex-1 flex flex-col border-none shadow-sm mb-6">
          <div className="flex items-start gap-4 mb-8">
            <div className="h-8 w-8 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-bold shrink-0">
              {currentIdx + 1}
            </div>
            <h2 className="text-lg md:text-xl font-medium text-brand-ink-900 leading-relaxed pt-0.5">
              {currentQ.question_text}
            </h2>
          </div>

          <div className="space-y-3 mt-auto">
            {currentQ.type === 'MultipleChoice' ? (
              (currentQ.options || []).map((opt, i) => {
                const isSelected = answers[currentQ.id]?.index === i;
                return (
                  <label 
                    key={i} 
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-brand-blue-500 bg-brand-blue-50/50' 
                        : 'border-brand-ink-100 hover:border-brand-blue-200 hover:bg-brand-ink-50/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`q-${currentQ.id}`} 
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleAnswer(opt, i)}
                      className="w-4 h-4 text-brand-blue-600 border-brand-ink-300 focus:ring-brand-blue-500"
                    />
                    <span className={`ml-3 text-sm md:text-base ${isSelected ? 'font-semibold text-brand-blue-900' : 'text-brand-ink-700'}`}>
                      {opt}
                    </span>
                  </label>
                )
              })
            ) : (
              <textarea 
                className="w-full h-40 p-4 rounded-xl border border-brand-ink-200 focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 outline-none resize-y"
                placeholder="Type your answer here..."
                value={answers[currentQ.id]?.value || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-auto">
          <Button 
            variant="secondary" 
            icon={ArrowLeft} 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
          >
            Previous
          </Button>
          
          {currentIdx < questions.length - 1 ? (
            <Button 
              variant="primary" 
              icon={ArrowRight} 
              iconPosition="right"
              onClick={() => setCurrentIdx(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="primary" 
              icon={CheckCircle}
              onClick={() => {
                if(window.confirm('Are you sure you want to submit? You cannot return.')) submitTest();
              }}
              loading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              Finish & Submit
            </Button>
          )}
        </div>
      </main>

      {/* Proctoring Video Feed (Floating) */}
      <div className="fixed bottom-6 right-6 w-48 h-36 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-brand-blue-500/50 z-40">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Recording</span>
        </div>
      </div>
    </div>
  );
}
