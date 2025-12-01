import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CalculateIcon from "@mui/icons-material/Calculate";

const EditMedicineModal = ({ open, onClose, medicine, onSave }) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: medicine,
  });

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    reset(medicine);
    calculateAmount();
  }, [medicine, reset]);

  const qty = watch("qty");
  const rate = watch("rate");
  const gst_amount = watch("gst_amount");

  const calculateAmount = () => {
    const total = (Number(qty || 0) * Number(rate || 0)) + Number(gst_amount || 0);
    setCalculatedAmount(total.toFixed(2));
    setValue("amount", total.toFixed(2));
  };

  useEffect(() => {
    calculateAmount();
  }, [qty, rate, gst_amount]);

  const submitHandler = (data) => {
    onSave(data);
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Edit Medicine
      </DialogTitle>

      <DialogContent>
        <Box mt={3}>
          <form id="edit-medicine-form" onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={2}>
              {Object.entries(medicine).map(([key]) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                    <Controller
                    name={key}
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        label={key.replace(/_/g, " ").toUpperCase()}
                        fullWidth
                        variant="outlined"
                        type={
                            ["invoice_date", "expiry_date"].includes(key)
                            ? "date"
                            : ["qty", "rate", "amount", "gst", "gst_amount"].includes(key)
                            ? "number"
                            : "text"
                        }
                        InputLabelProps={
                            ["invoice_date", "expiry_date"].includes(key)
                            ? { shrink: true }
                            : undefined
                        }
                        InputProps={{
                            readOnly: key === "amount",
                            endAdornment: key === "amount" ? <CalculateIcon /> : null,
                        }}
                        />
                    )}
                    />
                </Grid>
                ))}
            </Grid>
          </form>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Calculated Total: ₹{calculatedAmount}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button form="edit-medicine-form" type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMedicineModal;
