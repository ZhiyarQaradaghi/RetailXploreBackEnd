const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: 'Too many contact requests, please try again later'
});

router.post('/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('to').isEmail().normalizeEmail().withMessage('Valid recipient email is required')
  ],
  contactController.submitContact.bind(contactController)
);

module.exports = router;