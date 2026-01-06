import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../services/api";

function toId(obj) {
  return obj?.id ?? obj?._id;
}

// PUBLIC_INTERFACE
export function AdminDashboardPage() {
  /** Admin management view for posts and comments (requires admin route protection). */
  const [active, setActive] = useState("posts");

  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState("");
  const [postsLoading, setPostsLoading] = useState(true);

  const [postIdForComments, setPostIdForComments] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsError, setCommentsError] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  async function loadPosts() {
    setPostsError("");
    setPostsLoading(true);
    try {
      const res = await api.listPosts();
      const items = Array.isArray(res) ? res : res?.items || res?.posts || [];
      setPosts(items);
    } catch (e) {
      setPostsError(e?.message || "Failed to load posts.");
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  async function loadCommentsForPost(pid) {
    setCommentsError("");
    setCommentsLoading(true);
    try {
      const res = await api.listComments(pid);
      const items = Array.isArray(res) ? res : res?.items || res?.comments || [];
      setComments(items);
    } catch (e) {
      setCommentsError(e?.message || "Failed to load comments.");
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function deletePost(pid) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.deletePost(pid);
      await loadPosts();
    } catch (e) {
      setPostsError(e?.message || "Failed to delete post.");
    }
  }

  async function deleteComment(cid) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.deleteComment(cid);
      if (postIdForComments) await loadCommentsForPost(postIdForComments);
    } catch (e) {
      setCommentsError(e?.message || "Failed to delete comment.");
    }
  }

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin dashboard</h1>
          <p className="page-subtitle">Manage posts and comments across the platform.</p>
        </div>
      </div>

      <div className="split">
        <aside className="card sidebar" aria-label="Admin sidebar">
          <h3>Manage</h3>
          <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="#" onClick={() => setActive("posts")}>
            Posts
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="#" onClick={() => setActive("comments")}>
            Comments
          </NavLink>
          <div className="divider" style={{ margin: "12px 0" }} />
          <div className="help">
            Some admin actions require backend support for admin roles and endpoints (e.g. <code>DELETE /comments/:id</code>).
          </div>
        </aside>

        <section className="card">
          <div className="card-body">
            {active === "posts" ? (
              <>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.02em" }}>All posts</h2>
                  <button type="button" className="btn" onClick={loadPosts} disabled={postsLoading}>
                    Refresh
                  </button>
                </div>

                {postsError ? <div className="alert alert-error" style={{ marginTop: 12 }}>{postsError}</div> : null}

                {postsLoading ? (
                  <div className="alert alert-info" style={{ marginTop: 12 }}>Loading posts…</div>
                ) : posts.length ? (
                  <div className="grid" style={{ marginTop: 12 }}>
                    {posts.map((p) => {
                      const pid = toId(p);
                      return (
                        <div key={pid ?? JSON.stringify(p)} className="card">
                          <div className="card-body">
                            <div className="row" style={{ justifyContent: "space-between" }}>
                              <div>
                                <div className="card-title">{p?.title || "Untitled"}</div>
                                <div className="card-meta">ID: {String(pid)}</div>
                              </div>
                              <div className="row">
                                <button type="button" className="btn btn-danger" onClick={() => deletePost(pid)} disabled={!pid}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="alert alert-info" style={{ marginTop: 12 }}>No posts found.</div>
                )}
              </>
            ) : (
              <>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.02em" }}>Comments by post</h2>
                </div>

                <div className="form" style={{ marginTop: 12 }}>
                  <div className="field">
                    <label htmlFor="postId">Post ID</label>
                    <input
                      id="postId"
                      className="input"
                      value={postIdForComments}
                      onChange={(e) => setPostIdForComments(e.target.value)}
                      placeholder="Enter a post ID to load comments"
                    />
                    <div className="help">Paste an existing post id (from the Posts tab or the URL).</div>
                  </div>
                  <div className="row">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => loadCommentsForPost(postIdForComments)}
                      disabled={!postIdForComments || commentsLoading}
                    >
                      {commentsLoading ? "Loading…" : "Load comments"}
                    </button>
                  </div>
                </div>

                {commentsError ? <div className="alert alert-error" style={{ marginTop: 12 }}>{commentsError}</div> : null}

                {!commentsLoading && postIdForComments && comments.length === 0 ? (
                  <div className="alert alert-info" style={{ marginTop: 12 }}>No comments found for this post.</div>
                ) : null}

                {comments.length ? (
                  <div className="grid" style={{ marginTop: 12 }}>
                    {comments.map((c) => {
                      const cid = toId(c);
                      return (
                        <div key={cid ?? JSON.stringify(c)} className="card">
                          <div className="card-body">
                            <div className="row" style={{ justifyContent: "space-between" }}>
                              <div>
                                <div className="card-meta">
                                  {c?.author?.name || c?.author || "Anonymous"} · Comment ID: {String(cid)}
                                </div>
                                <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                                  {c?.body || c?.content || ""}
                                </div>
                              </div>
                              <div className="row">
                                <button type="button" className="btn btn-danger" onClick={() => deleteComment(cid)} disabled={!cid}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
