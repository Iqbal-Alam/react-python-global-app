import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { medicineFormSections } from "./formConfig";
import FormSection from "./FormSection";
import CustomCard from "../customCard";
import api from "../../utils/api";
import { Box, Button, Card, CardContent, Typography, LinearProgress } from "@mui/material";
import * as XLSX from "xlsx";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DATA from "../../utils/const";
import SnackbarAlert from "../SnackbarAlert";
import ProgressBar from "../ProgressBar";

const AddMedicineForm = () => {
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [loading, setLoading] = useState(false);
  // Extract default values from config
  const defaultValues = {};
  medicineFormSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      } else {
        defaultValues[field.name] = "";
      }
    });
  });

  const { handleSubmit, control, watch, setValue } = useForm({ defaultValues });

  // Auto-generate invoice number if flagged
  useEffect(() => {
    const autoInvoiceField = medicineFormSections
      .flatMap((s) => s.fields)
      .find((f) => f.autoGenerate);

    if (autoInvoiceField) {
      const generateInvoiceNumber = async () => {
        try {
          const res = await api.getLastInvoice();
          const lastNumber = res.data?.invoice_number?.split("-")[1] || "000";
          const nextNumber = String(Number(lastNumber) + 1).padStart(3, "0");
          setValue(autoInvoiceField.name, `INV-${nextNumber}`);
        } catch {
          setValue(
            autoInvoiceField.name,
            autoInvoiceField.defaultValue || "INV-001"
          );
        }
      };
      generateInvoiceNumber();
    }
  }, [setValue]);

  // Watch qty, rate, gst to calculate total
  const qty = watch("qty");
  const rate = watch("rate");
  const gst = watch("gst");

  useEffect(() => {
    const total = qty && rate ? qty * rate : 0;
    const gst_amount = (total * (gst || 0)) / 100;
    const amount = total + gst_amount;

    setValue("total", total.toFixed(2));
    setValue("gst_amount", gst_amount.toFixed(2));
    setValue("amount", amount.toFixed(2));
  }, [qty, rate, gst, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/medicines", data);
      setAlert({ open: true, message: `${res?.data?.message}`, severity: "success" });
    } catch (err) {
        setAlert({ open: true, message: `${err.response?.data?.message}`, severity: "error" });
        setLoading(false);
    } finally{
        setLoading(false);
    }
  };

  const handleExcelUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

    if (jsonData.length > 0) {
      const row = jsonData[0];
      Object.keys(row).forEach((key) => {
        let value = row[key];

        // ✅ Normalize invoice_date and expiry_date formats
        if (key === "invoice_date" || key === "expiry_date") {
          if (typeof value === "number") {
            // Excel serial date (e.g., 45678)
            const jsDate = XLSX.SSF.parse_date_code(value);
            if (jsDate) {
              value = `${jsDate.y}-${String(jsDate.m).padStart(2, "0")}-${String(
                jsDate.d
              ).padStart(2, "0")}`;
            }
          } else if (typeof value === "string" && value.trim() !== "") {
            // Handle string formats like "12/12/2026" or "12-12-2026"
            const parts = value.includes("/")
              ? value.split("/")
              : value.split("-");
            if (parts.length === 3) {
              let day, month, year;

              // Detect if format is dd/mm/yyyy or mm/dd/yyyy
              if (Number(parts[0]) > 12) {
                // dd/mm/yyyy
                [day, month, year] = parts;
              } else if (Number(parts[1]) > 12) {
                // mm/dd/yyyy
                [month, day, year] = parts;
              } else {
                // assume dd/mm/yyyy by default
                [day, month, year] = parts;
              }

              value = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            }
          }
        }

        if (defaultValues[key] !== undefined) {
          setValue(key, value);
        }
      });
    }
  };
  reader.readAsArrayBuffer(file);
};

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 5,
        overflow: "hidden",
        mb: 4,
        transition: "0.3s",
        "&:hover": { boxShadow: 8 },
      }}
    >
      {/* progressbar */}
      {loading &&  <ProgressBar /> }

      <Box
        sx={{
          backgroundColor: DATA.APP_PRIMARY_COLOR,
          color: "#fff",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Add New Medicine
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Upload Excel Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            //   mb: 3,
            }}
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                color: DATA.APP_PRIMARY_COLOR,
                borderColor: DATA.APP_PRIMARY_COLOR,
                "&:hover": {
                  backgroundColor: `${DATA.APP_PRIMARY_COLOR}15`,
                  borderColor: DATA.APP_PRIMARY_COLOR,
                },
              }}
            >
              Upload Excel
              <input
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
              />
            </Button>
          </Box>

          {/* Dynamic Form Sections */}
          {medicineFormSections.map((section) => (
            <FormSection
              key={section.title}
              title={section.title}
              fields={section.fields}
              control={control}
            />
          ))}

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: DATA.APP_PRIMARY_COLOR,
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              Save Medicine
            </Button>
          </Box>
        </form>
      </CardContent>
      <SnackbarAlert
            {...alert}
            onClose={() => setAlert({ ...alert, open: false })}
        />
    </Card>
  );
};

export default AddMedicineForm;
