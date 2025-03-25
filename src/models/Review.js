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
}

module.exports = Review;
