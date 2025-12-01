// src/components/common/NavItem.jsx
import React from "react";
import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavItem({ label, icon, path, open }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname === path;

  return (
    <Tooltip title={!open ? label : ""} placement="right">
      <ListItemButton
        onClick={() => navigate(path)}
        selected={selected}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        //   borderRadius: 2,
          "&.Mui-selected": {
            // backgroundColor: "primary.main",
            backgroundColor: "primary.main",
            color: "white",
            "& .MuiListItemIcon-root": { color: "white" },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color: selected ? "white" : "text.primary",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </Tooltip>
  );
}
