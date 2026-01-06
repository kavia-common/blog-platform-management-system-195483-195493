import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function ProtectedRoute({ children, requireAdmin = false }) {
  /** Protects routes requiring authentication; optionally restrict to admins. */
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container main">
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">Loading…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container main">
        <div className="card">
          <div className="card-body">
            <div className="alert alert-error">You do not have access to this page.</div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
