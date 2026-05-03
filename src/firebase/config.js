// src/firebase/config.js
// ─────────────────────────────────────────────
// REPLACE the values below with your own Firebase project credentials.
// See FIREBASE_SETUP.md for step-by-step instructions.
// ─────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTyiQpwbZsADhnvOMkIrVkW9gfH_wNuzo",
  authDomain: "il-attendance.firebaseapp.com",
  projectId: "il-attendance",
  storageBucket: "il-attendance.firebasestorage.app",
  messagingSenderId: "195646030576",
  appId: "1:195646030576:web:d3c9f473f6b7f2586eb835",
  measurementId: "G-1797F9KVPW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
