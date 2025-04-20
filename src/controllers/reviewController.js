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

  // New method to get top reviews
  async getTopReviews(req, res) {
    try {
      const { productId, limit } = req.query;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const topReviews = await reviewService.getTopReviewsByProduct(
        productId,
        parseInt(limit) || 3
      );
      res.json({ message: "Top product reviews", reviews: topReviews });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top reviews" });
    }
  }


  // new
  async getAverageRating(req, res) {
    try {
      const { productId } = req.query;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const averageRating = await reviewService.getAverageRatingByProduct(productId);
      res.json({ message: "Average product rating", averageRating });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch average rating" });
    }
  }

}

module.exports = new ReviewController();
