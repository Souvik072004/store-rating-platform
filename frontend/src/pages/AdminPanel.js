import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";

function AdminPanel() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/stores", { name: name.trim(), address: address.trim() || undefined });
      showToast("Store added successfully!", "success");
      setName("");
      setAddress("");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
        err.message ||
        "Failed to add store. Make sure you are logged in as admin.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="admin-header">
        <h1>Add New Store</h1>
        <p>As an admin you can add new stores here.</p>
      </header>

      <div className="card card-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store name *</label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="e.g. Best Coffee Shop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <input
              id="address"
              type="text"
              className="input"
              placeholder="e.g. 123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding…" : "Add Store"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
