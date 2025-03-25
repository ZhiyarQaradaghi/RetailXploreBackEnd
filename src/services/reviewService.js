const Review = require("../models/Review");

class ReviewService {
  async addReview(productId, rating, comment) {
    if (!productId || typeof rating !== "number" || !comment.trim()) {
      throw new Error("Invalid review data");
    }
    return await Review.addReview(productId, rating, comment);
  }

  async getReviewsByProduct(productId) {
    return await Review.getReviewsByProduct(productId);
  }
}

module.exports = new ReviewService();
