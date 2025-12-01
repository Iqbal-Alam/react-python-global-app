import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

import MedicineTableView from "../../components/views/MedicineTableView";
import MedicineCardView from "../../components/views/MedicineCardView";
import MedicineAccordionView from "../../components/views/MedicineAccordionView";
import EditMedicineModal from "../modal/EditMedicineModal";
import DeleteMedicineModal from "../modal/DeleteMedicineModal";
import AddToCartModal from "../modal/AddToCartModal";
import BuyNowModal from "../modal/BuyNowModal";
import SnackbarAlert from "../SnackbarAlert";
import ProgressBar from "../ProgressBar";

import api from "../../utils/api";
import Loader from "../Loader";
import DATA from "../../utils/const";
import { lighten } from "@mui/material";

function MedicineDetailView() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const lightenColor = lighten(DATA.APP_PRIMARY_COLOR, 0.8);

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, medicines]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.get("medicines");
      const data = response.data.data || [];
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredMedicines(medicines);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = medicines.filter((med) =>
      Object.values(med).some(
        (val) => val && val.toString().toLowerCase().includes(lowerQuery)
      )
    );
    setFilteredMedicines(filtered);
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setEditOpen(true);
  };

  const handleAddToCartMedicine = async (medicine) => {
    console.log("add to cart handle", medicine);
    setSelectedMedicine(medicine);
    setAddToCartOpen(true);
  };

  const handleBuyNowMedicine = async (medicine) => {
    console.log("handleBuyNowMedicine", medicine);
    setSelectedMedicine(medicine);
    setBuyNowOpen(true);
  };

  const saveMedicine = async (updatedMedicine) => {
    setLoading(true);
    try {
      // API call to update medicine
      const res = await api.put(
        `medicines/${updatedMedicine.id}`,
        updatedMedicine
      );
      console.log("res", res.data.message);
      setAlert({
        open: true,
        message: `${res.data.message}`,
        severity: "success",
      });
      // Update local state
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === updatedMedicine.id ? updatedMedicine : med
        )
      );
      setFilteredMedicines((prev) =>
        prev.map((med) =>
          med.id === updatedMedicine.id ? updatedMedicine : med
        )
      );

      setEditOpen(false);
      setSelectedMedicine(null);
    } catch (err) {
      console.error("Update failed:", err);
      setAlert({ open: true, message: `${err?.message}`, severity: "error" });
    } finally{
        setLoading(false);
    }
  };

  const saveAddToCartMedicine = async (addedMedicine) => {
    const { addQty, ...rest } = addedMedicine; // extract addQty and keep the rest
    const medicineToAdd = {
        ...rest,
        qty: (addedMedicine.qty || 0) - (addQty || 0), // update remaining qty
    };
    console.log("add to cart", medicineToAdd);
    setLoading(true);
    try {
      const res = await api.post(`/cart`, medicineToAdd);
      console.log("res", res.data.message);
      setAlert({
        open: true,
        message: `${res.data.message}`,
        severity: "success",
      });
      setMedicines((prev) =>
        prev.map((med) => (med.id === medicineToAdd.id ? medicineToAdd : med))
      );
      setFilteredMedicines((prev) =>
        prev.map((med) => (med.id === medicineToAdd.id ? medicineToAdd : med))
      );

      setEditOpen(false);
      setSelectedMedicine(null);
    } catch (err) {
      console.error("Update failed:", err);
      setAlert({ open: true, message: `${err?.message}`, severity: "error" });
    } finally{
        setLoading(false);
    }
  };

  const saveBuyNowMedicine = async (medicine) => {
    console.log("handleBuyNowMedicine", medicine);
    setSelectedMedicine(medicine);
    setBuyNowOpen(true);
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    try {
      const res = await api.delete(`medicines/${id}`);
      setAlert({
        open: true,
        message: `${res?.data?.message}`,
        severity: "success",
      });
      setMedicines((prev) => prev.filter((med) => med.id !== id));
      setFilteredMedicines((prev) => prev.filter((med) => med.id !== id));
      setDeleteOpen(false);
      setSelectedMedicine(null);
    } catch (err) {
      setAlert({ open: true, message: `${err?.message}`, severity: "error" });
    } finally{
        setLoading(false);
    }
  };

  if (loading) return <ProgressBar />;

  return (
    <Box>
      {/* Search and Toggle */}
      <TextField
        label="Search Medicines..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Box display="flex" justifyContent="flex-end" sx={{ padding: "10px 0" }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => newView && setView(newView)}
          size="small"
        >
          <Tooltip title="Table View">
            <ToggleButton
              value="table"
              sx={{
                padding: "10px 20px",
                color: "gray",
                "&.Mui-selected": {
                  color: `${DATA.APP_PRIMARY_COLOR}`,
                  backgroundColor: `${lightenColor}`,
                },
              }}
            >
              <TableViewIcon />
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Card View">
            <ToggleButton
              value="card"
              sx={{
                padding: "10px 20px",
                color: "gray",
                "&.Mui-selected": {
                  color: `${DATA.APP_PRIMARY_COLOR}`,
                  backgroundColor: `${lightenColor}`,
                },
              }}
            >
              <ViewModuleIcon />
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Accordion View">
            <ToggleButton
              value="accordion"
              sx={{
                padding: "10px 20px",
                color: "gray",
                "&.Mui-selected": {
                  color: `${DATA.APP_PRIMARY_COLOR}`,
                  backgroundColor: `${lightenColor}`,
                },
              }}
            >
              <ViewAgendaIcon />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>

      {/* Render Views */}
      {view === "table" && (
        <MedicineTableView
          medicines={filteredMedicines}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onAddToCart={handleAddToCartMedicine}
          onBuyNow={handleBuyNowMedicine}
        />
      )}
      {view === "card" && (
        <MedicineCardView
          medicines={filteredMedicines}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      )}
      {view === "accordion" && (
        <MedicineAccordionView
          medicines={filteredMedicines}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      )}

      {/* Modals */}
      <EditMedicineModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        medicine={selectedMedicine}
        onSave={saveMedicine}
      />

      <DeleteMedicineModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        medicine={selectedMedicine}
        onDelete={confirmDelete}
      />

      <AddToCartModal
        open={addToCartOpen}
        onClose={() => setAddToCartOpen(false)}
        medicine={selectedMedicine}
        onAddToCart={saveAddToCartMedicine}
      />

      <BuyNowModal
        open={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        medicine={selectedMedicine}
        onBuyNow={saveBuyNowMedicine}
      />

      <SnackbarAlert
        {...alert}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
}

export default MedicineDetailView;
