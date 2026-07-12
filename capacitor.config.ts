import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edutn43.ppmentor',
  appName: 'PP Mentor',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },

  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;