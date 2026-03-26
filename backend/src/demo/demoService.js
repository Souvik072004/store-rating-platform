// Simple in-memory data store for demos.
// Used when Postgres is not reachable / not configured.

let nextStoreId = 4;

// Baseline stores so the UI has something to show.
// IDs should be stable during runtime, but this is just for demo purposes.
const stores = [
  { id: 1, name: "Best Coffee Shop", address: "123 Main St" },
  { id: 2, name: "Green Grocery", address: "44 Orchard Road" },
  { id: 3, name: "Blue Book Store", address: "9 Lakeview Ave" },
];

// Keyed by `${storeId}|${userId}` -> rating number (1..5)
const ratings = new Map();

const round1 = (n) => Math.round(n * 10) / 10;

const ratingForStore = (storeId) => {
  const sid = String(storeId);
  let sum = 0;
  let count = 0;

  for (const [key, r] of ratings.entries()) {
    const [kStoreId] = key.split("|");
    if (kStoreId === sid) {
      sum += Number(r);
      count += 1;
    }
  }

  if (count === 0) return null;
  return round1(sum / count);
};

const submitRating = ({ store_id, userId, rating }) => {
  const sid = Number(store_id);
  if (!Number.isFinite(sid)) throw new Error("Invalid store_id");

  const uid = String(userId);
  const rid = Number(rating);
  if (!Number.isInteger(rid) || rid < 1 || rid > 5) throw new Error("Invalid rating");

  ratings.set(`${sid}|${uid}`, rid);
};

const createStore = ({ name, address }) => {
  const id = nextStoreId++;
  const store = {
    id,
    name: String(name),
    address: address ? String(address) : null,
  };
  stores.push(store);
  return store;
};

const deleteStore = (id) => {
  const sid = Number(id);
  const idx = stores.findIndex((s) => Number(s.id) === sid);
  if (idx === -1) return false;

  stores.splice(idx, 1);

  const prefix = `${sid}|`;
  for (const key of Array.from(ratings.keys())) {
    if (key.startsWith(prefix)) ratings.delete(key);
  }

  return true;
};

const getStores = () => {
  // Mirror the SQL ordering: ORDER BY id DESC
  return [...stores]
    .sort((a, b) => b.id - a.id)
    .map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      rating: ratingForStore(s.id),
    }));
};

const getStats = () => {
  const totalStores = stores.length;
  const totalRatings = ratings.size;

  const userIds = new Set();
  let sum = 0;
  for (const [key, r] of ratings.entries()) {
    const [, userId] = key.split("|");
    userIds.add(userId);
    sum += Number(r);
  }

  const totalUsers = userIds.size;
  const averageRating = totalRatings > 0 ? round1(sum / totalRatings) : 0;

  return {
    totalStores,
    totalUsers,
    totalRatings,
    averageRating,
  };
};

module.exports = {
  getStores,
  createStore,
  deleteStore,
  submitRating,
  getStats,
};

