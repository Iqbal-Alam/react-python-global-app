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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setAlert({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAlert({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Invalid credentials",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f7f7f7"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          CRM Login
        </Typography>

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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link
            underline="hover"
            onClick={() => navigate("/signup")}
            sx={{ cursor: "pointer" }}
          >
            Sign Up
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
