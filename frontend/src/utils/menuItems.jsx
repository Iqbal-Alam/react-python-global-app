// src/utils/menuItems.js
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SettingsIcon from "@mui/icons-material/Settings";

export const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Add Medicine", icon: <PeopleIcon />, path: "/add-medicine" },
  { label: "Leads", icon: <PersonAddAltIcon />, path: "/leads" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];
