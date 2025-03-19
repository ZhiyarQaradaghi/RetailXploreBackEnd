const Cart = require("../models/Cart");
const Product = require("../models/Product");
const cache = require("../utils/cache");

class CartService {
  async getCart(cartId) {
    try {
      if (!cartId) {
        const newCart = await Cart.createCart();
        return { cartId: newCart.cartId, items: [] };
      }

      const cacheKey = `cart_${cartId}`;
      const cachedCart = cache.get(cacheKey);

      if (cachedCart) {
        return cachedCart;
      }

      const cart = await Cart.getCart(cartId);

      if (!cart) {
        const newCart = await Cart.createCart();
        return { cartId: newCart.cartId, items: [] };
      }

      const cartWithProducts = await this.populateCartItems(cart);

      cache.set(cacheKey, cartWithProducts, 300);

      return cartWithProducts;
    } catch (error) {
      console.error("Error getting cart:", error);
      throw new Error("Failed to get cart");
    }
  }

  async addToCart(cartId, productId) {
    try {
      if (!cartId) {
        const newCart = await Cart.createCart();
        cartId = newCart.cartId;
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      const cart = await Cart.addToCart(cartId, productId);

      const cartWithProducts = await this.populateCartItems(cart);

      const cacheKey = `cart_${cartId}`;
      cache.set(cacheKey, cartWithProducts, 300);

      return cartWithProducts;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw new Error("Failed to add to cart");
    }
  }

  async removeFromCart(cartId, productId) {
    try {
      if (!cartId || !productId) {
        throw new Error("Cart ID and Product ID are required");
      }

      const cart = await Cart.removeFromCart(cartId, productId);

      const cartWithProducts = await this.populateCartItems(
        cart || { cartId, items: [] }
      );

      const cacheKey = `cart_${cartId}`;
      cache.set(cacheKey, cartWithProducts, 300);

      return cartWithProducts;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw new Error("Failed to remove from cart");
    }
  }

  async clearCart(cartId) {
    try {
      if (!cartId) {
        throw new Error("Cart ID is required");
      }

      const cart = await Cart.clearCart(cartId);

      const cacheKey = `cart_${cartId}`;
      cache.set(cacheKey, cart, 300);

      return cart;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Failed to clear cart");
    }
  }

  async createCart() {
    try {
      const cart = await Cart.createCart();
      return { cartId: cart.cartId, items: [] };
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Failed to create cart");
    }
  }

  async populateCartItems(cart) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { cartId: cart.cartId, items: [] };
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.getProductsByIds(productIds);

    // this is to ensure that the cart items are valid by checking if the product exists in the database 
    const populatedItems = cart.items
      .map((item) => {
        const product = products.find(
          (p) => p && p._id && p._id.toString() === item.productId
        );
        if (!product) {
          console.warn(`Product with ID ${item.productId} not found`);
          return null;
        }

        return {
          productId: item.productId,
          product: {
            id: product._id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description
          },
        };
      })
      .filter((item) => item !== null); 

    return {
      cartId: cart.cartId,
      items: populatedItems,
      totalItems: populatedItems.length,
      totalPrice: populatedItems.reduce((total, item) => {
        return total + (item.product ? item.product.price : 0);
      }, 0),
    };
  }
}

module.exports = new CartService();
