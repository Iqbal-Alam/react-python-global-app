import React, { useState } from "react";
import { Box, Card, CardContent, Typography, IconButton, Divider, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";
import DATA from "../../utils/const";

const MedicineCard = ({ med, onEdit, onDelete }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box
      sx={{
        perspective: 1200,
        width: "100%",
        height: 280,
        cursor: "pointer",
        mb: 2,
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "center",
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backfaceVisibility: "hidden",
            background: `${DATA.APP_PRIMARY_COLOR}`,
            color: "#fff",
            boxShadow: 6,
            transition: "0.3s",
            "&:hover": { transform: "scale(1.03)" },
          }}
        >
          <MedicationIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center" }}>
            {med.medicine_name}
          </Typography>
          <Chip
            label={`Qty: ${med.qty}`}
            sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: "bold" }}
            size="small"
          />
        </Card>

        {/* Back Side */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 3,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "#f9f9f9",
            boxShadow: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              {med.medicine_name}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
              <Typography variant="body2">
                <strong>Invoice:</strong> {med.invoice_number}
              </Typography>
              <Typography variant="body2">
                <strong>Expiry:</strong> {med.expiry_date}
              </Typography>
              <Typography variant="body2">
                <strong>Rate:</strong> ₹{med.rate}
              </Typography>
              <Typography variant="body2">
                <strong>MRP:</strong> ₹{med.mrp}
              </Typography>
              <Typography variant="body2">
                <strong>GST%:</strong> {med.gst}
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="secondary">
                Amount: ₹{med.amount}
              </Typography>
            </Box>
          </CardContent>

          <Box mt={2} display="flex" justifyContent="space-between">
            <IconButton size="small" onClick={() => onEdit(med)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(med.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default MedicineCard;
