import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Register page for new users. */
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const em = email.trim();
    if (!em) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({ email: em, password });
      // If backend doesn't auto-login, guide user to login.
      if (!res?.token && !res?.access_token && !res?.accessToken) {
        setInfo("Account created. Please log in.");
        setTimeout(() => navigate("/login"), 500);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">Create an account to post and comment.</p>
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
                placeholder="Create a strong password"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                className="input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                type="password"
                autoComplete="new-password"
              />
            </div>

            {error ? <div className="alert alert-error">{error}</div> : null}
            {info ? <div className="alert alert-info">{info}</div> : null}

            <div className="row" style={{ justifyContent: "space-between" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating…" : "Create account"}
              </button>
              <Link className="btn" to="/login">
                I already have an account
              </Link>
            </div>

            <div className="help">
              Note: registration expects <code>/auth/register</code>. Some backends may require username fields; update payload in{" "}
              <code>src/services/api.js</code> if needed.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
