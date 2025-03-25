const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add", reviewController.addReview);
router.get("/", reviewController.getReviews);

module.exports = router;
