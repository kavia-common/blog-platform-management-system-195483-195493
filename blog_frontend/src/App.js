import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { PostEditorPage } from "./pages/PostEditorPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

// PUBLIC_INTERFACE
function App() {
  /** App entry with routes and shared layout. */
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/posts/:id" element={<PostDetailPage />} />

        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <PostEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <PostEditorPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
