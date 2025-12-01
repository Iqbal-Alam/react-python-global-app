import db from "../db.js";

export const addMedicine = (medicine, userId) => {
  const stmt = db.prepare(`
    INSERT INTO medicines 
    (name, manufacturer, batchNumber, expiryDate, qty, rate, gst, amount, invoiceNumber, userId)
    VALUES (@name, @manufacturer, @batchNumber, @expiryDate, @qty, @rate, @gst, @amount, @invoiceNumber, @userId)
  `);

  const info = stmt.run({ ...medicine, userId });
  return { id: info.lastInsertRowid, ...medicine };
};
