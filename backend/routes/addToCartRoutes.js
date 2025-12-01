const express = require("express");
const { addToCart, getCart, updateCartItem, deleteCartItem, clearCart } = require("../controllers/addToCartController");
// const cartController = require("../controllers/cart.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated users can add medicine
router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, deleteCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
