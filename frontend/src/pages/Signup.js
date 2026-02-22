import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { user, signup, authChecked } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (authChecked && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authChecked, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, email, password, role);
  };

  if (!authChecked || user) {
    return null;
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Sign up</h1>
        <p className="sub">Create an account to rate stores.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-role">Role</label>
            <select
              id="signup-role"
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Sign up
          </button>
        </form>
        <p className="link-row">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
