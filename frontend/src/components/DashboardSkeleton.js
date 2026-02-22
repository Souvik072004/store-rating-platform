function DashboardSkeleton() {
  return (
    <div className="page" aria-busy="true" aria-label="Loading dashboard">
      <header className="dashboard-header">
        <div className="skeleton skeleton-title" style={{ width: "180px", height: "28px" }} />
        <div className="skeleton skeleton-text" style={{ width: "260px", height: "16px", marginTop: "8px" }} />
      </header>

      <section className="kpi-section">
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="kpi-card skeleton-card">
              <div className="skeleton skeleton-icon" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <div className="skeleton skeleton-value" style={{ width: "48px", height: "28px" }} />
              <div className="skeleton skeleton-label" style={{ width: "80px", height: "14px" }} />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="skeleton skeleton-title" style={{ width: "80px", height: "20px", marginBottom: "16px" }} />
        <div className="stores-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="store-card skeleton-card">
              <div className="skeleton skeleton-title" style={{ width: "70%", height: "24px" }} />
              <div className="skeleton skeleton-text" style={{ width: "90%", height: "14px", marginTop: "8px" }} />
              <div className="skeleton skeleton-text" style={{ width: "50%", height: "14px", marginTop: "8px" }} />
              <div className="skeleton" style={{ width: "100px", height: "36px", marginTop: "16px", borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardSkeleton;
