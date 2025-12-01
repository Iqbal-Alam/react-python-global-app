import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import SnackbarAlert from "../components/SnackbarAlert";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setAlert({ open: true, message: "All fields are required", severity: "warning" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/signup", form);
      setAlert({ open: true, message: "Signup successful!", severity: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Signup failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f7f7f7">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Create Account
        </Typography>

        <TextField
          label="Full Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link underline="hover" onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
            Login
          </Link>
        </Typography>
      </Paper>

      <SnackbarAlert
        {...alert}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
}
