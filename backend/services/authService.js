import db from "../db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey"; // 👉 use env var in production

export const signupUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );

  const info = stmt.run(name, email, hashedPassword);
  return { id: info.lastInsertRowid, name, email };
};

export const loginUser = async ({ email, password }) => {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};
