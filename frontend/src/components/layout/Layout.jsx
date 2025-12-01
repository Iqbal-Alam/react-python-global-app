// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <Header handleToggle={handleToggle} />
      <Sidebar open={open} handleToggle={handleToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // offset for AppBar height
          transition: "margin 0.3s",
          width: open ? "calc(100% - 240px)" : "calc(100% - 70px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
