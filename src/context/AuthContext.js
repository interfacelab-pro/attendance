// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const ADMIN_EMAIL = "contact@interfacelab.pro";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' | 'intern'
  const [loading, setLoading] = useState(true);

  async function register(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    // Auto-assign admin role if this is the admin email
    const role = email.toLowerCase() === ADMIN_EMAIL ? "admin" : "intern";
    await setDoc(doc(db, "users", result.user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      hourlyRate: null,
    });
    return result;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fallback: if email matches admin, set admin role immediately
        if (user.email.toLowerCase() === ADMIN_EMAIL) {
          setUserRole("admin");
          setLoading(false);
          return;
        }
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole("intern");
          }
        } catch (err) {
          console.error("Could not fetch user role:", err);
          setUserRole("intern");
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, userRole, register, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
