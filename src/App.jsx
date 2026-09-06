import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import CareerRecommendations from './pages/CareerRecommendations';
import CareerDetails from './pages/CareerDetails';
import LearningRoadmap from './pages/LearningRoadmap';
import Opportunities from './pages/Opportunities';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/careers" element={<CareerRecommendations />} />
        <Route path="/careers/:id" element={<CareerDetails />} />
        <Route path="/roadmap/:careerId" element={<LearningRoadmap />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </BrowserRouter>
  );
}
