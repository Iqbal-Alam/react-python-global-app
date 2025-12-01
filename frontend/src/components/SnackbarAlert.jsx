import React from "react";
import Snackbar from '@mui/material/Snackbar';

export default function SnackbarAlert({ open, message, severity, onClose }) {
  return (
    <Snackbar
        open={open}
        onClose={onClose}
        message={message}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
}
