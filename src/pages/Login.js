// src/pages/Login.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="card fade-in">
        <div className="text-center mb-3">
          <h1>Attend<span className="accent">.</span></h1>
          <p className="muted mt-1">Sign in to your account</p>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-full mt-2" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <hr className="divider" />
        <p className="text-center muted">
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent2)" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
