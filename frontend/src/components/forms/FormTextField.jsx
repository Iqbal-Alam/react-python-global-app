import React from "react";
import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";

const FormTextField = ({ control, field }) => (
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Controller
      name={field.name}
      control={control}
      defaultValue=""
      render={({ field: controllerField, fieldState: { error } }) => (
        <TextField
          {...controllerField}
          fullWidth
          size="small"
          label={field.label}
          type={field.type}
          variant="outlined"
          InputLabelProps={field.type === "date" ? { shrink: true } : {}}
          disabled={field.disabled}
          error={!!error}
          helperText={error?.message}
          sx={{width: '250px'}}
        />
      )}
      rules={{
        required: field.required ? `${field.label} is required` : false,
      }}
    />
  </Grid>
);

export default FormTextField;
