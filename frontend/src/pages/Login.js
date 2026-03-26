import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login, guestLogin, authChecked } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authChecked && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authChecked, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (!authChecked || user) {
    return null; // or <Loader /> while redirecting
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="sub">Sign in to rate stores and manage your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Login
          </button>

          <div style={{ height: 12 }} />
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%" }}
            onClick={guestLogin}
          >
            Guest login
          </button>
        </form>
        <p className="link-row">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
