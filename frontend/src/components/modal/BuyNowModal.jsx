import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  lighten
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DATA from "../../utils/const";

const BuyNowModal = ({ open, onClose, medicine, onBuy }) => {
  const [step, setStep] = useState(1); // 1 = enter qty, 2 = confirm invoice
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: { buyQty: "" },
  });

  const buyQty = watch("buyQty");
  const lightColor = lighten(DATA.APP_PRIMARY_COLOR, 0.8);

  useEffect(() => {
    if (medicine) {
      reset({ buyQty: "" });
      setCalculatedAmount(0);
      setStep(1);
    }
  }, [medicine, reset, open]);

  useEffect(() => {
    if (!medicine) return;
    const qtyToUse = Number(buyQty || 0);
    const total =
      Number(medicine.rate || 0) * qtyToUse +
      Number(medicine.rate || 0) * qtyToUse * (Number(medicine.gst || 0) / 100);
    setCalculatedAmount(total.toFixed(2));
  }, [buyQty, medicine]);

  const proceedToInvoice = () => setStep(2);
  const confirmPurchase = () => {
    const sale = { ...medicine, buyQty: Number(buyQty), totalAmount: Number(calculatedAmount) };
    onBuy(sale);
    onClose();
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 20,
        }}
      >
        {step === 1 ? "Enter Quantity" : "Confirm Purchase"}
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 6 }}>
        {step === 1 && (
          <form id="buy-now-form" onSubmit={handleSubmit(proceedToInvoice)} style={{marginTop: '25px'}}>
            <TextField
              label="Available Quantity"
              value={medicine.qty || 0}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true, style: { fontWeight: "bold" } }}
              sx={{ mb: 3, borderRadius: 2 }}
            />

            <Controller
              name="buyQty"
              control={control}
              rules={{
                required: "Quantity is required",
                min: { value: 1, message: "Minimum 1" },
                max: {
                  value: medicine.qty || 0,
                  message: `Cannot exceed ${medicine.qty}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity to Buy"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.buyQty}
                  helperText={errors.buyQty ? errors.buyQty.message : ""}
                  inputProps={{ min: 1, max: medicine.qty || 0 }}
                  sx={{ mb: 3, borderRadius: 2 }}
                />
              )}
            />
          </form>
        )}

        {step === 2 && (
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 3,
              p: 4,
              backgroundColor: "#fdfdfd",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginTop: '20px'
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{ borderBottom: "2px solid primary.main", pb: 1 }}
            >
              Invoice Summary
            </Typography>

            <Box mb={3}>
              <Typography><strong>Medicine Name:</strong> {medicine.medicine_name}</Typography>
              <Typography><strong>HSN:</strong> {medicine.hsn}</Typography>
              <Typography><strong>Manufacturer:</strong> {medicine.manufacture_by}</Typography>
              <Typography><strong>Invoice Date:</strong> {medicine.invoice_date}</Typography>
              <Typography><strong>Expiry Date:</strong> {medicine.expiry_date}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                fontWeight: "bold",
                py: 1,
                mb: 1,
                backgroundColor: `${lightColor}`,
                borderRadius: 1,
              }}
            >
              <Typography sx={{fontWeight: 'bold'}}>Item</Typography>
              <Typography sx={{fontWeight: 'bold'}}>Rate</Typography>
              <Typography sx={{fontWeight: 'bold'}}>GST %</Typography>
              <Typography sx={{fontWeight: 'bold'}}>Qty</Typography>
              <Typography sx={{fontWeight: 'bold'}}>Total</Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                py: 1,
                mb: 2,
              }}
            >
              <Typography>{medicine.medicine_name}</Typography>
              <Typography>₹{medicine.rate}</Typography>
              <Typography>{medicine.gst}%</Typography>
              <Typography>{buyQty}</Typography>
              <Typography>₹{calculatedAmount}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ backgroundColor: "#d1e7dd", px: 3, py: 1, borderRadius: 1 }}
              >
                Grand Total: ₹{calculatedAmount}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 6, py: 3 }}>
        <Button onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>

        {step === 1 && (
          <Button
            form="buy-now-form"
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid}
            sx={{ fontWeight: "bold" }}
          >
            Continue
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={confirmPurchase}
            variant="contained"
            color="success"
            sx={{ fontWeight: "bold" }}
          >
            Purchase
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BuyNowModal;
