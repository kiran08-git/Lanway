import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  Zap,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Calendar,
  HelpCircle,
  Compass,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
  Bot,
  RotateCcw,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Radio,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import {
  getConversations,
  createConversation,
  getMessages,
  sendChatMessage,
  deleteConversation,
  getChatUsage,
  incrementChatUsage,
  resetChatUsage,
  DEFAULT_CHAT_LIMIT,
} from '../lib/chatService';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// Cursive Quick Category Tags (as in mockup)
const CURSIVE_TOPICS = [
  {
    label: 'Career',
    prompt: 'Explain my top recommended career match, required skills, and growth trajectory.',
  },
  {
    label: 'Academics concepts',
    prompt: 'Explain a complex academic or computer science concept step-by-step with analogies and simple examples.',
  },
  {
    label: 'Study Plan',
    prompt: 'Create a structured 7-day study plan to master key technical skills and bridge my skill gaps.',
  },
];

// Quick action tools for the lightning bolt menu
const QUICK_TOOLS = [
  {
    title: 'Career Match Fit',
    desc: 'Analyze why your 14-dimension assessment matches your target pathway.',
    icon: Compass,
    prompt: 'Explain why I received my top recommended career match and what my strengths are.',
    color: 'text-brand-blue-600 bg-brand-blue-50 border-brand-blue-200',
  },
  {
    title: 'Academic Concept Tutor',
    desc: 'Deep-dive into algorithms, mathematics, science, or system architecture.',
    icon: BookOpen,
    prompt: 'Explain the core principles of Object-Oriented Programming vs Functional Programming with code examples.',
    color: 'text-brand-purple-600 bg-brand-purple-50 border-brand-purple-200',
  },
  {
    title: '7-Day Study Roadmap',
    desc: 'Generate a day-by-day practical learning schedule with exercises.',
    icon: Calendar,
    prompt: 'Generate a structured 7-day study plan for my recommended career with daily tasks.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Interactive Practice Quiz',
    desc: 'Self-test knowledge with collapsible hidden answers and explanations.',
    icon: HelpCircle,
    prompt: 'Give me 3 challenging practice quiz questions on core software engineering with hidden answers.',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'Skill Gap & Bridge',
    desc: 'Find out exactly what technologies to learn next to become job-ready.',
    icon: Zap,
    prompt: 'What specific skill gaps should I bridge for my career goals, and what projects should I build?',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
];

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // State management
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [aiData, setAiData] = useState(null);

  // Drawers and Modals
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  // Usage & Quota State
  const [chatUsage, setChatUsage] = useState(() => getChatUsage(user?.id || 'guest'));

  // Voice Message & Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [lastSentWasVoice, setLastSentWasVoice] = useState(false);

  // Text-to-Speech (Read Aloud) State
  const [speechState, setSpeechState] = useState({ idx: null, isSpeaking: false, isPaused: false });

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const plusMenuRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTimerRef = useRef(null);

  // Check speech recognition capability on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
    }
  }, []);

  // 1. Sync usage quota
  useEffect(() => {
    setChatUsage(getChatUsage(user?.id || 'guest'));
  }, [user]);

  // 2. Load Student AI Recommendations Context
  useEffect(() => {
    async function loadStudentContext() {
      try {
        const recs = await getLatestCareerRecommendations(user?.id);
        if (recs) {
          setAiData(recs);
        }
      } catch (err) {
        console.warn('Could not load student career context for chat:', err);
      }
    }
    if (user) {
      loadStudentContext();
    }
  }, [user]);

  // 3. Load User Conversations List
  useEffect(() => {
    async function initConversations() {
      if (!user?.id) return;
      try {
        const list = await getConversations(user.id);
        setConversations(list);

        const urlPrompt = searchParams.get('prompt');
        if (list.length > 0 && !urlPrompt) {
          setActiveConversationId(list[0].id);
        } else if (list.length === 0 || urlPrompt) {
          const newConvo = await createConversation(
            user.id,
            urlPrompt ? urlPrompt.slice(0, 35) + '...' : 'New Conversation'
          );
          setConversations([newConvo, ...list]);
          setActiveConversationId(newConvo.id);
        }
      } catch (err) {
        console.error('Error initializing conversations:', err);
      }
    }
    initConversations();
  }, [user]);

  // 4. Load Messages when Active Conversation Changes
  useEffect(() => {
    async function loadConvoMessages() {
      if (!activeConversationId) return;
      try {
        const msgs = await getMessages(activeConversationId);
        setMessages(msgs);
        setError(null);
      } catch (err) {
        console.error('Error loading messages for conversation:', err);
      }
    }
    loadConvoMessages();
    stopSpeaking();
  }, [activeConversationId]);

  // 5. Handle Incoming Query Parameter Prompt
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt && activeConversationId && !isSending) {
      setSearchParams({});
      handleSendMessage(urlPrompt);
    }
  }, [searchParams, activeConversationId]);

  // Close plus menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setPlusMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  // Clean up speech synthesis & mic on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current);
      }
    };
  }, []);

  // Handle Create New Conversation
  const handleNewChat = async () => {
    if (!user?.id) return;
    try {
      stopSpeaking();
      stopListening();
      const newConvo = await createConversation(user.id, 'New Conversation');
      setConversations((prev) => [newConvo, ...prev]);
      setActiveConversationId(newConvo.id);
      setMessages([]);
      setHistoryOpen(false);
      setToolsOpen(false);
      setError(null);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  };

  // Handle Delete Conversation
  const handleDeleteConversation = async (e, convoId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;

    try {
      await deleteConversation(convoId, user?.id);
      const remaining = conversations.filter((c) => c.id !== convoId);
      setConversations(remaining);

      if (activeConversationId === convoId) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  // =========================================================================
  // VOICE RECORDING & SPEECH-TO-TEXT (Microphone Input)
  // =========================================================================
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    try {
      // If already active, stop
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceDuration(0);
        voiceTimerRef.current = setInterval(() => {
          setVoiceDuration((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setInputValue(fullTranscript);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event/error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access was denied. Please allow microphone permissions in your browser.');
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceTimerRef.current) {
          clearInterval(voiceTimerRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
    }
    setIsListening(false);
  };

  const cancelVoice = () => {
    stopListening();
    setInputValue('');
    setVoiceDuration(0);
  };

  // =========================================================================
  // TEXT-TO-SPEECH (Listen to AI Responses)
  // =========================================================================
  const speakMessage = (rawText, idx) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Toggle pause/play if it's the currently playing message
    if (speechState.idx === idx) {
      if (speechState.isSpeaking && !speechState.isPaused) {
        window.speechSynthesis.pause();
        setSpeechState((prev) => ({ ...prev, isPaused: true }));
        return;
      } else if (speechState.isPaused) {
        window.speechSynthesis.resume();
        setSpeechState((prev) => ({ ...prev, isPaused: false }));
        return;
      }
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text: strip markdown syntax, code blocks, bullet tokens
    const cleanedText = rawText
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted for voice playback. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/---/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setSpeechState({ idx, isSpeaking: true, isPaused: false });
    };

    utterance.onend = () => {
      setSpeechState({ idx: null, isSpeaking: false, isPaused: false });
    };

    utterance.onerror = () => {
      setSpeechState({ idx: null, isSpeaking: false, isPaused: false });
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechState({ idx: null, isSpeaking: false, isPaused: false });
  };

  // =========================================================================
  // SEND MESSAGE HANDLER
  // =========================================================================
  const handleSendMessage = async (textToSend = null, fromVoice = false) => {
    const text = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!text || !text.trim() || isSending) return;

    // Stop listening if active
    if (isListening) {
      stopListening();
    }

    // Check Chat Limit Quota
    const currentUsage = getChatUsage(user?.id || 'guest');
    if (currentUsage.isLimitReached) {
      setLimitModalOpen(true);
      return;
    }

    setError(null);
    setInputValue('');
    setPlusMenuOpen(false);
    setIsSending(true);

    const isVoicePrompt = fromVoice || isListening || voiceDuration > 0;
    setVoiceDuration(0);

    // Optimistically show user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      role: 'user',
      message: text.trim(),
      isVoice: isVoicePrompt,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const historyPayload = messages.map((m) => ({
        role: m.role,
        message: m.message,
      }));

      const contextPayload = {
        profile: profile || {},
        assessment: {
          overallScore: aiData?.overallScore,
          categoryScores: aiData?.categoryScores,
          strongestCategories: aiData?.strongestCategories,
        },
        recommendations: {
          careers: aiData?.careers || [],
          strengths: aiData?.topStrengths || [],
          areas_for_development: aiData?.areasForDevelopment || [],
        },
      };

      const result = await sendChatMessage({
        conversationId: activeConversationId,
        message: text.trim(),
        history: historyPayload,
        context: contextPayload,
        userId: user?.id,
        token,
      });

      // Increment Chat Usage Count
      const updatedUsage = incrementChatUsage(user?.id || 'guest');
      setChatUsage(updatedUsage);

      // Update messages list with verified server response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        { ...result.userMessage, isVoice: isVoicePrompt },
        result.assistantMessage,
      ]);

      // Update conversation title in list if this was the first message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId && c.title === 'New Conversation'
            ? { ...c, title: text.trim().slice(0, 35) + (text.length > 35 ? '...' : '') }
            : c
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to receive a response from AI Assistant. Please try again.');
    } finally {
      setIsSending(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Reset Quota for Demo
  const handleResetQuota = () => {
    const reset = resetChatUsage(user?.id || 'guest');
    setChatUsage(reset);
    setLimitModalOpen(false);
  };

  // Keyboard shortcut: Enter sends, Shift+Enter adds newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy message to clipboard
  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Toggle collapsible answer section
  const toggleAnswer = (idx) => {
    setExpandedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Format seconds to mm:ss
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isChatEmpty = messages.length === 0;

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Your personal AI companion with open questions, voice chat & learning plans"
    >
      <div className="relative flex h-[calc(100vh-10.5rem)] min-h-[620px] bg-white rounded-3xl border border-gray-200/80 shadow-card overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. LEFT ICON NAVIGATION RAIL (+, Chat Bubble, Lightning)                  */}
        {/* ========================================================================= */}
        <div className="w-16 sm:w-18 shrink-0 bg-white border-r border-gray-200/80 flex flex-col items-center py-6 gap-6 z-20">
          {/* Plus Icon (+) - New Chat */}
          <button
            onClick={handleNewChat}
            title="Start New Chat"
            aria-label="Start New Chat"
            className="group relative p-2.5 rounded-2xl text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <Plus size={26} strokeWidth={2.4} />
            <span className="absolute left-16 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
              New Chat
            </span>
          </button>

          {/* Chat Bubbles Icon - Conversations History Drawer */}
          <button
            onClick={() => {
              setHistoryOpen((prev) => !prev);
              setToolsOpen(false);
            }}
            title="Conversations History"
            aria-label="Conversations History"
            className={`group relative p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              historyOpen
                ? 'bg-gray-100 text-black'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <div className="relative">
              <MessageSquare size={24} strokeWidth={2} />
              {conversations.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-black" />
              )}
            </div>
            <span className="absolute left-16 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
              Chat History
            </span>
          </button>

          {/* Lightning Bolt Icon (⚡) - AI Tools & Categories */}
          <button
            onClick={() => {
              setToolsOpen((prev) => !prev);
              setHistoryOpen(false);
            }}
            title="AI Quick Tools"
            aria-label="AI Quick Tools"
            className={`group relative p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              toolsOpen
                ? 'bg-gray-100 text-black'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <Zap size={25} strokeWidth={2.4} className="fill-current" />
            <span className="absolute left-16 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
              AI Tools &amp; Prompts
            </span>
          </button>

          {/* Bottom Rail Info / Quota */}
          <div className="mt-auto flex flex-col items-center gap-2">
            <button
              onClick={() => setLimitModalOpen(true)}
              title="Daily Chat Limit"
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                chatUsage.isLimitReached
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span className="text-[10px] font-mono">
                {chatUsage.count}/{chatUsage.limit}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. HISTORY DRAWER (Opens when clicking Chat Bubble)                      */}
        {/* ========================================================================= */}
        {historyOpen && (
          <aside className="absolute left-16 sm:left-18 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-md border-r border-gray-200 z-30 flex flex-col shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={17} className="text-[#6366f1]" />
                <h3 className="font-semibold text-sm text-gray-900">Conversations</h3>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-3">
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleNewChat}
                className="w-full text-xs font-semibold !py-2 bg-[#6366f1] hover:bg-[#4f46e5]"
              >
                New Conversation
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No conversations yet. Start typing to create one!
                </div>
              ) : (
                conversations.map((convo) => {
                  const isActive = convo.id === activeConversationId;
                  return (
                    <div
                      key={convo.id}
                      onClick={() => {
                        setActiveConversationId(convo.id);
                        setHistoryOpen(false);
                      }}
                      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50/80 text-[#4f46e5] border border-indigo-200/70 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare
                          size={14}
                          className={isActive ? 'text-[#4f46e5]' : 'text-gray-400'}
                        />
                        <span className="truncate">{convo.title || 'Conversation'}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, convo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-opacity"
                        title="Delete conversation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-[11px] text-gray-500 flex items-center justify-between">
              <span>Remaining queries:</span>
              <span className="font-bold text-[#6366f1]">
                {chatUsage.remaining} / {chatUsage.limit}
              </span>
            </div>
          </aside>
        )}

        {/* ========================================================================= */}
        {/* 3. AI QUICK TOOLS DRAWER (Opens when clicking Lightning Bolt ⚡)           */}
        {/* ========================================================================= */}
        {toolsOpen && (
          <aside className="absolute left-16 sm:left-18 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-30 flex flex-col shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={17} className="text-[#7c3aed]" />
                <h3 className="font-semibold text-sm text-gray-900">AI Assistant Modes</h3>
              </div>
              <button
                onClick={() => setToolsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <p className="text-[11px] text-gray-500 px-1">
                Click any tool below to immediately generate structured answers and roadmaps:
              </p>

              {QUICK_TOOLS.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setToolsOpen(false);
                      handleSendMessage(tool.prompt);
                    }}
                    className="p-3 rounded-2xl border border-gray-100 hover:border-indigo-200 bg-white hover:bg-indigo-50/30 cursor-pointer transition-all shadow-2xs hover:shadow-soft group"
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className={`p-1.5 rounded-lg border ${tool.color}`}>
                        <Icon size={15} />
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#4f46e5] transition-colors">
                        {tool.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">{tool.desc}</p>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* ========================================================================= */}
        {/* 4. MAIN CHAT CANVAS                                                       */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
          {/* Top Status Strip when Chat is Active */}
          {!isChatEmpty && (
            <div className="px-5 py-2.5 border-b border-gray-100 bg-white/90 backdrop-blur-sm flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-assistant-script text-lg font-bold assistant-title-gradient">
                  your personal ai assistant
                </span>
                <span className="hidden sm:inline-block text-gray-300">|</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Gemini Online
                </span>
                {speechState.isSpeaking && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7c3aed] border border-purple-200 animate-fade-in">
                    <span className="flex gap-0.5 items-end h-2.5">
                      <span className="w-0.5 bg-[#7c3aed] animate-pulse h-2" />
                      <span className="w-0.5 bg-[#7c3aed] animate-pulse h-3" style={{ animationDelay: '150ms' }} />
                      <span className="w-0.5 bg-[#7c3aed] animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
                    </span>
                    Reading Aloud...
                    <button
                      onClick={stopSpeaking}
                      className="ml-1 text-gray-400 hover:text-red-500 p-0.5"
                      title="Stop Speaking"
                    >
                      <Square size={9} className="fill-current" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 hidden md:inline">
                  Daily Queries:{' '}
                  <strong className="text-[#6366f1]">
                    {chatUsage.count}/{chatUsage.limit}
                  </strong>
                </span>
                <button
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-[#4f46e5] hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>New Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* Limit Reached Banner */}
          {chatUsage.isLimitReached && (
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Daily message limit reached ({chatUsage.limit}/{chatUsage.limit}).</strong> Reset to continue testing.
                </span>
              </div>
              <button
                onClick={handleResetQuota}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-all shadow-2xs cursor-pointer"
              >
                Reset Limit (Demo)
              </button>
            </div>
          )}

          {/* Content Area: Initial Mockup State or Active Conversation Stream */}
          {isChatEmpty ? (
            /* ================================================================= */
            /* INITIAL STATE: Reference Mockup with Voice Message Recording      */
            /* ================================================================= */
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full animate-fade-in gap-12">
              <div className="text-center">
                <h1 className="font-display font-bold text-brand-ink-900 text-4xl sm:text-5xl mb-2">
                  hello {profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}
                </h1>
                <h2 className="font-display font-bold text-brand-blue-400 text-3xl sm:text-4xl">
                  how can i help you Today
                </h2>
              </div>

              <div className="w-full max-w-2xl sm:max-w-3xl">
                <div
                  className={`rounded-[24px] border border-brand-blue-200 bg-white p-4 sm:p-5 transition-all duration-200 relative ${
                    isListening
                      ? 'border-rose-300 ring-4 ring-rose-50 bg-rose-50/20'
                      : 'hover:border-brand-blue-300 focus-within:border-brand-blue-300 focus-within:ring-4 focus-within:ring-brand-blue-50/50 hover:shadow-soft'
                  }`}
                >
                  {/* Live Listening Banner if Microphone is Active */}
                  {isListening && (
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-rose-100 text-xs text-rose-700 animate-fade-in">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600" />
                        </span>
                        <span className="font-semibold flex items-center gap-1.5">
                          <Mic size={14} className="text-rose-600 animate-pulse" />
                          Listening voice message... ({formatTimer(voiceDuration)})
                        </span>
                      </div>
                      <button
                        onClick={cancelVoice}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded-md text-[11px] flex items-center gap-1"
                        title="Cancel voice recording"
                      >
                        <X size={13} /> Cancel
                      </button>
                    </div>
                  )}

                  {/* Top Textarea with 'How can I help today?' Placeholder */}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    placeholder={
                      isListening
                        ? 'Listening... Speak your question clearly into your microphone'
                        : 'How can I help today?'
                    }
                    className="w-full bg-transparent border-0 resize-none text-base sm:text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
                  />

                  {/* Bottom Action Row inside Card */}
                  <div className="flex items-center justify-between mt-8">
                    {/* Left Actions: Plus (+) for templates */}
                    <div className="flex items-center gap-1">
                      <div className="relative" ref={plusMenuRef}>
                        <button
                          type="button"
                          onClick={() => setPlusMenuOpen((prev) => !prev)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          title="Add context or prompt template"
                        >
                          <Plus size={22} strokeWidth={2.4} />
                        </button>

                        {/* Quick Dropdown on Plus (+) */}
                        {plusMenuOpen && (
                          <div className="absolute left-0 bottom-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-40 animate-fade-in text-xs">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Quick Prompts
                            </p>
                            {QUICK_TOOLS.map((t, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setPlusMenuOpen(false);
                                  handleSendMessage(t.prompt);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-gray-700 hover:bg-brand-blue-50 hover:text-brand-blue-600 flex items-center gap-2 transition-colors"
                              >
                                <t.icon size={14} className="text-brand-blue-500" />
                                <span className="truncate">{t.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Actions: Voice Record Button + Circular Send Button */}
                    <div className="flex items-center gap-2">
                      {/* Microphone Voice Message Button */}
                      <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        title={isListening ? 'Stop voice recording' : 'Send voice message / Dictate'}
                        aria-label="Voice input"
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isListening
                            ? 'bg-rose-500 text-white shadow-glow animate-pulse scale-105'
                            : 'bg-purple-50 text-[#9b66f2] hover:bg-purple-100 hover:text-[#7c3aed]'
                        }`}
                      >
                        {isListening ? <Square size={16} className="fill-current" /> : <Mic size={18} strokeWidth={2.2} />}
                      </button>

                      {/* Circular Send Button */}
                      <button
                        type="button"
                        onClick={() => handleSendMessage(null, isListening || voiceDuration > 0)}
                        disabled={!inputValue.trim() || isSending || chatUsage.isLimitReached}
                        aria-label="Send query"
                        className="h-10 w-10 rounded-full bg-[#E5C6A0] hover:bg-[#d6b791] text-white disabled:opacity-40 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed transform active:scale-95"
                      >
                        <Send size={16} className="translate-x-[-1px] translate-y-[-1px]" strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================= */
            /* ACTIVE CHAT FEED: Messages with Voice Badges & Read Aloud Buttons */
            /* ================================================================= */
            <div className="flex-1 flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const isPlayingThis = speechState.idx === idx && speechState.isSpeaking;

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex items-start gap-3.5 ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      } animate-fade-in`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                          isUser
                            ? 'bg-brand-blue-600 text-white'
                            : 'bg-white text-brand-ink-900 border border-brand-ink-200'
                        }`}
                      >
                        {isUser ? (
                          profile?.name?.[0]?.toUpperCase() || 'U'
                        ) : (
                          <Sparkles size={18} className="text-[#8b5cf6]" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-5 text-sm ${
                          isUser
                            ? 'bg-brand-blue-600 text-white rounded-tr-xs shadow-soft leading-relaxed'
                            : 'bg-[#faf9fe]/90 border border-purple-100 text-gray-800 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {isUser ? (
                          <div>
                            {msg.isVoice && (
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-100 bg-white/15 px-2.5 py-0.5 rounded-full w-fit mb-2">
                                <Mic size={12} className="animate-pulse" />
                                <span>Voice Message</span>
                              </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <FormattedAssistantMessage
                              content={msg.message}
                              idx={idx}
                              isExpanded={expandedAnswers[idx]}
                              onToggleAnswer={() => toggleAnswer(idx)}
                            />

                            {/* Assistant Footer Actions: Read Aloud / Listen & Copy */}
                            <div className="pt-2.5 mt-3 border-t border-purple-100/70 flex items-center justify-between text-[11px] text-gray-400">
                              <span className="font-medium text-[#7c3aed] flex items-center gap-1">
                                <Sparkles size={12} /> Gemini Assistant
                              </span>

                              <div className="flex items-center gap-2">
                                {/* Listen / Read Aloud Voice Button */}
                                <button
                                  type="button"
                                  onClick={() => speakMessage(msg.message, idx)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all font-medium cursor-pointer ${
                                    isPlayingThis
                                      ? 'bg-purple-100 text-[#7c3aed] shadow-xs'
                                      : 'hover:bg-purple-50 text-gray-500 hover:text-[#7c3aed]'
                                  }`}
                                  title={isPlayingThis ? (speechState.isPaused ? 'Resume reading' : 'Pause speech') : 'Read aloud with AI voice'}
                                >
                                  {isPlayingThis ? (
                                    speechState.isPaused ? (
                                      <>
                                        <Play size={12} className="text-[#7c3aed]" />
                                        <span>Resume</span>
                                      </>
                                    ) : (
                                      <>
                                        <Pause size={12} className="text-[#7c3aed] animate-pulse" />
                                        <span>Pause</span>
                                      </>
                                    )
                                  ) : (
                                    <>
                                      <Volume2 size={13} />
                                      <span>Listen</span>
                                    </>
                                  )}
                                </button>

                                {/* Copy Button */}
                                <button
                                  onClick={() => handleCopyMessage(msg.message, idx)}
                                  className="hover:text-[#6366f1] flex items-center gap-1 px-2 py-1 rounded-xl transition-colors cursor-pointer text-gray-500 hover:bg-gray-100/70"
                                  title="Copy response"
                                >
                                  {copiedIndex === idx ? (
                                    <>
                                      <Check size={12} className="text-emerald-600" />
                                      <span className="text-emerald-600 font-medium">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Thinking animation */}
                {isSending && (
                  <div className="flex items-start gap-3.5 animate-fade-in">
                    <div className="h-9 w-9 rounded-2xl bg-brand-blue-50 text-brand-blue-600 border border-brand-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles size={18} className="text-[#8b5cf6] animate-pulse" />
                    </div>
                    <div className="bg-[#faf9fe] border border-purple-100 rounded-3xl rounded-tl-xs p-4 shadow-xs flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full bg-[#6366f1] animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-[#8b5cf6] animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-[#a855f7] animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        Gemini is crafting response...
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-rose-600 shrink-0" />
                      <span>{error}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendMessage(messages[messages.length - 1]?.message || 'Retry')}
                      className="shrink-0 text-xs !py-1"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area in Active Chat with Voice Dictation */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="max-w-4xl mx-auto">
                  {isListening && (
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs animate-fade-in">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Mic size={13} className="animate-pulse" /> Recording voice message ({formatTimer(voiceDuration)})...
                      </span>
                      <button onClick={cancelVoice} className="text-gray-400 hover:text-rose-600 text-[11px]">
                        Cancel
                      </button>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl border bg-[#faf9fe]/70 focus-within:bg-white p-2.5 sm:p-3 transition-all duration-150 flex items-end gap-2 shadow-xs ${
                      isListening
                        ? 'border-rose-300 ring-3 ring-rose-100'
                        : 'assistant-card-border focus-within:border-[#a855f7] focus-within:ring-3 focus-within:ring-purple-100'
                    }`}
                  >
                    {/* Plus Icon (+) for Quick Actions */}
                    <div className="relative" ref={plusMenuRef}>
                      <button
                        type="button"
                        onClick={() => setPlusMenuOpen((prev) => !prev)}
                        className="p-2 text-gray-400 hover:text-[#4f46e5] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer shrink-0"
                        title="Add prompt template"
                      >
                        <Plus size={20} strokeWidth={2.4} />
                      </button>

                      {plusMenuOpen && (
                        <div className="absolute left-0 bottom-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-40 animate-fade-in text-xs">
                          <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Templates &amp; Modes
                          </p>
                          {QUICK_TOOLS.map((t, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setPlusMenuOpen(false);
                                handleSendMessage(t.prompt);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-[#4f46e5] flex items-center gap-2 transition-colors"
                            >
                              <t.icon size={14} className="text-[#6366f1]" />
                              <span className="truncate">{t.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      disabled={chatUsage.isLimitReached}
                      placeholder={
                        chatUsage.isLimitReached
                          ? 'Daily message limit reached. Click reset to continue.'
                          : isListening
                          ? 'Listening to speech...'
                          : 'Ask anything, dictate or follow up...'
                      }
                      className="flex-1 max-h-32 min-h-[38px] bg-transparent border-0 resize-none px-2 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed disabled:opacity-50"
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                    />

                    {/* Voice Microphone Button */}
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      title={isListening ? 'Stop voice recording' : 'Voice Message / Speech Input'}
                      aria-label="Voice input"
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
                        isListening
                          ? 'bg-rose-500 text-white shadow-glow animate-pulse'
                          : 'bg-purple-50 text-[#7c3aed] hover:bg-purple-100 hover:text-[#6d28d9]'
                      }`}
                    >
                      {isListening ? <Square size={15} className="fill-current" /> : <Mic size={17} />}
                    </button>

                    {/* Circular Purple Paper-Plane Send Button */}
                    <button
                      type="button"
                      onClick={() => handleSendMessage(null, isListening || voiceDuration > 0)}
                      disabled={!inputValue.trim() || isSending || chatUsage.isLimitReached}
                      aria-label="Send query"
                      className="h-10 w-10 rounded-full bg-brand-blue-600 hover:bg-brand-blue-700 text-white disabled:opacity-40 flex items-center justify-center shadow-soft transition-all duration-200 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="translate-x-[-1px] translate-y-[-1px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. LIMIT REACHED MODAL                                                    */}
      {/* ========================================================================= */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 text-center relative">
            <button
              onClick={() => setLimitModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Clock size={28} />
            </div>

            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
              Daily Chat Limit Status
            </h3>

            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              You have used{' '}
              <strong className="text-gray-900 font-bold">
                {chatUsage.count} of {chatUsage.limit}
              </strong>{' '}
              available AI Assistant queries for today.
            </p>

            {chatUsage.isLimitReached ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6 text-left">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-600" />
                  Free Tier Limit Reached
                </p>
                <p className="text-amber-800 leading-snug">
                  You can wait for the automatic daily reset or use the instant demo reset button below to continue testing all features without restrictions.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs mb-6 text-left">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Active Quota Available
                </p>
                <p className="text-emerald-800 leading-snug">
                  You have <strong>{chatUsage.remaining}</strong> queries remaining for your current session today.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button
                variant="primary"
                onClick={handleResetQuota}
                icon={RotateCcw}
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
              >
                Reset Limit (Demo Mode)
              </Button>
              <Button
                variant="secondary"
                onClick={() => setLimitModalOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * Rich Formatted Assistant Message with Markdown, Code Blocks, and Interactive Quiz Revealer
 */
function FormattedAssistantMessage({ content, idx, isExpanded, onToggleAnswer }) {
  if (!content) return null;

  const answerDelimiters = [
    '---',
    '**Answer & Explanation:**',
    '**Answer:**',
    'Answer & Explanation:',
  ];

  let mainBody = content;
  let answerSection = null;

  for (const delimiter of answerDelimiters) {
    if (content.includes(delimiter)) {
      const parts = content.split(delimiter);
      if (parts.length >= 2 && parts[1].trim().length > 0) {
        mainBody = parts[0].trim();
        answerSection = parts.slice(1).join(delimiter).trim();
        break;
      }
    }
  }

  return (
    <div className="space-y-3 leading-relaxed text-gray-800">
      <MarkdownText raw={mainBody} />

      {/* Interactive Quiz / Practice Answer Reveal Card */}
      {answerSection && (
        <div className="mt-4 pt-3 border-t border-purple-100">
          <button
            type="button"
            onClick={onToggleAnswer}
            className="flex items-center justify-between w-full p-3 rounded-2xl bg-purple-50/80 hover:bg-purple-100/70 text-[#7c3aed] text-xs font-semibold transition-colors border border-purple-200/80 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={15} />
              {isExpanded ? 'Hide Answer & Explanation' : '💡 Reveal Answer & Detailed Explanation'}
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isExpanded && (
            <div className="p-4 mt-2 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs animate-fade-in">
              <p className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" /> Solution &amp; Key Concept:
              </p>
              <MarkdownText raw={answerSection} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Lightweight formatting helper for headers, bold, bullet points, and code blocks.
 */
function MarkdownText({ raw }) {
  if (!raw) return null;

  const lines = raw.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${i}`}
            className="my-3 rounded-2xl bg-gray-900 text-gray-100 p-4 font-mono text-xs overflow-x-auto shadow-inner"
          >
            <div className="flex items-center justify-between text-[10px] text-gray-400 pb-2 mb-2 border-b border-gray-800">
              <span>{codeLang || 'Code'}</span>
            </div>
            <pre className="leading-relaxed">{codeBuffer.join('\n')}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="font-display font-bold text-gray-900 text-sm mt-3.5 mb-1.5">
          {formatInline(line.replace('### ', ''))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="font-display font-bold text-gray-900 text-base mt-4 mb-2">
          {formatInline(line.replace('## ', ''))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="font-display font-bold text-gray-900 text-lg mt-4 mb-2">
          {formatInline(line.replace('# ', ''))}
        </h2>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm my-1 text-gray-800 list-none">
          <span className="text-[#6366f1] font-bold mt-0.5">•</span>
          <span className="flex-1 leading-relaxed">{formatInline(line.substring(2))}</span>
        </li>
      );
      continue;
    }

    // Numbered lists (1. 2.)
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm my-1 text-gray-800">
          <span className="font-bold text-[#8b5cf6] text-xs mt-0.5">{numMatch[1]}.</span>
          <span className="flex-1 leading-relaxed">{formatInline(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Empty line / line break
    if (!line.trim()) {
      elements.push(<div key={i} className="h-1.5" />);
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={i} className="text-xs sm:text-sm leading-relaxed text-gray-800 my-1">
        {formatInline(line)}
      </p>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Inline markdown parser (bold **text**, inline `code`, italics *text*)
 */
function formatInline(text) {
  if (!text) return '';

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-purple-50 text-[#7c3aed] font-mono text-[11px] border border-purple-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
