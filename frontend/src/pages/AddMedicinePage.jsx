import React from "react";
import { Container, Typography } from "@mui/material";
import AddMedicineForm from "../components/forms/AddMedicineForm";

const AddMedicinePage = () => (
  <Container maxWidth="md" >
    <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
      Add Medicine to Inventory
    </Typography>
    <Typography
      variant="subtitle1"
      color="text.secondary"
      textAlign="center"
      mb={4}
    >
      Enter new medicine details below to update your inventory.
    </Typography>
    <AddMedicineForm />
  </Container>
);

export default AddMedicinePage;
