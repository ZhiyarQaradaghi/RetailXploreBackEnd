const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add", reviewController.addReview);
router.get("/", reviewController.getReviews);
router.get("/top", reviewController.getTopReviews); // Newly added route

module.exports = router;
