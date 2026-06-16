import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SectionView from './components/SectionView';
import Band7Checklist from './components/Band7Checklist';
import ExaminerExpectations from './components/ExaminerExpectations';
import Resources from './components/Resources';
import ProcessJournal from './components/ProcessJournal';
import Navbar from './components/Navbar';
import ApiKeyGate from './components/ApiKeyGate';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(!!localStorage.getItem('user_gemini_api_key'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync state if localStorage changes directly
  useEffect(() => {
    const checkKey = () => setHasApiKey(!!localStorage.getItem('user_gemini_api_key'));
    window.addEventListener('storage', checkKey);
    return () => window.removeEventListener('storage', checkKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <AnimatePresence mode="wait">
          {!user ? (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : !hasApiKey ? (
            <ApiKeyGate onActivate={() => setHasApiKey(true)} />
          ) : (
            <>
              <Navbar user={user} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/section/:sectionId" element={<SectionView />} />
                  <Route path="/checklist" element={<Band7Checklist />} />
                  <Route path="/expectations" element={<ExaminerExpectations />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/journal" element={<ProcessJournal />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
