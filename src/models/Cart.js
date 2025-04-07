const database = require("../database/connection");
const { ObjectId } = require("mongodb");
const Product = require("./Product");

class Cart {
  static async getCart(cartId) {
    const collection = await database.getCollection("carts");
    return collection.findOne({ cartId });
  }

  static async addToCart(cartId, productId) {
    const collection = await database.getCollection("carts");
    const cart = await collection.findOne({ cartId });

    if (cart) {
      const productExists = cart.items.some(
        (item) => item.productId === productId
      );

      if (!productExists) {
        await collection.updateOne(
          { cartId },
          {
            $push: { items: { productId } },
            $set: { updatedAt: new Date() },
          }
        );
      }

      return collection.findOne({ cartId });
    } else {
      const newCart = {
        cartId,
        items: [{ productId }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await collection.insertOne(newCart);
      return newCart;
    }
  }

  static async removeFromCart(cartId, productId) {
    const collection = await database.getCollection("carts");

    await collection.updateOne(
      { cartId },
      {
        $pull: { items: { productId } },
        $set: { updatedAt: new Date() },
      }
    );

    return collection.findOne({ cartId });
  }

  static async clearCart(cartId) {
    const collection = await database.getCollection("carts");

    await collection.updateOne(
      { cartId },
      {
        $set: {
          items: [],
          updatedAt: new Date(),
        },
      }
    );

    return { cartId, items: [] };
  }

  static async createCart() {
    const collection = await database.getCollection("carts");
    const cartId = new ObjectId().toString();

    const newCart = {
      cartId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(newCart);
    return newCart;
  }

  static async getMostAddedProducts(limit = 10) {
    const collection = await database.getCollection("carts");

    // this is the query to get the most added products
    const result = await collection
      .aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
      ])
      .toArray();

    // this is the query to get the product details for each ID
    const productIds = result.map((item) => item._id);
    const products = await Product.getProductsByIds(productIds);

    // this is the query to combine the count with the product details
    return result.map((item) => {
      const product = products.find((p) => p._id.toString() === item._id);
      return {
        productId: item._id,
        count: item.count,
        product: product
          ? {
              id: product._id.toString(),
              name: product.name,
              image: product.image,
              price: product.price,
              category: product.category,
            }
          : null,
      };
    });
  }
}

module.exports = Cart;
