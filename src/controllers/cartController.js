const cartService = require("../services/cartService");

class CartController {
  async getCart(req, res) {
    try {
      const cartId = req.query.cartId || req.body.cartId;
      const cart = await cartService.getCart(cartId);

      res.json({
        message: "Cart retrieved successfully",
        cart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to get cart" });
    }
  }

  async createCart(req, res) {
    try {
      const cart = await cartService.createCart();

      res.json({
        message: "Cart created successfully",
        cart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to create cart" });
    }
  }

  async addToCart(req, res) {
    try {
      const { cartId, productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const cart = await cartService.addToCart(cartId, productId);

      res.json({
        message: "Product added to cart",
        cart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to add to cart" });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { cartId, productId } = req.body;

      if (!cartId || !productId) {
        return res
          .status(400)
          .json({ error: "Cart ID and Product ID are required" });
      }

      const cart = await cartService.removeFromCart(cartId, productId);

      res.json({
        message: "Product removed from cart",
        cart,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to remove from cart" });
    }
  }

  async clearCart(req, res) {
    try {
      const { cartId } = req.body;

      if (!cartId) {
        return res.status(400).json({ error: "Cart ID is required" });
      }

      const cart = await cartService.clearCart(cartId);

      res.json({
        message: "Cart cleared",
        cart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to clear cart" });
    }
  }
}

module.exports = new CartController();
