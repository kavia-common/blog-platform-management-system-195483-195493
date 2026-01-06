import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function Header() {
  /** App header with navigation and auth-aware actions. */
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="Go to home">
          <span className="brand-dot" aria-hidden="true" />
          Blog
        </NavLink>

        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/editor">Create</NavLink>
          ) : null}
          {isAuthenticated && isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="chip" title="Signed in">
                {user?.email || user?.username || "Authenticated"}
              </span>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="btn" to="/login">
                Login
              </NavLink>
              <NavLink className="btn btn-primary" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
