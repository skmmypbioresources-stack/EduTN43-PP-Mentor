import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SocialLogin } from '@capgo/capacitor-social-login';

import './pwa';          // ← NEW
import App from './App.tsx';
import './index.css';

async function startApp() {
  await SocialLogin.initialize({
    google: {
      webClientId: '931614915911-miivpjd5t5jtiehkhatnjkec01nsalgb.apps.googleusercontent.com',
      mode: 'online',
    },
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

startApp().catch((err) => {
  console.error('Failed to initialize Social Login:', err);
});