import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../components/Modal";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

// PUBLIC_INTERFACE
export function PostDetailPage() {
  /** Post details with comments and Add Comment modal. */
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [postError, setPostError] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentsError, setCommentsError] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentSubmitError, setCommentSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const postId = useMemo(() => id, [id]);

  async function loadPost() {
    setPostError("");
    setLoadingPost(true);
    try {
      const data = await api.getPost(postId);
      setPost(data?.post || data);
    } catch (e) {
      setPostError(e?.message || "Failed to load post.");
      setPost(null);
    } finally {
      setLoadingPost(false);
    }
  }

  async function loadComments() {
    setCommentsError("");
    setLoadingComments(true);
    try {
      const data = await api.listComments(postId);
      const items = Array.isArray(data) ? data : data?.items || data?.comments || [];
      setComments(items);
    } catch (e) {
      setCommentsError(e?.message || "Failed to load comments.");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadPost();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function onDeletePost() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.deletePost(postId);
      navigate("/");
    } catch (e) {
      setPostError(e?.message || "Failed to delete post.");
    }
  }

  async function onDeleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.deleteComment(commentId);
      await loadComments();
    } catch (e) {
      setCommentsError(e?.message || "Failed to delete comment.");
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    setCommentSubmitError("");

    const body = commentBody.trim();
    const author = commentAuthor.trim();

    if (!body) {
      setCommentSubmitError("Comment is required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.addComment(postId, { author, body });
      setShowModal(false);
      setCommentAuthor("");
      setCommentBody("");
      await loadComments();
    } catch (err) {
      setCommentSubmitError(err?.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  }

  const resolvedId = post?.id ?? post?._id ?? postId;

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">{post?.title || (loadingPost ? "Loading…" : "Post")}</h1>
          <p className="page-subtitle">
            {post?.author?.name || post?.author ? (
              <>
                By <strong>{post?.author?.name || post?.author}</strong>
              </>
            ) : (
              " "
            )}
            {post?.createdAt || post?.created_at ? (
              <>
                {" "}
                · <span>{formatDate(post.createdAt || post.created_at)}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="row">
          <Link className="btn" to="/">
            Back
          </Link>
          {isAuthenticated ? (
            <Link className="btn btn-primary" to={`/editor/${encodeURIComponent(resolvedId)}`}>
              Edit
            </Link>
          ) : null}
          {isAuthenticated && isAdmin ? (
            <button type="button" className="btn btn-danger" onClick={onDeletePost}>
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {postError ? <div className="alert alert-error">{postError}</div> : null}

      {loadingPost ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">Loading post…</div>
          </div>
        </div>
      ) : post ? (
        <div className="card">
          <div className="card-body">
            <div style={{ textAlign: "left", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {post?.content || "No content."}
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ height: 16 }} />

      <div className="page-header">
        <div>
          <h2 className="page-title" style={{ fontSize: 20 }}>
            Comments
          </h2>
          <p className="page-subtitle">Add your thoughts. Comments are shown below.</p>
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add comment
          </button>
          <button type="button" className="btn" onClick={loadComments} disabled={loadingComments}>
            Refresh
          </button>
        </div>
      </div>

      {commentsError ? <div className="alert alert-error">{commentsError}</div> : null}

      {loadingComments ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">Loading comments…</div>
          </div>
        </div>
      ) : comments.length ? (
        <div className="grid">
          {comments.map((c) => {
            const cid = c?.id ?? c?._id;
            return (
              <div className="card" key={cid ?? JSON.stringify(c)}>
                <div className="card-body">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="card-meta">
                      {c?.author?.name || c?.author || "Anonymous"}
                      {c?.createdAt || c?.created_at ? (
                        <>
                          {" "}
                          · <span>{formatDate(c.createdAt || c.created_at)}</span>
                        </>
                      ) : null}
                    </div>
                    {isAuthenticated && isAdmin && cid ? (
                      <button type="button" className="btn btn-danger" onClick={() => onDeleteComment(cid)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                  <div style={{ marginTop: 10, textAlign: "left", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {c?.body || c?.content || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">No comments yet. Be the first to comment.</div>
          </div>
        </div>
      )}

      {showModal ? (
        <Modal
          title="Add comment"
          onClose={() => {
            if (!submitting) setShowModal(false);
          }}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setShowModal(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" form="comment-form" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Posting…" : "Post comment"}
              </button>
            </>
          }
        >
          <form id="comment-form" className="form" onSubmit={submitComment}>
            {!isAuthenticated ? (
              <div className="alert alert-info">
                You are not logged in. Depending on backend policy, anonymous comments may still be accepted.
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="comment-author">Name (optional)</label>
              <input
                id="comment-author"
                className="input"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="field">
              <label htmlFor="comment-body">Comment</label>
              <textarea
                id="comment-body"
                className="textarea"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Write your comment…"
              />
            </div>

            {commentSubmitError ? <div className="alert alert-error">{commentSubmitError}</div> : null}
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
