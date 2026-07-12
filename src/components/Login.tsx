import { signInWithPopup, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { useState } from 'react';
import BrandLogo from './BrandLogo';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android/iOS: use the platform's native Google Sign-In SDK.
        // signInWithPopup/signInWithRedirect do not work inside a WebView —
        // Google blocks OAuth from embedded webviews (disallowed_useragent).
        const result = await FirebaseAuthentication.signInWithGoogle();

        // FirebaseAuthentication signs the user in on the native layer only.
        // We still need to hand the credential to the Firebase JS SDK so that
        // auth.currentUser / onAuthStateChanged in the rest of the app
        // (Firestore reads, security rules, etc.) see the signed-in user.
        const idToken = result.credential?.idToken;
        const accessToken = result.credential?.accessToken;

        if (!idToken) {
          throw new Error('No ID token returned from native Google Sign-In.');
        }

        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credential);
      } else {
        // Web: the normal Firebase popup flow works fine in a real browser.
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (err: any) {
      console.error('Firebase Login Error:', err);

      setError(
        err?.message ||
        err?.code ||
        'Unknown Firebase authentication error.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-gray-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex flex-col items-center">
            <BrandLogo size="lg" showText={true} />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Personal Project Mentor
          </h1>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Your guided supervisor for the IB MYP Personal Project.
            Think deeper, reflect better, and reach Band 7.
          </p>

          {error && (
            <div className="w-full p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            id="google-login-btn"
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full"
              />
            ) : (
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
            )}

            Sign in with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}