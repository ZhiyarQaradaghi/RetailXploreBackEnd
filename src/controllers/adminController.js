const adminService = require("../services/adminService");

class AdminController {
  async getStatistics(req, res) {
    try {
      const statistics = await adminService.getStatistics();
      res.json({
        message: "Admin statistics",
        statistics,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch statistics" });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;

      // this is to add the image path to the product data
      if (req.file) {
        productData.image = `/images/${productData.category}/${req.file.filename}`;
      }

      const product = await adminService.createProduct(productData);
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to create product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await adminService.updateProduct(id, productData);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteProduct(id);

      if (!result) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to delete product" });
    }
  }

  async addFeaturedProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await adminService.setFeaturedStatus(id, true);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product added to featured items",
        product,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message || "Failed to add product to featured items",
      });
    }
  }

  async removeFeaturedProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await adminService.setFeaturedStatus(id, false);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product removed from featured items",
        product,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message || "Failed to remove product from featured items",
      });
    }
  }

  async addDiscount(req, res) {
    try {
      const { id } = req.params;
      const { discountRate, newPrice } = req.body;

      if (!discountRate || !newPrice) {
        return res
          .status(400)
          .json({ error: "Discount rate and new price are required" });
      }

      const product = await adminService.setDiscount(
        id,
        discountRate,
        newPrice
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Discount added successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to add discount" });
    }
  }

  async removeDiscount(req, res) {
    try {
      const { id } = req.params;
      const product = await adminService.removeDiscount(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Discount removed successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to remove discount" });
    }
  }

  async assignBarcode(req, res) {
    try {
      const { id } = req.params;
      const { barcode } = req.body;

      if (!barcode) {
        return res.status(400).json({ error: "Barcode is required" });
      }

      const product = await adminService.assignBarcode(id, barcode);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Barcode assigned successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to assign barcode" });
    }
  }

  async updateBarcode(req, res) {
    try {
      const { id } = req.params;
      const { barcode } = req.body;

      if (!barcode) {
        return res.status(400).json({ error: "Barcode is required" });
      }

      const product = await adminService.updateBarcode(id, barcode);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Barcode updated successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update barcode" });
    }
  }

  async removeBarcode(req, res) {
    try {
      const { id } = req.params;
      const product = await adminService.removeBarcode(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Barcode removed successfully",
        product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message || "Failed to remove barcode" });
    }
  }
}

module.exports = new AdminController();
