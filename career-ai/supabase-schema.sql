-- ==============================================================================
-- CareerAI Supabase Database Schema (Authoritative 30-Question Assessment)
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  year TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  career_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Assessment Results Table (Stores full 30 answers & 14-category scores)
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  category_totals JSONB NOT NULL DEFAULT '{}'::jsonb,
  normalized_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  strongest_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  skill_score NUMERIC DEFAULT 0,
  aptitude_score NUMERIC DEFAULT 0,
  interest_score NUMERIC DEFAULT 0,
  overall_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add migration columns if the table already exists from a previous version
ALTER TABLE public.assessment_results ADD COLUMN IF NOT EXISTS category_totals JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.assessment_results ADD COLUMN IF NOT EXISTS normalized_scores JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.assessment_results ADD COLUMN IF NOT EXISTS strongest_categories JSONB DEFAULT '[]'::jsonb;

-- 3. Career Recommendations Table (Stores AI Generated Analysis & Matched Careers)
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessment_results(id) ON DELETE SET NULL,
  overall_score NUMERIC DEFAULT 0,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  areas_for_development JSONB NOT NULL DEFAULT '[]'::jsonb,
  careers JSONB NOT NULL DEFAULT '[]'::jsonb,
  category_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.career_recommendations ADD COLUMN IF NOT EXISTS category_breakdown JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.career_recommendations ADD COLUMN IF NOT EXISTS areas_for_development JSONB DEFAULT '[]'::jsonb;

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for student_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.student_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.student_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.student_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. RLS Policies for assessment_results
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessment_results;
CREATE POLICY "Users can view their own assessments"
  ON public.assessment_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessment_results;
CREATE POLICY "Users can insert their own assessments"
  ON public.assessment_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. RLS Policies for career_recommendations
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.career_recommendations;
CREATE POLICY "Users can view their own recommendations"
  ON public.career_recommendations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own recommendations" ON public.career_recommendations;
CREATE POLICY "Users can insert their own recommendations"
  ON public.career_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own recommendations" ON public.career_recommendations;
CREATE POLICY "Users can delete their own recommendations"
  ON public.career_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON public.career_recommendations(user_id);

-- 7. Chat Conversations Table (Stores AI Chatbot conversation threads)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Chat Messages Table (Stores individual user & assistant messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for chat tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for chat_conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can view their own conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can insert their own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can update their own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can delete their own conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- 10. RLS Policies for chat_messages
DROP POLICY IF EXISTS "Users can view their own messages" ON public.chat_messages;
CREATE POLICY "Users can view their own messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.chat_messages;
CREATE POLICY "Users can insert their own messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.chat_messages;
CREATE POLICY "Users can delete their own messages"
  ON public.chat_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Chat Indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated_at ON public.chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at ASC);

-- ==============================================================================
-- Company Hiring & Secure Assessment Module
-- ==============================================================================

-- 11. Company Profiles
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  recruiter_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Company Assessments
CREATE TABLE IF NOT EXISTS public.company_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  eligibility_criteria TEXT,
  duration_minutes INTEGER DEFAULT 60,
  difficulty_level TEXT DEFAULT 'Medium',
  passing_score INTEGER DEFAULT 50,
  max_attempts INTEGER DEFAULT 1,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Assessment Questions
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.company_assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT DEFAULT 'MultipleChoice' CHECK (type IN ('MultipleChoice', 'Coding', 'Subjective')),
  category TEXT DEFAULT 'Technical',
  options JSONB DEFAULT '[]'::jsonb, -- Array of strings for MCQ
  correct_answer TEXT NOT NULL, -- Stored securely, not sent to client during test
  points INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Assessment Candidates (Test Sessions & Results)
CREATE TABLE IF NOT EXISTS public.assessment_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.company_assessments(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Invited' CHECK (status IN ('Invited', 'InProgress', 'Completed', 'Shortlisted', 'Rejected', 'Review')),
  resume_url TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  answers JSONB DEFAULT '{}'::jsonb, -- Candidate's submitted answers
  score_details JSONB DEFAULT '{}'::jsonb, -- Technical, Aptitude, Coding scores
  overall_score NUMERIC DEFAULT 0,
  resume_match_score NUMERIC DEFAULT 0,
  risk_level TEXT DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High')),
  recruiter_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(assessment_id, candidate_id) -- Prevent duplicate test attempts for the same assessment unless allowed
);

-- 15. Proctoring Events
CREATE TABLE IF NOT EXISTS public.proctoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_candidate_id UUID NOT NULL REFERENCES public.assessment_candidates(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- e.g., 'TabSwitched', 'FullscreenExited', 'FaceNotDetected'
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctoring_events ENABLE ROW LEVEL SECURITY;

-- RLS: company_profiles
CREATE POLICY "Public can view company profiles" ON public.company_profiles FOR SELECT USING (true);
CREATE POLICY "Companies can update their own profile" ON public.company_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Companies can insert their own profile" ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS: company_assessments
CREATE POLICY "Public can view active assessments" ON public.company_assessments FOR SELECT USING (status = 'Active');
CREATE POLICY "Companies can view all their assessments" ON public.company_assessments FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can insert their assessments" ON public.company_assessments FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Companies can update their assessments" ON public.company_assessments FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete their assessments" ON public.company_assessments FOR DELETE USING (auth.uid() = company_id);

-- RLS: assessment_questions
-- Students CANNOT see correct answers. This is a simple policy, more complex logic is needed if we separate question text from answer keys in API.
CREATE POLICY "Companies can view their questions" ON public.assessment_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
CREATE POLICY "Companies can insert questions" ON public.assessment_questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
CREATE POLICY "Companies can update questions" ON public.assessment_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
CREATE POLICY "Companies can delete questions" ON public.assessment_questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
-- Students viewing questions during a test (only if they are candidates for an active assessment)
CREATE POLICY "Candidates can view questions of active assessments" ON public.assessment_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assessment_candidates ac
    JOIN public.company_assessments ca ON ca.id = ac.assessment_id
    WHERE ac.candidate_id = auth.uid() AND ac.assessment_id = assessment_questions.assessment_id AND ca.status = 'Active'
  )
);

-- RLS: assessment_candidates
CREATE POLICY "Companies can view their candidates" ON public.assessment_candidates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
CREATE POLICY "Companies can update their candidates" ON public.assessment_candidates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.company_assessments WHERE id = assessment_id AND company_id = auth.uid())
);
CREATE POLICY "Candidates can view their own test session" ON public.assessment_candidates FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Candidates can insert their test session" ON public.assessment_candidates FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Candidates can update their test session" ON public.assessment_candidates FOR UPDATE USING (auth.uid() = candidate_id);

-- RLS: proctoring_events
CREATE POLICY "Companies can view proctoring events" ON public.proctoring_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assessment_candidates ac
    JOIN public.company_assessments ca ON ca.id = ac.assessment_id
    WHERE ac.id = assessment_candidate_id AND ca.company_id = auth.uid()
  )
);
CREATE POLICY "Candidates can insert their own proctoring events" ON public.proctoring_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.assessment_candidates WHERE id = assessment_candidate_id AND candidate_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_company_assessments_company_id ON public.company_assessments(company_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_assessment_id ON public.assessment_candidates(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_candidate_id ON public.assessment_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_events_assessment_candidate_id ON public.proctoring_events(assessment_candidate_id);
