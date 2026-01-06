const TOKEN_KEY = "blog_auth_token";
const USER_KEY = "blog_auth_user";

// PUBLIC_INTERFACE
export function getStoredToken() {
  /** Returns the stored auth token or null. */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setStoredToken(token) {
  /** Stores auth token in localStorage. */
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function getStoredUser() {
  /** Returns parsed user object or null. */
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setStoredUser(user) {
  /** Stores user object in localStorage. */
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function clearStoredAuth() {
  /** Clears auth token + user from localStorage. */
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
