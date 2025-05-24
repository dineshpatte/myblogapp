import express from "express";

const router = express.Router();

router.get("/top-headlines", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=entertainment&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles", error: err.message });
  }
});

export default router;
