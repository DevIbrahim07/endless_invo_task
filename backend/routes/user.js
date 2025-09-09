const express = require("express");
const User = require("../models/User");
const Question = require("../models/Question");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Submit user responses
router.post("/responses", requireAuth, async (req, res) => {
  try {
    const { responses } = req.body;

    // Get questions to include question text
    const questions = await Question.find();
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q.question;
    });

    // Format responses with question text
    const formattedResponses = responses.map((response) => ({
      questionId: response.questionId,
      question: questionMap[response.questionId],
      answer: response.answer,
    }));

    // Update user with responses and change status to pending
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        responses: formattedResponses,
        status: "pending",
      },
      { new: true }
    ).select("-password");

    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      responses: user.responses,
    };

    res.json({ user: userData });
  } catch (error) {
    console.error("Submit responses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
