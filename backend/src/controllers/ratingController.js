exports.getRatings = async (req, res) => {
  try {
    res.json({ message: "Ratings working" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
