const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/productlist", productController.getProducts);
router.get("/featured", productController.getFeatured);
router.get("/search", productController.search);

module.exports = router;
