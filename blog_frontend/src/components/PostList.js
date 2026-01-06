import React from "react";
import { PostCard } from "./PostCard";

// PUBLIC_INTERFACE
export function PostList({ posts }) {
  /** Renders a list of posts. */
  if (!posts?.length) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-info">No posts found yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid" aria-label="Posts list">
      {posts.map((p) => (
        <PostCard key={p?.id ?? p?._id ?? JSON.stringify(p)} post={p} />
      ))}
    </div>
  );
}
