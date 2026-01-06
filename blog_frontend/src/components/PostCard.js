import React from "react";
import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

// PUBLIC_INTERFACE
export function PostCard({ post }) {
  /** Displays a post summary. */
  const title = post?.title || "Untitled";
  const excerpt =
    post?.excerpt ||
    (post?.content ? String(post.content).slice(0, 180) : "") ||
    "No content yet.";
  const id = post?.id ?? post?._id;

  return (
    <article className="card">
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/posts/${encodeURIComponent(id)}`}>{title}</Link>
        </h3>
        <div className="card-meta">
          {post?.author?.name || post?.author || "Unknown author"}
          {post?.createdAt || post?.created_at ? (
            <>
              {" · "}
              {formatDate(post.createdAt || post.created_at)}
            </>
          ) : null}
        </div>
        <p className="card-excerpt">{excerpt}</p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link className="btn btn-primary" to={`/posts/${encodeURIComponent(id)}`}>
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}
