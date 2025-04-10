const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { ObjectId } = require("mongodb");
const cache = require("../utils/cache");

class AdminService {
  async getStatistics() {
    try {
      //  count for top products, total products, featured products, discounted products, products by category and highest rated products
      const topProducts = await Cart.getMostAddedProducts();
      const latestProduct = await Product.getLatestProduct(); // new 
      const totalProducts = await Product.getTotalCount();
      const featuredCount = await Product.getFeaturedCount();
      const discountedCount = await Product.getDiscountedCount();
      const productsByCategory = await Product.getProductsByCategory();
      const highestRatedProducts = await Product.getHighestRatedProducts();

      return {
        topProducts,
        totalProducts,
        featuredCount,
        discountedCount,
        productsByCategory,
        latestProduct,
        highestRatedProducts,
      };
    } catch (error) {
      console.error("Error getting admin statistics:", error);
      throw new Error("Failed to get admin statistics");
    }
  }

  async createProduct(productData) {
    try {
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error("Name, price, and category are required");
      }

      // set default values for the product
      const product = {
        ...productData,
        isDiscounted: productData.isDiscounted || false,
        rating: productData.rating || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newProduct = await Product.createProduct(product);

      // clear the cache because we are creating a new product
      cache.flushAll();

      return {
        id: newProduct._id.toString(),
        ...newProduct,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await Product.updateProduct(id, {
        ...productData,
        updatedAt: new Date(),
      });

      if (!updatedProduct) {
        return null;
      }

      // clear the cache because we are updating a product
      cache.flushAll();

      return {
        id: updatedProduct._id.toString(),
        ...updatedProduct,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.deleteProduct(id);

      if (!result) {
        return null;
      }

      // clear the cache because we are deleting a product
      cache.flushAll();

      return result;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  async setFeaturedStatus(id, isFeatured) {
    try {
      const product = await Product.updateProduct(id, {
        isDiscounted: isFeatured,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are updating the featured status of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error setting featured status:", error);
      throw new Error("Failed to update featured status");
    }
  }

  async setDiscount(id, discountRate, newPrice) {
    try {
      const product = await Product.updateProduct(id, {
        isDiscounted: true,
        discountRate,
        newPrice,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are updating the discount of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error setting discount:", error);
      throw new Error("Failed to set discount");
    }
  }

  async removeDiscount(id) {
    try {
      const product = await Product.updateProduct(id, {
        isDiscounted: false,
        discountRate: null,
        newPrice: null,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are removing the discount of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error removing discount:", error);
      throw new Error("Failed to remove discount");
    }
  }

  async assignBarcode(id, barcode) {
    try {
      // does the barcode already exist?
      const existingProduct = await Product.getProductByBarcode(barcode);

      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new Error("Barcode already assigned to another product");
      }

      const product = await Product.updateProduct(id, {
        barcode,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are updating the barcode of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error assigning barcode:", error);
      throw new Error(error.message || "Failed to assign barcode");
    }
  }

  async updateBarcode(id, barcode) {
    try {
      // does the barcode already exist on another product?
      const existingProduct = await Product.getProductByBarcode(barcode);

      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new Error("Barcode already assigned to another product");
      }

      const product = await Product.updateProduct(id, {
        barcode,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are updating the barcode of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error updating barcode:", error);
      throw new Error(error.message || "Failed to update barcode");
    }
  }

  async removeBarcode(id) {
    try {
      const product = await Product.updateProduct(id, {
        barcode: null,
        updatedAt: new Date(),
      });

      if (!product) {
        return null;
      }

      // clear the cache because we are removing the barcode of a product
      cache.flushAll();

      return {
        id: product._id.toString(),
        ...product,
      };
    } catch (error) {
      console.error("Error removing barcode:", error);
      throw new Error("Failed to remove barcode");
    }
  }
}

module.exports = new AdminService();
