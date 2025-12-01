import React from "react";
import { Paper } from "@mui/material";

const CustomCard = ({ children }) => (
  <Paper
    elevation={4}
    sx={{
      p: 4,
      borderRadius: 3,
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    }}
  >
    {children}
  </Paper>
);

export default CustomCard;
