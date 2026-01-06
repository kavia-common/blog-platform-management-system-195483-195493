import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

// PUBLIC_INTERFACE
export function PostEditorPage() {
  /** Create/edit post editor (protected via route wrapper). */
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);
  const postId = useMemo(() => id, [id]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!editing) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.getPost(postId);
        const post = data?.post || data;
        if (!mounted) return;
        setTitle(post?.title || "");
        setContent(post?.content || "");
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load post for editing.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [editing, postId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const t = title.trim();
    const c = content.trim();

    if (!t) {
      setError("Title is required.");
      return;
    }
    if (c.length < 20) {
      setError("Content must be at least 20 characters.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.updatePost(postId, { title: t, content: c });
        navigate(`/posts/${encodeURIComponent(postId)}`);
      } else {
        const created = await api.createPost({ title: t, content: c });
        const newId = created?.id ?? created?._id ?? created?.post?.id ?? created?.post?._id;
        navigate(newId ? `/posts/${encodeURIComponent(newId)}` : "/");
      }
    } catch (err) {
      setError(err?.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container main">
      <div className="page-header">
        <div>
          <h1 className="page-title">{editing ? "Edit post" : "Create post"}</h1>
          <p className="page-subtitle">Write your post and publish it to the feed.</p>
        </div>
        <div className="row">
          <Link className="btn" to={editing ? `/posts/${encodeURIComponent(postId)}` : "/"}>
            Cancel
          </Link>
          <button type="submit" form="post-editor-form" className="btn btn-primary" disabled={saving || loading}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {loading ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info">Loading editor…</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form id="post-editor-form" className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A clear, compelling title"
                />
              </div>

              <div className="field">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  className="textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post…"
                />
                <div className="help">Minimum 20 characters. Markdown support depends on backend rendering.</div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
