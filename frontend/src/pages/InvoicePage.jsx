import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Grid,
  Paper,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SaveIcon from "@mui/icons-material/Save";
import { useCart } from "../context/CartContext";

export default function InvoicePage() {
  const { cartItems, clearCart } = useCart();
  const theme = useTheme();

  // Customer input fields
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    contact: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Invoice info
  const invoice = {
    number: `INV-${Math.floor(Math.random() * 100000)}`,
    date: new Date().toLocaleDateString(),
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const gstTotal = cartItems.reduce(
    (sum, item) => sum + (item.rate * item.qty * item.gst) / 100,
    0
  );
  const totalAmount = subTotal + gstTotal;

  const handlePrint = () => window.print();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!customer.name || !customer.contact) {
      alert("Please enter customer name and contact number!");
      return;
    }

    setIsSaving(true);

    try {
      // Replace with your actual API call later
      const billData = {
        invoice,
        customer,
        cartItems,
        subTotal,
        gstTotal,
        totalAmount,
      };

      console.log("🧾 Invoice Data:", billData);
      alert("Invoice saved successfully!");
      // Example: await axios.post("/api/invoice", billData);

      clearCart();
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
            MY-MEDICO PHARMACY
          </Typography>
          <Typography variant="body2" color="textSecondary">
            “Your Health, Our Priority”
          </Typography>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="subtitle2">GSTIN: 09ABCDE1234Z9X</Typography>
          <Typography variant="subtitle2">
            Email: info@mymedico.com | +91 98765 43210
          </Typography>
        </Box>

        {/* Customer & Invoice Info */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Bill To:
            </Typography>

            <TextField
              fullWidth
              label="Customer Name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={customer.address}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={customer.contact}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Invoice Details:
            </Typography>
            <Typography>Invoice No: {invoice.number}</Typography>
            <Typography>Date: {invoice.date}</Typography>
          </Grid>
        </Grid>

        {/* Invoice Table */}
        {cartItems.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No items in cart.
          </Typography>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Medicine</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>HSN</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Batch</TableCell>

                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Rate (₹)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    GST (%)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Amount (₹)
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.medicine_name}</TableCell>
                    <TableCell>{item.hsn}</TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell align="right">{item.qty}</TableCell>
                    <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.gst}%</TableCell>
                    <TableCell align="right">
                      ₹
                      {(
                        item.rate * item.qty +
                        (item.rate * item.qty * item.gst) / 100
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell colSpan={7} align="right" sx={{ fontWeight: "bold" }}>
                    Subtotal
                  </TableCell>
                  <TableCell align="right">₹{subTotal.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={7} align="right" sx={{ fontWeight: "bold" }}>
                    GST
                  </TableCell>
                  <TableCell align="right">₹{gstTotal.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Grand Total
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: theme.palette.primary.main,
                    }}
                  >
                    ₹{totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Footer */}
            <Box mt={4}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Thank you for shopping with <strong>MY-MEDICO</strong>!
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                * Medicines once sold are not returnable unless defective. *
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box
              mt={4}
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Bill"}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print Invoice
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
