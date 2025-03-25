const reviewService = require("../services/reviewService");

class ReviewController {
  async addReview(req, res) {
    try {
      const { productId, rating, comment } = req.body;
      if (!productId || !comment || typeof rating !== "number") {
        return res.status(400).json({ error: "Invalid review data" });
      }

      await reviewService.addReview(productId, rating, comment);
      res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add review" });
    }
  }

  async getReviews(req, res) {
    try {
      const { productId } = req.query;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const reviews = await reviewService.getReviewsByProduct(productId);
      res.json({ message: "Product reviews", reviews });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }
}

module.exports = new ReviewController();
