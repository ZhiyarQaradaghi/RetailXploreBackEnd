const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add", reviewController.addReview);
router.get("/", reviewController.getReviews);
router.get("/top", reviewController.getTopReviews); // Newly added route
router.get("/average", reviewController.getAverageRating); // New route to fetch average rating

module.exports = router;
