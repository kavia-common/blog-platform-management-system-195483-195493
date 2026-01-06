# Blog Frontend (React)

A modern, light-themed blog frontend with:
- Post list + post details
- Create/edit/delete posts (authenticated)
- Comments with an "Add comment" modal
- Admin dashboard to manage posts and comments (authenticated + role-based when backend provides roles)

## Environment variables

This frontend connects to a backend via REST APIs. Configure the API base URL via:

- `REACT_APP_API_BASE` (preferred) — e.g. `http://localhost:8000/api`
- `REACT_APP_BACKEND_URL` (fallback) — e.g. `http://localhost:8000`

If `REACT_APP_BACKEND_URL` is used, the app will default to `${REACT_APP_BACKEND_URL}/api` as the API base.

Copy `.env.example` to `.env` and adjust values for your environment.

## Routing

- `/` Home (list posts)
- `/posts/:id` Post details + comments + add comment modal
- `/editor` Create post (protected)
- `/editor/:id` Edit post (protected)
- `/login` Login
- `/register` Register
- `/admin` Admin dashboard (protected; requires admin role if available)

## Auth storage

Auth token and basic user info are stored in `localStorage`:
- `blog_auth_token`
- `blog_auth_user`

The API client attaches `Authorization: Bearer <token>` when present and handles `401/403` by logging out.

## Notes about backend endpoints

The API client uses standard REST patterns and is intentionally conservative. It supports common endpoints like:

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /posts/:id/comments`
- `POST /posts/:id/comments`
- `DELETE /comments/:id` (admin)
- `POST /auth/login`
- `POST /auth/register`
- `GET /me` (optional)

If your backend differs, adjust `src/services/api.js` in one place.
"""
