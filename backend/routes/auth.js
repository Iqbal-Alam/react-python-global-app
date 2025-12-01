const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const router = express.Router();
const SECRET_KEY = "your_jwt_secret"; // use env variable in production

// Signup
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  findUserByEmail(email, async (err, user) => {
    if (user) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    createUser(name, email, hashedPassword, (err, userId) => {
      if (err) return res.status(500).json({ error: "Error creating user" });

      res.json({ message: "Signup successful", userId });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, user) => {
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
});

module.exports = router;
