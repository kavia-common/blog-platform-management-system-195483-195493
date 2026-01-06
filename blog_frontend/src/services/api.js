/**
 * Minimal REST client for the blog backend.
 * Uses REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL (fallback).
 *
 * Endpoint defaults are conservative and follow standard REST patterns.
 */

import { getStoredToken, clearStoredAuth } from "../utils/authStorage";

function normalizeBase(base) {
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function computeApiBase() {
  const direct = normalizeBase(process.env.REACT_APP_API_BASE || "");
  if (direct) return direct;

  const backendUrl = normalizeBase(process.env.REACT_APP_BACKEND_URL || "");
  if (!backendUrl) return "/api"; // relative default (proxy setups)
  return `${backendUrl}/api`;
}

const API_BASE = computeApiBase();

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = getStoredToken();

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (res.status === 401 || res.status === 403) {
    // If token is invalid/expired, log out to prevent locked state.
    clearStoredAuth();
  }

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Get all posts. Supports optional query params if backend provides them. */
  async listPosts() {
    return request("/posts", { method: "GET" });
  },

  /** Get a single post by id. */
  async getPost(postId) {
    return request(`/posts/${encodeURIComponent(postId)}`, { method: "GET" });
  },

  /** Create a new post (auth required). */
  async createPost(payload) {
    return request("/posts", { method: "POST", body: JSON.stringify(payload) });
  },

  /** Update an existing post (auth required). */
  async updatePost(postId, payload) {
    return request(`/posts/${encodeURIComponent(postId)}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  /** Delete a post (auth required; admin may be required). */
  async deletePost(postId) {
    return request(`/posts/${encodeURIComponent(postId)}`, { method: "DELETE" });
  },

  /** Get comments for a post. */
  async listComments(postId) {
    return request(`/posts/${encodeURIComponent(postId)}/comments`, {
      method: "GET"
    });
  },

  /** Add a comment to a post (auth optional depending on backend policy). */
  async addComment(postId, payload) {
    return request(`/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  /** Delete a comment by id (admin typically). */
  async deleteComment(commentId) {
    return request(`/comments/${encodeURIComponent(commentId)}`, {
      method: "DELETE"
    });
  },

  /** Login using standard auth pattern. Expects token in response. */
  async login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  /** Register user. Expects token or user in response depending on backend. */
  async register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  /** Optional endpoint. If unavailable, caller should handle gracefully. */
  async me() {
    return request("/me", { method: "GET" });
  }
};

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the resolved API base for display/debug. */
  return API_BASE;
}
