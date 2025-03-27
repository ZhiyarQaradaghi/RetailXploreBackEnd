const Product = require("../models/Product");
const cache = require("../utils/cache");

class ProductService {
  async getAllProducts() {
    try {
      const products = await Product.getProducts();
      return products.map((product) => ({
        ...product,
        id: product._id.toString(),
      }));
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // not sure about this one
  async getFeaturedProducts() {
    try {
      const products = await Product.getFeaturedProducts();
      return products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
      }));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw new Error("Failed to fetch featured products");
    }
  }

  // searches products by name/desc/category, returns empty array if no query
  async searchProducts(query) {
    try {
      if (!query || typeof query !== "string") {
        return [];
      }
      const products = await Product.searchProducts(query.toLowerCase().trim());
      return products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        description: product.description,
        rating: product.rating,
      }));
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error("Failed to search products");
    }
  }

  // used cache to store the product for 5 minutes to avoid db calls
  async getProductByBarcode(barcode) {
    try {
      const cacheKey = `barcode_${barcode}`;
      const cachedProduct = cache.get(cacheKey);

      if (cachedProduct) {
        return cachedProduct;
      }

      const product = await Product.getProductByBarcode(barcode);
      if (!product) return null;

      const formattedProduct = {
        id: product._id.toString(),
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        description: product.description,
        rating: product.rating,
        barcode,
      };

      cache.set(cacheKey, formattedProduct, 300);
      return formattedProduct;
    } catch (error) {
      console.error("Error fetching product by barcode:", error);
      throw new Error("Failed to fetch product by barcode");
    }
  }
}

module.exports = new ProductService();
