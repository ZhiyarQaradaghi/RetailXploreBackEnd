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
}

module.exports = Product;
