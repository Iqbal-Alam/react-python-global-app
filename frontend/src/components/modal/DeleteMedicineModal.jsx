import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const DeleteMedicineModal = ({ open, onClose, onDelete, medicine }) => {
  if (!medicine) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Medicine</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{medicine.medicine_name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(medicine.id)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMedicineModal;
