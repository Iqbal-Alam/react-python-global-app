const bcrypt = require("bcryptjs");
const db = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret"; // in production, use process.env.JWT_SECRET

// Signup
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.status(201).json({ message: "User registered", userId: this.lastID });
    }
  );
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token, // send token to frontend
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};
