// src/pages/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords don't match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else {
        setError("Registration failed. Try again.");
      }
    }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="card fade-in">
        <div className="text-center mb-3">
          <h1>Attend<span className="accent">.</span></h1>
          <p className="muted mt-1">Create your account</p>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" />
          </div>
          <button className="btn btn-primary btn-full mt-2" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <hr className="divider" />
        <p className="text-center muted">
          Already registered?{" "}
          <Link to="/login" style={{ color: "var(--accent2)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
