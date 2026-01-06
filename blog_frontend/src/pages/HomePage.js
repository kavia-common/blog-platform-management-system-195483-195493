import React from "react";
import { usePosts } from "../contexts/PostsContext";
import { PostList } from "../components/PostList";
import { getApiBase } from "../services/api";

// PUBLIC_INTERFACE
export function HomePage() {
  /** Home page: lists posts with refresh + API base hint on failure. */
  const { posts, loading, error, refresh } = usePosts();

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">Latest posts</h1>
          <p className="page-subtitle">Browse posts, open details, and join the discussion.</p>
        </div>
        <div className="row">
          <button type="button" className="btn" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-error" style={{ marginBottom: 14 }}>
          {error}{" "}
          <span style={{ display: "block", marginTop: 6 }} className="help">
            API base: <strong>{getApiBase()}</strong>. Set <code>REACT_APP_API_BASE</code> (preferred) or{" "}
            <code>REACT_APP_BACKEND_URL</code>.
          </span>
        </div>
      ) : null}

      {loading ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">Loading posts…</div>
          </div>
        </div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
