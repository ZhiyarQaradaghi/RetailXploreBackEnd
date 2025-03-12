const database = require("../database/connection");
const { ObjectId } = require("mongodb");

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
}

module.exports = Cart;
