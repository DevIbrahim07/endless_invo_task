const express = require("express");
const Question = require("../models/Question");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Get all questions
router.get("/", requireAuth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json({ questions });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
