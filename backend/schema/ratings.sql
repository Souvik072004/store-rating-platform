-- Run this once to enable store ratings (one rating per user per store).
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(store_id, user_id)
);
