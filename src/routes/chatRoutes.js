const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const productService = require("../services/productService");
require("dotenv").config();

// init groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// check if the api key is configured
router.use((req, res, next) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "Groq API key is not configured",
    });
  }
  next();
});

router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const conversationHistory = history || [];

    //  this is data for the chatbot
    const products = await productService.getAllProductsForChat();

    const messages = [
      {
        role: "system",
        content: `You are a helpful shopping assistant for RetailXplore store. 
        
        STORE INFORMATION:
        - We sell fruits, drinks, grains, dairy, snacks, and bakery items
        - Our prices are in IQD (Iraqi Dinar)
        - Many items have discounts (marked with discountRate)
        - Products have ratings from 1-5 stars
        
        CURRENT PRODUCT DATA:
        ${JSON.stringify(products, null, 2)}
        
        CAPABILITIES:
        - Help find products in our categories using current data
        - Answer questions about prices and availability
        - Provide information about discounts
        - Make recommendations based on preferences
        - Share product descriptions and ratings
        
        STYLE:
        - Be friendly and helpful
        - Always show prices in IQD
        - Be honest about product availability
        - Focus on quality and value`,
      },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    res.json({
      message: completion.choices[0]?.message?.content || "",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({
      error: "Failed to process chat request",
      details: error.message,
    });
  }
});

module.exports = router;
