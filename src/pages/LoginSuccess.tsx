import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Store JWT securely (localStorage for SPA, HttpOnly cookie for max security in production)
      localStorage.setItem("jwt", token);
      // Optionally: set user context, fetch user info, etc.
      navigate("/"); // Redirect to home or dashboard
    } else {
      // Handle error
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
} 