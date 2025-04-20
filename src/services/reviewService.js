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

  // New method to get top reviews
  async getTopReviewsByProduct(productId, limit = 3) {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    return await Review.getTopReviewsByProduct(productId, limit);
  }
  

  // new
  async getAverageRatingByProduct(productId) {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    return await Review.getAverageRatingByProduct(productId);
  }
  
}

module.exports = new ReviewService();
