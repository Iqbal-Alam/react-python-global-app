import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DATA from "../../utils/const";
import { lighten } from "@mui/material/styles";

const MedicineTableView = ({ medicines, onEdit, onDelete, onAddToCart, onBuyNow }) => {
  const headerColor = lighten(DATA.APP_PRIMARY_COLOR, 0.3);
  const hoverColor = lighten(DATA.APP_PRIMARY_COLOR, 0.95);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  if (!medicines || medicines.length === 0) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        No medicines available.
      </Typography>
    );
  }

  const headers = Object.keys(medicines[0]).filter(
    (key) => key !== "userId" && key !== "pack"
  );

  // Sorting logic
  const sortedMedicines = [...medicines].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const renderSortArrow = (key) => {
    if (sortColumn !== key) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort(key)}
                >
                  {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  {renderSortArrow(key)}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMedicines.map((medicine) => (
              <tr key={medicine.id || medicine._id}>
                {headers.map((key, i) => (
                  <td key={i} data-label={key}>
                    {medicine[key] !== null && medicine[key] !== undefined
                      ? medicine[key].toString()
                      : "-"}
                  </td>
                ))}
                <td data-label="Actions" style={{display: 'flex'}}>
                  <IconButton size="small" onClick={() => onAddToCart(medicine)}>
                    <AddShoppingCartIcon color="secondary" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onBuyNow(medicine)}>
                    <ShoppingBasketIcon color="warning" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onEdit(medicine)}>
                    <EditDocumentIcon color="primary" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(medicine.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .styled-table {
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 0.9em;
            min-width: 100%;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          }
          .styled-table thead tr {
            background-color: ${DATA.APP_PRIMARY_COLOR};
            color: #ffffff;
            text-align: left;
          }
          .styled-table th,
          .styled-table td {
            padding: 12px 15px;
          }
          .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
          }
          .styled-table tbody tr:nth-of-type(even) {
            background-color: ${hoverColor};
          }
          .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid ${DATA.APP_PRIMARY_COLOR};
          }
          .styled-table tbody tr.active-row {
            font-weight: bold;
            color: ${DATA.APP_PRIMARY_COLOR};
          }
            // .styled-table tbody tr:hover {
            //     background-color: ${hoverColor};
            //     transition: background-color 0.3s ease;
            //     cursor: pointer;
            // }
          @media (max-width: 1024px) {
            .styled-table {
              border: 0;
              min-width: 100%;
            }
            .styled-table thead {
              display: none;
            }
            .styled-table tbody tr {
              display: block;
              margin-bottom: 15px;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
              padding: 10px;
            }
            .styled-table td {
              display: flex;
              justify-content: space-between;
              padding: 8px 10px;
              border: none;
              border-bottom: 1px solid #eee;
              font-size: 13px;
            }
            .styled-table td:last-child {
              border-bottom: none;
            }
            .styled-table td::before {
              content: attr(data-label);
              font-weight: 600;
              text-transform: capitalize;
              color: #555;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MedicineTableView;
