import { useState } from "react";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";

function getRatingEmoji(rating) {
  if (rating == null || rating === "") return "📭";
  const n = Number(rating);
  if (n < 2) return "😞";
  if (n < 3) return "😐";
  if (n < 4) return "🙂";
  if (n < 5) return "😊";
  return "🤩";
}

function StoreCard({ store, user, onDeleted, onRated }) {
  const { showToast } = useToast();
  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user || !rating) return;
    setSubmitting(true);
    try {
      await axios.post("/ratings", { store_id: store.id, rating: Number(rating) });
      onRated?.();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit rating", "error");
    } finally {
      setSubmitting(false);
      setRating("");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this store?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/stores/${store.id}`);
      onDeleted?.();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete store", "error");
    } finally {
      setDeleting(false);
    }
  };

  const isAdmin = user?.role === "admin";
  const ratingNum = store.rating != null ? Number(store.rating) : null;
  const ratingEmoji = getRatingEmoji(store.rating);

  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p className="address">Address: {store.address || "—"}</p>
      <div className="store-rating-row">
        <span className="rating-emoji" aria-hidden>{ratingEmoji}</span>
        <span className={`rating-value ${ratingNum == null ? "none" : ""}`}>
          {ratingNum != null ? `${store.rating} / 5` : "No rating yet"}
        </span>
      </div>

      {user && (
        <form className="rating-form" onSubmit={handleSubmitRating}>
          <label>Your rating (1–5):</label>
          <select
            className="select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Choose</option>
            <option value="1">1 😞</option>
            <option value="2">2 😐</option>
            <option value="3">3 🙂</option>
            <option value="4">4 😊</option>
            <option value="5">5 🤩</option>
          </select>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "…" : "Submit"}
          </button>
        </form>
      )}

      {isAdmin && (
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Delete store"}
        </button>
      )}
    </div>
  );
}

export default StoreCard;
