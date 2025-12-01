import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicineTableView from "../components/views/MedicineTableView";
import MedicineCardView from "../components/views/MedicineCardView";
import MedicineAccordionView from "../components/views/MedicineAccordionView";

const MedicineDetails = ({ medicines }) => {
  const [view, setView] = useState("table");
  const theme = useTheme();

  const handleViewChange = (_, nextView) => {
    if (nextView !== null) setView(nextView);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Medicine Details
        </Typography>

        {/* Toggle Bar */}
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <ToggleButton value="table" aria-label="table view">
            <TableViewIcon />
          </ToggleButton>
          <ToggleButton value="card" aria-label="card view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="accordion" aria-label="accordion view">
            <ExpandMoreIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* View Renderer */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          minHeight: "70vh",
          overflowY: "auto",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {view === "table" && <MedicineTableView medicines={medicines} />}
        {view === "card" && <MedicineCardView medicines={medicines} />}
        {view === "accordion" && <MedicineAccordionView medicines={medicines} />}
      </Paper>
    </Box>
  );
};

export default MedicineDetails;
