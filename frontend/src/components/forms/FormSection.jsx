import React from "react";
import { Typography, Divider, Grid, Box } from "@mui/material";
import FormTextField from "./FormTextField";

const FormSection = ({ title, fields, control }) => {
  // Sort fields based on `order`
  const sortedFields = [...fields].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: "primary.main", mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {sortedFields.map((field) => (
          <FormTextField key={field.name} control={control} field={field} />
        ))}
      </Grid>
    </Box>
  );
};

export default FormSection;
