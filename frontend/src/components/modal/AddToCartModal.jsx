// src/components/AddToCartModal.jsx
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCart } from "../../context/CartContext";

const AddToCartModal = ({ open, onClose, medicine }) => {
  const { addToCart } = useCart();
  const { control, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: { addQty: "" },
  });

  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const addQty = watch("addQty");

  useEffect(() => {
    if (medicine) {
      reset({ addQty: "" });
      setCalculatedAmount(0);
    }
  }, [medicine, reset]);

  useEffect(() => {
    if (!medicine) return;
    const qtyToUse = Number(addQty || 0);
    const total =
      Number(medicine.rate || 0) * qtyToUse +
      (Number(medicine.rate || 0) * qtyToUse * (Number(medicine.gst || 0) / 100));
    setCalculatedAmount(total.toFixed(2));
  }, [addQty, medicine]);

  const submitHandler = (data) => {
    addToCart({
      ...medicine,
      addQty: Number(data.addQty),
      amount: parseFloat(calculatedAmount),
    });
    onClose();
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "primary.main", color: "#fff", textAlign: "center" }}>
        Add To Cart
      </DialogTitle>

      <DialogContent>
        <Box mt={2} component="form" id="add-to-cart-form" onSubmit={handleSubmit(submitHandler)}>
          <TextField
            label="Available Quantity"
            value={medicine.qty || 0}
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true, style: { fontWeight: "bold" } }}
            sx={{ mb: 2 }}
          />

          <Controller
            name="addQty"
            control={control}
            rules={{
              required: "Quantity is required",
              min: { value: 1, message: "Minimum 1" },
              max: { value: medicine.qty || 0, message: `Cannot exceed ${medicine.qty}` },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quantity to Add"
                type="number"
                fullWidth
                variant="outlined"
                error={!!errors.addQty}
                helperText={errors.addQty?.message}
                inputProps={{ min: 1, max: medicine.qty || 0 }}
              />
            )}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Total: ₹{calculatedAmount}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          form="add-to-cart-form"
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToCartModal;
