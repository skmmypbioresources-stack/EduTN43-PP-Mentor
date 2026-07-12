import { useState } from 'react';
import { motion } from 'motion/react';
import { Key, HelpCircle, ExternalLink, Eye, EyeOff, Check, AlertTriangle, Sparkles, Loader2, LogOut, CheckCircle2 } from 'lucide-react';
import { testApiKey } from '../services/geminiService';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface ApiKeyGateProps {
  onActivate: () => void;
}

export default function ApiKeyGate({ onActivate }: ApiKeyGateProps) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    if (!key.trim() || status !== 'valid') return;
    localStorage.setItem('user_gemini_api_key', key.trim());
    onActivate();
  };

  const handleTest = async () => {
    if (!key.trim()) {
      setStatus('invalid');
      setErrorMessage('Please enter an API key to test.');
      return;
    }

    setStatus('testing');
    setErrorMessage('');
    try {
      const isValid = await testApiKey(key.trim());
      if (isValid) {
        setStatus('valid');
      } else {
        setStatus('invalid');
        setErrorMessage('The API key returned an invalid response. Please verify the key and try again.');
      }
    } catch (err: any) {
      setStatus('invalid');
      setErrorMessage(err?.message || 'Verification failed. Make sure your internet is working and the API key is active.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-45 -right-45 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10 flex flex-col space-y-8"
      >
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-150/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">License Activation</h2>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-0.5">Setup Your Free Gemini API Key</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-650 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-xl transition-all uppercase self-start md:self-center"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Informative Intro Banner */}
        <div className="bg-indigo-50/70 border border-indigo-100/30 rounded-3xl p-6 flex gap-4">
          <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-indigo-900">Why is this required?</h4>
            <p className="text-xs text-indigo-800 leading-relaxed font-semibold">
              To support millions of global users on a simple low cost play store purchase without requiring ongoing expensive subscriptions, 
              the toolkit accesses Gemini securely via your own free developer key. Setting this up takes less than 60 seconds!
            </p>
          </div>
        </div>

        {/* Clear 1-Minute Walkthrough Guide */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            1-Minute Activation Walkthrough
          </h4>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-650 font-semibold leading-relaxed">
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-805 rounded-md text-[10px] font-black uppercase tracking-wider">Step 1</span>
                <p>
                  Visit the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                    Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
                  </a> and log in using any standard Google account.
                </p>
              </div>
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-805 rounded-md text-[10px] font-black uppercase tracking-wider">Step 2</span>
                <p>
                  Click the blue button to <span className="font-bold text-gray-900 bg-white/80 border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">"Get API Key"</span> and choose your project.
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-150/50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
               🔑 Your key resides purely on your own device and is never sent to any external server.
            </div>
          </div>
        </div>

        {/* Password Paste Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2" htmlFor="activate-key-input">
              Paste API Key
            </label>
            <div className="relative">
              <input
  id="activate-key-input"
  type={showKey ? 'text' : 'password'}
  value={key}
  onChange={(e) => {
    setKey(e.target.value);
    setStatus('idle');
    setErrorMessage('');
  }}
  onCopy={(e) => e.stopPropagation()}
  onCut={(e) => e.stopPropagation()}
  onPaste={(e) => e.stopPropagation()}
  onContextMenu={(e) => e.stopPropagation()}
  onKeyDown={(e) => e.stopPropagation()}
  placeholder="AIzaSy..."
  className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-150 rounded-3xl text-sm font-mono focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
/>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Verification feedback views */}
          {status === 'testing' && (
            <div className="flex items-center gap-3 text-indigo-600 text-xs font-bold px-1 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying your Google Gemini connection...</span>
            </div>
          )}

          {status === 'valid' && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 text-emerald-600 text-xs font-bold bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100"
            >
              <Check className="w-5 h-5 shrink-0" />
              <span>API key connected successfully! Hit the activate button below to open the toolkit.</span>
            </motion.div>
          )}

          {status === 'invalid' && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col gap-2 text-red-650 text-xs bg-red-50 p-5 rounded-2xl border border-red-100"
            >
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Verification Failed</span>
              </div>
              {errorMessage && <p className="text-gray-600 font-medium pl-6 leading-relaxed">{errorMessage}</p>}
            </motion.div>
          )}
        </div>

        {/* Footer actions with CTA button */}
        <div className="pt-6 border-t border-gray-150/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent shrink-0">
          <span className="text-[10px] text-gray-450 font-black uppercase tracking-widest text-center sm:text-left">
            🔒 Sandbox Environment Secured
          </span>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleTest}
              disabled={status === 'testing' || !key.trim()}
              className="flex-1 sm:flex-none px-6 py-4 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-black uppercase tracking-wider hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Verify Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={status !== 'valid' || status === 'testing'}
              className="flex-1 sm:flex-none px-8 py-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-150 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              Activate Companion <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
