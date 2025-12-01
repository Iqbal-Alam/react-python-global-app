const db = require("../db");
// Add item to cart
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const {
    id, // medicine_id
    medicine_name,
    qty,
    rate,
    gst,
    agency_details,
    invoice_number,
    invoice_date,
    hsn,
    pack,
    manufacture_by,
    expiry_date,
    batch,
    free,
    scheme,
    mrp
  } = req.body;

  if (!id || !qty || !rate) {
    return res.status(400).json({ message: "Medicine ID, qty, and rate are required" });
  }

  // ✅ Corrected SQL (no cart.id insertion)
  const query = `
    INSERT INTO cart (
      userId, medicine_id, medicine_name, qty, rate, gst,
      agency_details, invoice_number, invoice_date, hsn, pack,
      manufacture_by, expiry_date, batch, free, scheme, mrp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    id, // medicine_id
    medicine_name,
    qty,
    rate,
    gst,
    agency_details,
    invoice_number,
    invoice_date,
    hsn,
    pack,
    manufacture_by,
    expiry_date,
    batch,
    free,
    scheme,
    mrp
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Error adding to cart:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Added to cart successfully",
      data: { id: this.lastID, medicine_id: id, ...req.body }
    });
  });
};

// Get cart items
exports.getCart = (req, res) => {
  const userId = req.user.id;
  const query = `SELECT * FROM cart WHERE userId = ? ORDER BY id DESC`;
  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ data: rows });
  });
};

// Update cart item
exports.updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { qty, rate } = req.body;

  if (!qty || !rate) return res.status(400).json({ message: "qty and rate required" });

  const query = `UPDATE cart SET qty = ?, rate = ? WHERE id = ? AND userId = ?`;
  db.run(query, [qty, rate, id, userId], function(err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Cart item updated" });
  });
};

// Delete cart item
exports.deleteCartItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const query = `DELETE FROM cart WHERE id = ? AND userId = ?`;
  db.run(query, [id, userId], function(err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Cart item deleted" });
  });
};

// Clear cart
exports.clearCart = (req, res) => {
  const userId = req.user.id;
  const query = `DELETE FROM cart WHERE userId = ?`;
  db.run(query, [userId], function(err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Cart cleared" });
  });
};