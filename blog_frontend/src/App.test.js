import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";

test("renders app brand", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  const brand = screen.getByLabelText(/go to home/i);
  expect(brand).toBeInTheDocument();
});
