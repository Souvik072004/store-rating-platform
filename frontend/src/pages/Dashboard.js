import { useEffect, useState } from "react";
import axios from "../api/axios";
import StoreCard from "../components/StoreCard";
import Loader from "../components/Loader";

function Dashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("/stores");
        setStores(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStores();
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard 🎉</h2>

      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}

export default Dashboard;
