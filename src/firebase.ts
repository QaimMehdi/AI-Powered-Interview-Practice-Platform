// src/firebase.ts
// --- Firebase configuration and initialization ---
// Import the functions you need from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration (replace with your own keys)
// These keys are safe to use in frontend code, but keep your Admin SDK keys secret (backend only)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY', // TODO: Replace with your Firebase project's API key
  authDomain: 'YOUR_AUTH_DOMAIN', // TODO: Replace with your Firebase Auth domain
  projectId: 'YOUR_PROJECT_ID', // TODO: Replace with your Firebase project ID
  appId: 'YOUR_APP_ID', // TODO: Replace with your Firebase App ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 