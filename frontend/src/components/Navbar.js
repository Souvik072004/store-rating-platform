import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "10px", background: "#222", color: "white" }}>
      <span>Store Rating Platform</span>
      {user && (
        <button
          style={{ float: "right", background: "red", color: "white" }}
          onClick={logout}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
