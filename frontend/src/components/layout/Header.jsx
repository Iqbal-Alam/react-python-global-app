// src/components/layout/Header.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  useTheme,
  Button,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Header({ handleToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/invoice");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton color="inherit" onClick={handleToggle} edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MY-MEDICO
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {/* 🛒 Cart Icon with count */}
          <IconButton color="inherit" onClick={handleCartClick}>
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Avatar alt="User" src="/images/user.jpg" />
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
