import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Products from './pages/Products';
import SheetMusic from './pages/SheetMusic';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import FloatingChat from './components/Layout/FloatingChat';
import PageTransition from './components/UI/PageTransition';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/sheet-music" element={<PageTransition><SheetMusic /></PageTransition>} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TeacherDashboard />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <RoleProtectedRoute requiredRole="superadmin" redirectTo="/teacher">
              <PageTransition>
                <SuperAdminDashboard />
              </PageTransition>
            </RoleProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
