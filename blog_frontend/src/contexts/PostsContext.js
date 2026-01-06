import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const PostsContext = createContext(null);

// PUBLIC_INTERFACE
export function PostsProvider({ children }) {
  /** Provides basic posts state for list pages and refresh triggers. */
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const res = await api.listPosts();
      // Support both array and {items: []} responses.
      const items = Array.isArray(res) ? res : res?.items || res?.posts || [];
      setPosts(items);
    } catch (e) {
      setError(e?.message || "Failed to load posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      refresh,
      setPosts
    }),
    [posts, loading, error]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

// PUBLIC_INTERFACE
export function usePosts() {
  /** Hook to access posts context. */
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within a PostsProvider");
  return ctx;
}
