const db = require("../db");

// Add a new medicine
exports.addMedicine = (req, res) => {
  const userId = req.user.id;
  const {
    agency_details,
    batch,
    expiry_date,
    gst,
    hsn,
    invoice_date,
    invoice_number,
    manufacture_by,
    medicine_name,
    qty,
    rate,
    free,
    gst_amount,
    mrp,
    pack,
    scheme,
    total,
  } = req.body;

  // Validate required fields
  if (
    !agency_details ||
    !medicine_name ||
    !manufacture_by ||
    !batch ||
    !expiry_date ||
    !qty ||
    !rate ||
    !gst ||
    !invoice_number ||
    !invoice_date
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate invoice number (5 digits)
//   if (!/^\d{5}$/.test(invoice_number)) {
//     return res.status(400).json({ message: "Invoice number must be 5 digits" });
//   }

  // SQL query with automatic calculation of total, gst_amount, and amount
  // SQL query with automatic calculation of total, gst_amount, and amount
  const query = `
  INSERT INTO medicines 
    (agency_details, medicine_name, manufacture_by, batch, expiry_date, qty, hsn, rate, gst, total, gst_amount, amount, invoice_number, invoice_date, userId, free, gst_amount, mrp, pack, scheme, total )
  VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?,                  -- agency → gst
    (? * ?),                                    -- total = qty * rate
    ((? * ?) * ? / 100),                        -- gst_amount = total * gst / 100
    ((? * ?) + ((? * ?) * ? / 100)),            -- amount = total + gst_amount
    ?, ?, ?, ?, ?, ?, ?, ?, ?                                     -- invoice_number, invoice_date, userId
  )
`;

  const values = [
    agency_details, // agency_details
    medicine_name, // medicine_name
    manufacture_by, // manufacture_by
    batch, // batch
    expiry_date, // expiry_date
    qty, // qty
    hsn, // hsn
    rate, // rate
    gst, // gst
    qty,
    rate, // for total
    qty,
    rate,
    gst, // for gst_amount
    qty,
    rate,
    qty,
    rate,
    gst, // for amount
    invoice_number, // invoice_number
    invoice_date, // invoice_date
    userId, // userId
    free,
    gst_amount,
    mrp,
    pack,
    scheme,
    total,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Error inserting medicine:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Medicine added successfully",
      data: {
        id: this.lastID,
        agency_details,
        medicine_name,
        manufacture_by,
        batch,
        expiry_date,
        qty,
        hsn,
        rate,
        gst,
        invoice_number,
        invoice_date,
        free,
        gst_amount,
        mrp,
        pack,
        scheme,
        total,
      },
    });
  });
};

// Get all medicines
exports.getMedicines = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM medicines
    WHERE userId = ?
    ORDER BY id DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching medicines:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({
      message: "Medicines fetched successfully",
      data: rows,
    });
  });
};

// update medicines
exports.updateMedicine = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const {
    medicine_name,
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
    qty,
    mrp,
    rate,
    gst,
  } = req.body;

  // ✅ Validate required fields
  if (
    !agency_details ||
    !medicine_name ||
    !manufacture_by ||
    !batch ||
    !expiry_date ||
    qty === undefined ||
    rate === undefined ||
    gst === undefined ||
    !invoice_number ||
    !invoice_date ||
    !pack
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // ✅ Validate invoice number format (5 digits)
  if (!/^\d{5}$/.test(invoice_number)) {
    return res.status(400).json({ message: "Invoice number must be 5 digits" });
  }

  // ✅ Parse numeric values
  const qtyNum = parseFloat(qty);
  const rateNum = parseFloat(rate);
  const gstNum = parseFloat(gst);

  if (isNaN(qtyNum) || isNaN(rateNum) || isNaN(gstNum)) {
    return res
      .status(400)
      .json({ message: "Qty, rate, and GST must be valid numbers" });
  }

  // ✅ Calculate totals
  const total = qtyNum * rateNum;
  const gst_amount = (total * gstNum) / 100;
  const amount = total + gst_amount;

  // ✅ SQL query (matches values exactly)
  const query = `
    UPDATE medicines
    SET 
      agency_details = ?, 
      medicine_name = ?, 
      manufacture_by = ?, 
      batch = ?, 
      expiry_date = ?, 
      qty = ?, 
      hsn = ?, 
      rate = ?, 
      gst = ?, 
      total = ?, 
      gst_amount = ?, 
      amount = ?,
      invoice_number = ?, 
      invoice_date = ?, 
      pack = ?, 
      free = ?, 
      scheme = ?, 
      mrp = ?
    WHERE id = ? AND userId = ?
  `;

  const values = [
    agency_details,
    medicine_name,
    manufacture_by,
    batch,
    expiry_date,
    qtyNum,
    hsn,
    rateNum,
    gstNum,
    total,
    gst_amount,
    amount,
    invoice_number,
    invoice_date,
    pack,
    free,
    scheme,
    mrp,
    id,
    userId,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Error updating medicine:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .json({ message: "Medicine not found or unauthorized" });
    }

    res.status(200).json({
      message: "Medicine updated successfully...",
      data: {
        id,
        medicine_name,
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
        qty: qtyNum,
        mrp,
        rate: rateNum,
        gst: gstNum,
        total,
        gst_amount,
        amount,
      },
    });
  });
};


