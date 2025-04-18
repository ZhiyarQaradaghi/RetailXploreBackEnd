const database = require("../database/connection");
const { ObjectId } = require("mongodb");
const Product = require("./Product");

class Cart {
  static async getCart(cartId) {
    const collection = await database.getCollection("carts");
    return collection.findOne({ cartId });
  }

  static async addToCart(cartId, productId, quantity = 1) {
    const collection = await database.getCollection("carts");
    const cart = await collection.findOne({ cartId });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        // If product already exists, update its quantity
        const currentQuantity = cart.items[existingItemIndex].quantity || 1;
        cart.items[existingItemIndex].quantity = currentQuantity + quantity;

        await collection.updateOne(
          { cartId, "items.productId": productId },
          {
            $set: {
              "items.$.quantity": cart.items[existingItemIndex].quantity,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        // If product doesn't exist, add it with the specified quantity
        await collection.updateOne(
          { cartId },
          {
            $push: { items: { productId, quantity } },
            $set: { updatedAt: new Date() },
          }
        );
      }

      return collection.findOne({ cartId });
    } else {
      const newCart = {
        cartId,
        items: [{ productId, quantity }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await collection.insertOne(newCart);
      return newCart;
    }
  }

  static async updateCartItemQuantity(cartId, productId, quantity) {
    const collection = await database.getCollection("carts");

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      return this.removeFromCart(cartId, productId);
    }

    await collection.updateOne(
      { cartId, "items.productId": productId },
      {
        $set: {
          "items.$.quantity": quantity,
          updatedAt: new Date(),
        },
      }
    );

    return collection.findOne({ cartId });
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
    const result = await collection
      .aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalQuantity: { $sum: 1 },
            totalCarts: { $addToSet: "$cartId" },
          },
        },
        {
          $project: {
            _id: 1,
            totalQuantity: 1,
            uniqueCartsCount: { $size: "$totalCarts" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit },
      ])
      .toArray();

    const productIds = result.map((item) => item._id);
    const products = await Product.getProductsByIds(productIds);

    return result.map((item) => {
      const product = products.find((p) => p._id.toString() === item._id);
      return {
        productId: item._id,
        totalAddedToCart: item.totalQuantity,
        uniqueCustomers: item.uniqueCartsCount,
        product: product
          ? {
              id: product._id.toString(),
              name: product.name,
              image: product.image,
              price: product.price,
              category: product.category,
              rating: product.rating,
              isDiscounted: product.isDiscounted,
              discountRate: product.discountRate,
              newPrice: product.newPrice,
            }
          : null,
      };
    });
  }
}

module.exports = Cart;
