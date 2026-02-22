import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import StoreCard from "../components/StoreCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useAuth } from "../context/AuthContext";

const defaultStats = { totalStores: 0, totalUsers: 0, totalRatings: 0, averageRating: 0 };

function Dashboard() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [storesRes, statsRes] = await Promise.all([
        axios.get("/stores"),
        axios.get("/stats").catch(() => ({ data: defaultStats }))
      ]);
      setStores(storesRes.data || []);
      setStats(statsRes.data || defaultStats);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch stores. Please check if the backend server is running."
      );
      setLoading(false);
      setStores([]);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="dashboard-layout">
        <div className="page">
          <div className="error-state">
          <p><strong>Error:</strong> {error}</p>
          <button className="btn btn-primary" onClick={() => { setLoading(true); setError(null); fetchStores(); }}>
            Retry
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Browse stores and leave your rating.</p>
      </header>

      <section className="kpi-section" aria-label="Key metrics">
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-icon" aria-hidden>🏪</span>
            <span className="kpi-value">{stores.length > 0 ? stores.length : (stats.totalStores ?? 0)}</span>
            <span className="kpi-label">Total Stores</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon" aria-hidden>👥</span>
            <span className="kpi-value">{stats.totalUsers}</span>
            <span className="kpi-label">Total Users</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon" aria-hidden>⭐</span>
            <span className="kpi-value">{stats.totalRatings}</span>
            <span className="kpi-label">Total Ratings</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon" aria-hidden>📊</span>
            <span className="kpi-value">{stats.averageRating || "—"}</span>
            <span className="kpi-label">Average Rating</span>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Stores</h2>
        {stores.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden>🏪</span>
            <p className="empty-state-title">No stores yet</p>
            <p className="empty-state-text">Be the first to add a store and start collecting ratings.</p>
            {user?.role === "admin" && (
              <Link to="/admin" className="btn btn-primary" style={{ marginTop: "16px" }}>
                Add your first store
              </Link>
            )}
          </div>
        ) : (
          <div className="stores-grid">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                user={user}
                onDeleted={fetchStores}
                onRated={fetchStores}
              />
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}

export default Dashboard;
