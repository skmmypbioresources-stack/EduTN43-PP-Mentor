import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, HelpCircle, ExternalLink, Eye, EyeOff, Check, AlertTriangle, X, Sparkles, Loader2 } from 'lucide-react';
import { testApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSaved }: ApiKeyModalProps) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('user_gemini_api_key') || '';
      setKey(savedKey);
      setStatus(savedKey ? 'valid' : 'idle');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('user_gemini_api_key', key.trim());
    if (onSaved) onSaved();
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('user_gemini_api_key');
    setKey('');
    setStatus('idle');
    setErrorMessage('');
    if (onSaved) onSaved();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col z-[101]"
      >
        {/* Header */}
        <div className="p-6 bg-indigo-50/50 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">Gemini AI Settings</h3>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Self-Hosted Developer Sandbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-650 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Why message */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4">
            <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">Why do I need my own API Key?</h4>
              <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                This app is sold for a simple, single-time payment on the Play Store with no subscription fees. 
                Using your own free-tier or pay-as-you-go key ensures you never get billed monthly, and keeps the software run-anywhere, supporting millions of users securely!
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              1-Minute Quick Setup Guide
            </h4>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <ol className="list-decimal list-inside space-y-3 text-xs text-gray-600 font-medium">
                <li>
                  Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold inline-flex items-center gap-1 hover:underline">
                    Google AI Studio <ExternalLink className="w-3. h-3" />
                  </a> and sign in with any Google account.
                </li>
                <li>
                  Click the prominent blue button labeled <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">"Get API key"</span> or <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">"Create API key"</span>.
                </li>
                <li>
                  Choose "Create API Key in new project" (which is free and supports up to 15 requests per minute, easily enough for student projects!).
                </li>
                <li>
                  Copy the generated key (starts with <span className="font-mono text-gray-900 font-black">AIzaSy...</span>).
                </li>
                <li>
                  Paste it into the form below and hit <span className="font-bold">Test Key</span> to verify!
                </li>
              </ol>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2" htmlFor="gemini-key-input">
                Your Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="gemini-key-input"
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setStatus('idle');
                    setErrorMessage('');
                  }}
                  placeholder="AIzaSy..."
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
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

            {/* Status indicators */}
            {status === 'testing' && (
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking API key with the Google Gemini models...</span>
              </div>
            )}

            {status === 'valid' && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                <Check className="w-4 h-4 text-emerald-650" />
                <span>API Key has been verified successfully! The PP Mentor is now fully operational.</span>
              </div>
            )}

            {status === 'invalid' && (
              <div className="flex flex-col gap-1 text-red-650 text-xs bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Validation Failed</span>
                </div>
                {errorMessage && <p className="mt-1 text-gray-600 pl-6 leading-relaxed font-medium">{errorMessage}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center justify-between shrink-0">
          <div>
            {localStorage.getItem('user_gemini_api_key') && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
              >
                Reset / Delete Saved Key
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={status === 'testing' || !key.trim()}
              className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-750 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors"
            >
              Test Key
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={status === 'testing'}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
            >
              Save Key & Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
