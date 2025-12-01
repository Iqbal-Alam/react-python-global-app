
import { LinearProgress, Box } from "@mui/material";

function ProgressBar() {
  return (
        <Box sx={{ 
            width: "100%", 
            position: 'fixed',
            top: 0,
            zIndex: 9999,
            left: 0 
        }}>
            <LinearProgress color="primary" />
        </Box>
    )
}

export default ProgressBar;
