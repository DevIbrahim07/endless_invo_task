const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Question = require("../models/Question");

const questions = [
  {
    question: "What is your preferred programming language?",
    options: ["JavaScript", "Python", "Java", "C++", "Other"],
    order: 1,
  },
  {
    question: "How many years of programming experience do you have?",
    options: ["0-1 years", "2-3 years", "4-5 years", "6-10 years", "10+ years"],
    order: 2,
  },
  {
    question: "What type of development interests you most?",
    options: [
      "Web Development",
      "Mobile Development",
      "Desktop Applications",
      "Data Science",
      "Game Development",
    ],
    order: 3,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("Cleared existing questions");

    // Clear existing admin user to recreate with correct password
    await User.deleteOne({ email: "admin@example.com" });
    console.log("Cleared existing admin user");

    // Insert new questions
    await Question.insertMany(questions);
    console.log("Questions seeded successfully");

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      // Create admin user - let the User model handle password hashing
      const admin = new User({
        email: "admin@example.com",
        password: "admin123", // Raw password - will be hashed by User model
        role: "admin",
        status: "approved",
      });

      await admin.save(); // This will trigger the pre-save hook to hash password
      console.log("Admin user created: admin@example.com / admin123");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
