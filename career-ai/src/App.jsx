import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import CareerRecommendations from './pages/CareerRecommendations';
import CareerDetails from './pages/CareerDetails';
import LearningRoadmap from './pages/LearningRoadmap';
import Courses from './pages/Courses';
import Opportunities from './pages/Opportunities';
import Chat from './pages/Chat';

// Company & Candidate Routes
import CompanyDashboard from './pages/company/CompanyDashboard';
import CreateAssessment from './pages/company/CreateAssessment';
import AssessmentBuilder from './pages/company/AssessmentBuilder';
import CandidateList from './pages/company/CandidateList';
import CandidateDetails from './pages/company/CandidateDetails';
import AssessmentList from './pages/company/AssessmentList';
import CompanySettings from './pages/company/CompanySettings';
import AssessmentLobby from './pages/candidate/AssessmentLobby';
import SecureTest from './pages/candidate/SecureTest';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute>
                <CareerRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers/:id"
            element={
              <ProtectedRoute>
                <CareerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <LearningRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap/:careerId"
            element={
              <ProtectedRoute>
                <LearningRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            }
          />
          
          {/* Company Routes */}
          <Route path="/company-dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company-assessments" element={<ProtectedRoute><AssessmentList /></ProtectedRoute>} />
          <Route path="/company-assessments/create" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
          <Route path="/company-assessments/:id/build" element={<ProtectedRoute><AssessmentBuilder /></ProtectedRoute>} />
          <Route path="/company-candidates" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
          <Route path="/company-candidates/:id" element={<ProtectedRoute><CandidateDetails /></ProtectedRoute>} />
          <Route path="/company-settings" element={<ProtectedRoute><CompanySettings /></ProtectedRoute>} />
          
          {/* Candidate Secure Test Routes */}
          <Route path="/test-lobby/:id" element={<ProtectedRoute><AssessmentLobby /></ProtectedRoute>} />
          <Route path="/test/:id/session/:sessionId" element={<ProtectedRoute><SecureTest /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
