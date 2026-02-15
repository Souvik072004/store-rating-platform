function StoreCard({ store }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{store.name}</h3>
      <p>Address: {store.address}</p>
      <p>Rating: {store.rating || "No rating yet"}</p>
    </div>
  );
}

export default StoreCard;
