const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// we do this to apply the auth middleware to all admin routes so that we can only access the admin routes if the user is authenticated and is an admin
router.use(authMiddleware, adminOnly);

router.get("/statistics", adminController.getStatistics);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.post("/featured/:id", adminController.addFeaturedProduct);
router.delete("/featured/:id", adminController.removeFeaturedProduct);
router.post("/discounts/:id", adminController.addDiscount);
router.delete("/discounts/:id", adminController.removeDiscount);
router.post("/barcode/:id", adminController.assignBarcode);
router.put("/barcode/:id", adminController.updateBarcode);
router.delete("/barcode/:id", adminController.removeBarcode);

module.exports = router;
