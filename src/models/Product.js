const database = require("../database/connection");
const { ObjectId } = require("mongodb");

class Product {
  static async getProducts() {
    const collection = await database.getCollection("products");
    return collection.find({}).toArray();
  }

  // not sure if limit should be 4 or change condition for featured products
  // maybe get 4 random products in a certain time period or something
  static async getFeaturedProducts(limit = 4) {
    const collection = await database.getCollection("products");
    return collection.find({ isDiscounted: true }).limit(limit).toArray();
  }

  // a case-insensitive search in all of the name, description, and category fields using $regex operator from mongodb
  // $or is used to match any of the conditions
  static async searchProducts(query) {
    const collection = await database.getCollection("products");
    return collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();
  }

  static async getProductsByIds(productIds) {
    const collection = await database.getCollection("products");
    const objectIds = productIds.map((id) => {
      try {
        return typeof id === "string" ? new ObjectId(id) : id;
      } catch (error) {
        return id;
      }
    });

    return collection
      .find({
        $or: [
          { _id: { $in: objectIds } },
          { id: { $in: productIds.map((id) => parseInt(id)) } },
        ],
      })
      .toArray();
  }

  static async getProductByBarcode(barcode) {
    const collection = await database.getCollection("products");
    return collection.findOne({ barcode });
  }

  static async createProduct(productData) {
    const collection = await database.getCollection("products");
    const result = await collection.insertOne(productData);
    return { _id: result.insertedId, ...productData };
  }

  static async updateProduct(id, updateData) {
    const collection = await database.getCollection("products");
    let objectId;

    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return null;
    }

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }

  static async deleteProduct(id) {
    const collection = await database.getCollection("products");
    let objectId;

    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return null;
    }

    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  static async getTotalCount() {
    const collection = await database.getCollection("products");
    return collection.countDocuments();
  }

  static async getFeaturedCount() {
    const collection = await database.getCollection("products");
    return collection.countDocuments({ isDiscounted: true });
  }

  static async getDiscountedCount() {
    const collection = await database.getCollection("products");
    return collection.countDocuments({
      isDiscounted: true,
      discountRate: { $exists: true },
      newPrice: { $exists: true },
    });
  }

  static async getProductsByCategory() {
    const collection = await database.getCollection("products");
    return collection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } },
      ])
      .toArray();
  }


   /**
   * Retrieves the most recently added product based on its insertion time (createdAt field).
   * @returns {Promise<object|null>} A promise that resolves with the latest product document, or null if the collection is empty.
   */
   static async getLatestProduct() {
    const collection = await database.getCollection("products");
  
    const latestProduct = await collection.find({})
      .sort({ _id: -1 })  // This line is key
      .limit(1)
      .toArray();

    return latestProduct[0] || null;
  }

  static async getHighestRatedProducts(limit = 5) {
    const collection = await database.getCollection("products");
    return collection.find({}).sort({ rating: -1 }).limit(limit).toArray();
  }
}

module.exports = Product;
