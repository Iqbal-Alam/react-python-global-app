import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="70vh"
  >
    <CircularProgress />
  </Box>
);

export default Loader;
