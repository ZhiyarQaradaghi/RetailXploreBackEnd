const productService = require("../services/productService");

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json({
        message: "Product list data",
        products,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
  
  async getFeatured(req, res) {
    try {
      const products = await productService.getFeaturedProducts();
      res.json({
        message: "Featured products",
        products,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  }

  // search products
  async search(req, res) {
    const query = req.query.q;
    if (!query) {
      return res.json({
        message: "provide a search query",
        products: [],
      });
    }

    try {
      const products = await productService.searchProducts(query);
      res.json({
        message: "Search results",
        searchQuery: query,
        products,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to search products" });
    }
  }
}

module.exports = new ProductController();
