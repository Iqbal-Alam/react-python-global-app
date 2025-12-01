const sqlite3 = require("sqlite3").verbose();

// Create and connect to SQLite DB (file based)
const db = new sqlite3.Database("./GLOBAL_APP.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database.");

    // Create Users table if not exists
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )`
    );
    // db.run(`ALTER TABLE medicines DROP COLUMN pact`);

    // ✅ Create Medicines table if not exists
    db.run(
      `CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agency_details TEXT,
        invoice_number TEXT,
        invoice_date TEXT,
        medicine_name TEXT,
        hsn TEXT,
        pack TEXT,
        manufacture_by TEXT,
        expiry_date TEXT,
        batch TEXT,
        qty INTEGER,
        free TEXT,
        scheme TEXT,
        mrp TEXT,
        rate REAL,
        gst REAL,
        total REAL,
        gst_amount REAL,
        amount REAL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
        )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        medicine_id INTEGER,
        medicine_name TEXT,
        qty INTEGER,
        rate REAL,
        gst REAL,
        agency_details TEXT,
        invoice_number TEXT,
        invoice_date TEXT,
        hsn TEXT,
        pack TEXT,
        manufacture_by TEXT,
        expiry_date TEXT,
        batch TEXT,
        free INTEGER,
        scheme TEXT,
        mrp REAL
        );`
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            medicine_id INTEGER,
            medicine_name TEXT,
            agency_details TEXT,
            invoice_number TEXT,
            invoice_date TEXT,
            hsn TEXT,
            pack TEXT,
            manufacture_by TEXT,
            expiry_date TEXT,
            batch TEXT,
            free REAL,
            scheme TEXT,
            qty INTEGER,
            mrp REAL,
            rate REAL,
            gst REAL,
            total REAL,
            gst_amount REAL,
            amount REAL,
            sold_at TEXT
        );
    `);
  }
});

module.exports = db;
