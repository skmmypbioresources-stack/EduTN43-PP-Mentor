import { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, CheckCircle2, BookOpen, Key } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(!!localStorage.getItem('user_gemini_api_key'));

  useEffect(() => {
    const checkKey = () => setHasKey(!!localStorage.getItem('user_gemini_api_key'));
    window.addEventListener('storage', checkKey);
    return () => window.removeEventListener('storage', checkKey);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo size="sm" showText={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight leading-none text-gray-900">PP Mentor</span>
                <span className="text-[9px] font-black text-indigo-600 tracking-[0.15em] uppercase leading-none mt-0.5">EduTN43</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/checklist" 
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2"
              title="Full Checklist"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold hidden md:block">Final Checklist</span>
            </Link>

            <Link 
              to="/expectations" 
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
              title="Examiner Expectations"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold hidden md:block">Expectations</span>
            </Link>

            <Link 
              to="/" 
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
              title="Gemini API Key Settings"
            >
              <Key className="w-5 h-5" />
              {!hasKey && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-1" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">{user.displayName}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <button 
                id="logout-btn"
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSaved={() => setHasKey(!!localStorage.getItem('user_gemini_api_key'))} 
      />
    </nav>
  );
}
