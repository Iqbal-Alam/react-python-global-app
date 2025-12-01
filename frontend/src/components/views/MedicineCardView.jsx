import React from "react";
import { Grid } from "@mui/material";
import MedicineCard from "./MedicineCard";

const MedicineCardView = ({ medicines, onEdit, onDelete }) => {
  if (!medicines || medicines.length === 0) return null;
  console.log('MedicineCardView', medicines);

  return (
    <Grid container spacing={2} sx={{marginTop: '10px'}}>
      {medicines.map((med) => (
        <Grid key={med.id} size={{xs:12, sm:6, md:3}}>
          {/* Pass med and handlers explicitly */}
          <MedicineCard med={med} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MedicineCardView;
