const database = require("../database/connection");
const { ObjectId } = require("mongodb");

class Review {
  static async addReview(productId, rating, comment) {
    const collection = await database.getCollection("reviews");
    return collection.insertOne({
      productId: new ObjectId(productId),
      rating,
      comment,
      createdAt: new Date(),
    });
  }

  static async getReviewsByProduct(productId) {
    const collection = await database.getCollection("reviews");
    return collection
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 }) // latest reviews first
      .toArray();
  }

  // New method to get top 3 reviews
  static async getTopReviewsByProduct(productId, limit = 3) {
    const collection = await database.getCollection("reviews");
    const reviews = await collection
    .find({ productId: new ObjectId(productId) })
    .sort({ rating: -1, createdAt: -1 }) // Sort by highest rating, then most recent
    .limit(limit)
    .toArray();

  // Format the date before returning
  return reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));
  }
  
}

module.exports = Review;
