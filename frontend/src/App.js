import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState("");
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [search, setSearch] = useState(""); // 🔍 SEARCH STATE

  // ================= LOGIN =================
  const loginUser = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Login success: " + data.user.name);
      setUser(data.user);
      fetchStores();
    } else {
      alert("Login failed");
    }
  };

  const logoutUser = () => {
    setUser(null);
  };

  // ================= FETCH STORES =================
  const fetchStores = async () => {
    const res = await fetch("http://localhost:5000/stores-with-ratings");
    const data = await res.json();
    setStores(data);
  };

  // ================= ADD STORE =================
  const addStore = async () => {
    if (!newStore.trim()) return;

    await fetch("http://localhost:5000/add-store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newStore, userId: user.id }),
    });

    setNewStore("");
    fetchStores();
  };

  // ================= DELETE STORE =================
  const deleteStore = async (id) => {
    await fetch(`http://localhost:5000/delete-store/${id}`, {
      method: "DELETE",
    });
    fetchStores();
  };

  // ================= RATE STORE =================
  const rateStore = async (storeId) => {
    await fetch("http://localhost:5000/rate-store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId,
        rating: ratings[storeId],
        review: reviews[storeId],
      }),
    });

    setRatings({ ...ratings, [storeId]: "" });
    setReviews({ ...reviews, [storeId]: "" });
    fetchStores();
  };

  useEffect(() => {
    if (user) fetchStores();
  }, [user]);

  // ================= LOGIN SCREEN =================
  if (!user) {
    return (
      <div style={styles.bg}>
        <div style={styles.card}>
          <h2>Login</h2>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={loginUser} style={styles.button}>Login</button>
        </div>
      </div>
    );
  }

  // ================= MAIN APP =================
  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h1>Store Rating Platform ⭐</h1>
        <p>Welcome, {user.name}</p>
        <button onClick={logoutUser} style={styles.logout}>Logout</button>

        <h2>Add Store</h2>
        <input
          placeholder="Enter store name"
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          style={styles.input}
        />
        <button onClick={addStore} style={styles.button}>Add</button>

        {/* 🔍 SEARCH BAR */}
        <h3>Search Store</h3>
        <input
          type="text"
          placeholder="Search store..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <h2>Stores List</h2>

        {stores
          .filter((store) =>
            store.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((store) => (
            <div key={store.id} style={styles.storeCard}>
              <h3>{store.name}</h3>
              <p>Rating: {store.rating}</p>

              <select
                value={ratings[store.id] || ""}
                onChange={(e) =>
                  setRatings({ ...ratings, [store.id]: e.target.value })
                }
                style={styles.select}
              >
                <option value="">Rate</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <input
                placeholder="Write review..."
                value={reviews[store.id] || ""}
                onChange={(e) =>
                  setReviews({ ...reviews, [store.id]: e.target.value })
                }
                style={styles.input}
              />

              <button onClick={() => rateStore(store.id)} style={styles.submit}>
                Submit
              </button>
              <button
                onClick={() => deleteStore(store.id)}
                style={styles.delete}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    background: "linear-gradient(90deg,#6a5af9,#8e2de2)",
    minHeight: "100vh",
    padding: "20px",
  },
  container: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
    margin: "auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    background: "#6a5af9",
    color: "white",
    border: "none",
    borderRadius: "6px",
    margin: "5px 0",
  },
  logout: {
    background: "red",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
  },
  submit: {
    background: "#8e2de2",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
  },
  delete: {
    background: "red",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    marginLeft: "10px",
  },
  storeCard: {
    background: "#f5f5f5",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
  },
};

export default App;
