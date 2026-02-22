import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const displayName = user?.name?.trim();
  const firstName = displayName?.includes(" ")
    ? displayName.split(" ")[0]
    : displayName;
  const greeting = firstName ? `Hi, ${firstName}` : user?.email || "Account";

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">Store Rating Platform</Link>
      <nav className="navbar-nav">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === "admin" && (
              <Link to="/admin">Add Store</Link>
            )}
            <span className="navbar-user" aria-label={`Logged in as ${displayName || user?.email}`}>
              <span className="navbar-user-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="navbar-user-name">{greeting}</span>
            </span>
            <button type="button" className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
