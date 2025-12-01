const express = require("express");
const { addMedicine, getMedicines, updateMedicine, deleteMedicine, sellMedicines, getSalesHistory } = require("../controllers/medicineController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated users can add medicine
router.post("/", protect, addMedicine);
router.post("/sell", protect, sellMedicines);
router.get("/", protect, getMedicines);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);
router.get("/salesHistory", protect, getSalesHistory);

module.exports = router;
