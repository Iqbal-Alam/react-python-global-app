import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DATA from './utils/const.js';

const theme = createTheme({
  palette: {
    primary: { main: `${DATA.APP_PRIMARY_COLOR}` },
    secondary: { main: "#96007fff" },
  },
  typography: {
    fontFamily: "'Manrope', sans-serif",
  },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </StrictMode>
);
