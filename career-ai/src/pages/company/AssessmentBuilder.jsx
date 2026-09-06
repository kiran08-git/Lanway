import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function AssessmentBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the new question form
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    type: 'MultipleChoice',
    points: 10,
    options: ['', '', '', ''],
    correct_answer: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load assessment
      const { data: assm, error: assmError } = await supabase
        .from('company_assessments')
        .select('*')
        .eq('id', id)
        .eq('company_id', profile.id)
        .single();
        
      if (assmError) throw assmError;
      setAssessment(assm);

      // 2. Load existing questions
      const { data: qData, error: qError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', id)
        .order('created_at', { ascending: true });
        
      if (qError) throw qError;
      setQuestions(qData || []);
    } catch (err) {
      console.error('Failed to load assessment builder:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    
    // If the changed option was previously marked as correct, we need to update the correct answer text
    // (A better way is usually by index, but the schema uses text, so we'll just let the user re-select if needed)
    setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setNewQuestion(prev => ({ ...prev, options: [...prev.options, ''] }));
  };
  
  const removeOption = (index) => {
    if (newQuestion.options.length <= 2) return; // Minimum 2 options
    
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);
    
    let updatedCorrectAnswer = newQuestion.correct_answer;
    if (newQuestion.options[index] === newQuestion.correct_answer) {
      updatedCorrectAnswer = '';
    }
    
    setNewQuestion(prev => ({ 
      ...prev, 
      options: updatedOptions,
      correct_answer: updatedCorrectAnswer
    }));
  };

  const saveNewQuestion = async () => {
    if (!newQuestion.question_text.trim()) {
      alert("Question text is required.");
      return;
    }
    
    if (newQuestion.type === 'MultipleChoice') {
      const validOptions = newQuestion.options.filter(o => o.trim() !== '');
      if (validOptions.length < 2) {
        alert("Multiple choice questions require at least 2 valid options.");
        return;
      }
      if (!newQuestion.correct_answer) {
        alert("Please select a correct answer.");
        return;
      }
      // Ensure the selected correct answer actually exists in valid options
      if (!validOptions.includes(newQuestion.correct_answer)) {
        alert("The selected correct answer is empty or not in the options list.");
        return;
      }
    } else {
      if (!newQuestion.correct_answer.trim()) {
        alert("Please provide the correct answer or grading rubric.");
        return;
      }
    }

    try {
      const questionToInsert = {
        assessment_id: id,
        question_text: newQuestion.question_text,
        type: newQuestion.type,
        points: parseInt(newQuestion.points, 10),
        options: newQuestion.type === 'MultipleChoice' ? newQuestion.options.filter(o => o.trim() !== '') : [],
        correct_answer: newQuestion.correct_answer
      };

      const { data, error } = await supabase
        .from('assessment_questions')
        .insert(questionToInsert)
        .select()
        .single();

      if (error) throw error;
      
      setQuestions(prev => [...prev, data]);
      setIsAdding(false);
      
      // Reset form
      setNewQuestion({
        question_text: '',
        type: 'MultipleChoice',
        points: 10,
        options: ['', '', '', ''],
        correct_answer: ''
      });
      
    } catch (err) {
      console.error('Failed to save question:', err);
      alert('Failed to save question. See console for details.');
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const { error } = await supabase
        .from('assessment_questions')
        .delete()
        .eq('id', questionId);
        
      if (error) throw error;
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const publishAssessment = async () => {
    if (questions.length === 0) {
      if (!window.confirm("This assessment has 0 questions. Are you sure you want to publish?")) {
        return;
      }
    }
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('company_assessments')
        .update({ status: 'Active' })
        .eq('id', id);
        
      if (error) throw error;
      
      navigate('/company-dashboard');
    } catch (err) {
      console.error('Failed to publish assessment:', err);
      alert('Failed to publish. See console for details.');
      setLoading(false);
    }
  };

  if (loading && !assessment) {
    return <CompanyLayout title="Question Builder"><div className="p-8 text-center text-brand-ink-500">Loading...</div></CompanyLayout>;
  }

  return (
    <CompanyLayout title="Question Builder" subtitle={`Building: ${assessment?.title}`}>
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/company-dashboard')}
            className="flex items-center gap-2 text-sm text-brand-ink-500 hover:text-brand-ink-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-ink-500">{questions.length} Questions</span>
            <Button 
              variant="primary" 
              icon={CheckCircle} 
              onClick={publishAssessment}
            >
              Publish Assessment
            </Button>
          </div>
        </div>

        {/* Existing Questions List */}
        <div className="space-y-4 mb-8">
          {questions.map((q, index) => (
            <Card key={q.id} className="p-6 relative group border-brand-ink-200">
              <button 
                onClick={() => deleteQuestion(q.id)}
                className="absolute top-4 right-4 text-brand-ink-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="Delete Question"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-brand-ink-100 text-brand-ink-600 flex items-center justify-center font-bold shrink-0 text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-brand-ink-500 uppercase tracking-wider">{q.type}</span>
                    <span className="text-xs font-semibold text-brand-ink-400">•</span>
                    <span className="text-xs font-semibold text-brand-blue-600">{q.points} Points</span>
                  </div>
                  <h3 className="text-base font-semibold text-brand-ink-900 mb-4">{q.question_text}</h3>
                  
                  {q.type === 'MultipleChoice' && (
                    <div className="grid sm:grid-cols-2 gap-2 mb-3">
                      {(q.options || []).map((opt, i) => (
                        <div 
                          key={i} 
                          className={`px-3 py-2 text-sm rounded-lg border ${
                            q.correct_answer === opt 
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-medium' 
                              : 'border-brand-ink-100 bg-brand-ink-50/50 text-brand-ink-600'
                          }`}
                        >
                          {q.correct_answer === opt && <CheckCircle size={14} className="inline mr-1.5 text-emerald-600 shrink-0" />}
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {q.type === 'Subjective' && (
                    <div className="p-3 rounded-lg border border-brand-ink-100 bg-brand-ink-50/50">
                      <span className="text-xs font-bold text-brand-ink-500 block mb-1">Expected Answer / Rubric:</span>
                      <p className="text-sm text-brand-ink-700">{q.correct_answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {questions.length === 0 && !isAdding && (
            <Card className="p-10 text-center border-dashed border-2 border-brand-ink-200 bg-brand-ink-50/50">
              <h3 className="text-brand-ink-900 font-bold mb-2">No questions yet</h3>
              <p className="text-sm text-brand-ink-500 mb-6">Add multiple choice or subjective questions to build your assessment.</p>
              <Button variant="secondary" icon={Plus} onClick={() => setIsAdding(true)}>
                Add First Question
              </Button>
            </Card>
          )}
        </div>

        {/* Add Question Form */}
        {isAdding ? (
          <Card className="p-6 sm:p-8 border-brand-blue-200 shadow-md">
            <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-6">Add New Question</h3>
            
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-ink-900 mb-1.5">Question Type</label>
                  <select
                    className="w-full rounded-xl border border-brand-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 bg-white"
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value, correct_answer: '' }))}
                  >
                    <option value="MultipleChoice">Multiple Choice</option>
                    <option value="Subjective">Subjective / Essay</option>
                  </select>
                </div>
                
                <Input
                  id="points"
                  type="number"
                  label="Points"
                  min="1"
                  max="100"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, points: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-ink-900 mb-1.5">Question Text</label>
                <textarea
                  className="w-full rounded-xl border border-brand-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 resize-y"
                  rows={3}
                  placeholder="e.g., What is the difference between shallow copy and deep copy?"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                />
              </div>

              {/* Multiple Choice Options Builder */}
              {newQuestion.type === 'MultipleChoice' && (
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-semibold text-brand-ink-900">Options (Select the correct one)</label>
                  
                  {newQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correct_answer"
                        className="w-4 h-4 text-brand-blue-600 focus:ring-brand-blue-500 mt-1 shrink-0"
                        checked={newQuestion.correct_answer === opt && opt !== ''}
                        onChange={() => setNewQuestion(prev => ({ ...prev, correct_answer: opt }))}
                        disabled={!opt.trim()}
                        title={!opt.trim() ? "Fill in the option text first" : "Mark as correct"}
                      />
                      <input
                        type="text"
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 transition-colors ${
                          newQuestion.correct_answer === opt && opt !== ''
                            ? 'border-brand-blue-500 focus:border-brand-blue-500 ring-brand-blue-500 bg-brand-blue-50/20' 
                            : 'border-brand-ink-200 focus:border-brand-ink-400 ring-brand-ink-400'
                        }`}
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => removeOption(idx)}
                        disabled={newQuestion.options.length <= 2}
                        className="p-2 text-brand-ink-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={addOption}
                    className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 flex items-center gap-1 mt-2"
                  >
                    <Plus size={14} /> Add another option
                  </button>
                </div>
              )}

              {/* Subjective Answer / Rubric */}
              {newQuestion.type === 'Subjective' && (
                <div>
                  <label className="block text-sm font-semibold text-brand-ink-900 mb-1.5">Expected Answer / Grading Rubric</label>
                  <textarea
                    className="w-full rounded-xl border border-brand-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 resize-y"
                    rows={4}
                    placeholder="Provide the expected answer or criteria the AI should look for when grading..."
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                  />
                  <p className="text-xs text-brand-ink-500 mt-1.5">This will not be shown to candidates during the test.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-ink-100">
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button variant="primary" icon={Save} onClick={saveNewQuestion}>Save Question</Button>
              </div>
            </div>
          </Card>
        ) : (
          questions.length > 0 && (
            <Button 
              variant="secondary" 
              icon={Plus} 
              className="w-full justify-center py-4 border-dashed border-2 bg-transparent hover:bg-brand-ink-50/50"
              onClick={() => setIsAdding(true)}
            >
              Add Another Question
            </Button>
          )
        )}
      </div>
    </CompanyLayout>
  );
}
