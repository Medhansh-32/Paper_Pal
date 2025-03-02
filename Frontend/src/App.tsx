import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UploadMaterialPage from './pages/UploadMaterialPage';
import DownloadMaterialPage from './pages/DownloadMaterialPage';
import SolveDoubtsPage from './pages/SolveDoubtsPage';
import DoubtDetailPage from './pages/DoubtDetailPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
 
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/upload-material" element={
                <ProtectedRoute>
                  <UploadMaterialPage />
                </ProtectedRoute>
              } />
              <Route path="/download-material" element={
                <ProtectedRoute>
                  <DownloadMaterialPage />
                </ProtectedRoute>
              } />
              <Route path="/solve-doubts" element={
                <ProtectedRoute>
                  <SolveDoubtsPage />
                </ProtectedRoute>
              } />
              <Route path="/doubt/:id" element={
                <ProtectedRoute>
                  <DoubtDetailPage />
                </ProtectedRoute>
              } />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;