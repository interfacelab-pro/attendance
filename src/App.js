// src/App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import QRPage from "./pages/QRPage";
import "./App.css";

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (adminOnly && userRole !== "admin") return <Navigate to="/dashboard" />;
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  if (currentUser) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/dashboard"} />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
      <Route path="/qr" element={<QRPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