// Delete a medicine
exports.deleteMedicine = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `DELETE FROM medicines WHERE id = ? AND userId = ?`;

  db.run(query, [id, userId], function (err) {
    if (err) {
      console.error("Error deleting medicine:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .json({ message: "Medicine not found or unauthorized" });
    }

    res.status(200).json({ message: "Medicine deleted successfully" });
  });
};

exports.sellMedicines = (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items to sell" });
  }

  const insertStmt = db.prepare(`
    INSERT INTO sales (
      userId, medicine_id, medicine_name, agency_details, invoice_number, invoice_date,
      hsn, pack, manufacture_by, expiry_date, batch, free, scheme,
      qty, mrp, rate, gst, total, gst_amount, amount, sold_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      let completed = 0;
      const totalItems = items.length;
      let errorOccurred = false;

      items.forEach((item) => {
        const qty = parseFloat(item.qty || 0);
        const rate = parseFloat(item.rate || 0);
        const gst = parseFloat(item.gst || 0);
        const total = qty * rate;
        const gst_amount = (total * gst) / 100;
        const amount = total + gst_amount;

        // 1️⃣ Fetch stock first
        db.get(
          "SELECT qty FROM medicines WHERE id = ? AND userId = ?",
          [item.id, userId],
          (err, row) => {
            if (errorOccurred) return;
            if (err) {
              console.error("Error fetching stock:", err);
              errorOccurred = true;
              db.run("ROLLBACK");
              return res.status(500).json({ message: "Error fetching stock" });
            }

            if (!row) {
              errorOccurred = true;
              db.run("ROLLBACK");
              return res
                .status(404)
                .json({ message: `Medicine with ID ${item.id} not found.` });
            }

            const currentStock = parseFloat(row.qty);
            if (currentStock < qty) {
              errorOccurred = true;
              db.run("ROLLBACK");
              return res.status(400).json({
                message: `Insufficient stock for ${item.medicine_name}. Available: ${currentStock}`,
              });
            }
            console.log("= item ==", item);
            // 2️⃣ Insert sale record
            insertStmt.run(
              userId,
              item.id,
              item.medicine_name,
              item.agency_details,
              item.invoice_number,
              item.invoice_date,
              item.hsn,
              item.pack,
              item.manufacture_by,
              item.expiry_date,
              item.batch,
              item.free,
              item.scheme,
              qty,
              item.mrp,
              rate,
              gst,
              total,
              gst_amount,
              amount,
              new Date().toISOString(),
              (insertErr) => {
                if (errorOccurred) return;
                if (insertErr) {
                  console.error("Error inserting sale:", insertErr);
                  errorOccurred = true;
                  db.run("ROLLBACK");
                  return res
                    .status(500)
                    .json({ message: "Error inserting sale" });
                }

                // 3️⃣ Update stock
                db.run(
                  "UPDATE medicines SET qty = qty - ? WHERE id = ? AND userId = ?",
                  [qty, item.id, userId],
                  (updateErr) => {
                    if (errorOccurred) return;
                    if (updateErr) {
                      console.error("Error updating stock:", updateErr);
                      errorOccurred = true;
                      db.run("ROLLBACK");
                      return res
                        .status(500)
                        .json({ message: "Error updating stock" });
                    }

                    completed++;
                    // ✅ Finalize and commit only when all items are processed
                    if (completed === totalItems && !errorOccurred) {
                      db.run("COMMIT");
                      insertStmt.finalize();
                      return res.status(201).json({
                        message: "Sale recorded and stock updated successfully",
                      });
                    }
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (err) {
    console.error("Error recording sale:", err);
    db.run("ROLLBACK");
    res.status(500).json({ message: "Database error" });
  }
};

exports.getSalesHistory = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      id,
      medicine_id,
      medicine_name,
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
      qty,
      mrp,
      rate,
      gst,
      total,
      gst_amount,
      amount,
      sold_at
    FROM sales
    WHERE userId = ?
    ORDER BY sold_at DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching sales:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!rows.length) {
      return res.status(200).json({ message: "No sales found", data: [] });
    }

    // Optional: Format for frontend clarity
    const formatted = rows.map((r) => ({
      saleId: r.id,
      id: r.medicine_id,
      medicine_name: r.medicine_name,
      qty: r.qty,
      rate: r.rate,
      gst: r.gst,
      gst_amount: r.gst_amount,
      amount: r.amount,
      invoice_number: r.invoice_number,
      invoice_date: r.invoice_date,
      expiry_date: r.expiry_date,
      agency_details: r.agency_details,
      manufacture_by: r.manufacture_by,
      batch: r.batch,
      pack: r.pack,
      hsn: r.hsn,
      free: r.free,
      scheme: r.scheme,
      soldAt: r.sold_at,
    }));

    res.status(200).json({
      message: "Sales fetched successfully",
      data: formatted,
    });
  });
};
