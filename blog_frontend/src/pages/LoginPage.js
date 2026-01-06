import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login page for basic authentication. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const em = email.trim();
    const pw = password;

    if (!em) {
      setError("Email is required.");
      return;
    }
    if (!pw) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: em, password: pw });
      const to = location.state?.from || "/";
      navigate(to);
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">Sign in to create posts and access admin features.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error ? <div className="alert alert-error">{error}</div> : null}

            <div className="row" style={{ justifyContent: "space-between" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
              <Link className="btn" to="/register">
                Create account
              </Link>
            </div>

            <div className="help">
              Note: token handling assumes the backend returns a token on <code>/auth/login</code>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
