// src/components/layout/Sidebar.jsx
import React from "react";
import {
  Drawer,
  Box,
  IconButton,
  Divider,
  List,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavItem from "../common/NavItem";
import { menuItems } from "../../utils/menuItems";
import AppLogo from "../logo/AppLogo";

const drawerWidth = 240;

export default function Sidebar({ open, handleToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={handleToggle}
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 70,
          transition: "width 0.3s",
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        {open && <AppLogo />}
        <IconButton onClick={handleToggle} size="small">
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <NavItem key={item.path} {...item} open={open} />
        ))}
      </List>

      <Box flexGrow={1} />

      {open && (
        <Typography variant="body2" textAlign="center" pb={2} color="text.secondary">
          © 2025 CRM App
        </Typography>
      )}
    </Drawer>
  );
}
