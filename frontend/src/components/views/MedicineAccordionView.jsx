import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicationIcon from "@mui/icons-material/Medication";
import DATA from "../../utils/const";

const MedicineAccordionView = ({ medicines }) => {
  return (
    <Box sx={{marginTop: '10px'}}>
      {/* <Typography
        variant="h5"
        mb={3}
        fontWeight="bold"
        textAlign="center"
        color="primary"
      >
        Medicines
      </Typography> */}

      {medicines.map((med, i) => (
        <Accordion
          key={i}
          elevation={3}
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            "&:before": { display: "none" },
            "&:hover": {
              boxShadow: "0px 6px 15px rgba(0,0,0,0.15)",
              transform: "scale(1.01)",
              transition: "0.3s ease",
            },
          }}
        >
          {/* Accordion Header */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            sx={{
              backgroundColor: `${DATA.APP_PRIMARY_COLOR}`,
              color: "#fff",
              "& .MuiAccordionSummary-content": {
                alignItems: "center",
                gap: 1,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: `${DATA.APP_PRIMARY_COLOR}`,
                width: 32,
                height: 32,
              }}
            >
              <MedicationIcon fontSize="small" />
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              {med.medicine_name}
            </Typography>
          </AccordionSummary>

          {/* Accordion Details */}
          <AccordionDetails sx={{ backgroundColor: "#f9f9f9" }}>
            <Grid container spacing={2}>
              {/* Column 1 */}
              <Grid size={{xs:12, sm:4}}>
                <Typography variant="body2">
                  <strong>Invoice No:</strong> {med.invoice_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Invoice Date:</strong> {med.invoice_date}
                </Typography>
                <Typography variant="body2">
                  <strong>Batch:</strong> {med.batch}
                </Typography>
                <Typography variant="body2">
                  <strong>HSN:</strong> {med.hsn}
                </Typography>
              </Grid>

              {/* Column 2 */}
              <Grid size={{xs:12, sm:4}}>
                <Typography variant="body2">
                  <strong>Expiry Date:</strong> {med.expiry_date}
                </Typography>
                <Typography variant="body2">
                  <strong>Qty:</strong> {med.qty}
                </Typography>
                <Typography variant="body2">
                  <strong>Free:</strong> {med.free || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Scheme:</strong> {med.scheme || 0}
                </Typography>
              </Grid>

              {/* Column 3 */}
              <Grid size={{xs:12, sm:4}}>
                <Typography variant="body2">
                  <strong>Rate:</strong> ₹{med.rate}
                </Typography>
                <Typography variant="body2">
                  <strong>MRP:</strong> ₹{med.mrp}
                </Typography>
                <Typography variant="body2">
                  <strong>GST:</strong> {med.gst}%
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  Amount: ₹{med.amount}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MedicineAccordionView;
