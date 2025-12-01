// src/components/forms/formConfig.js
export const medicineFormSections = [
  {
    title: "Medicine Details",
    fields: [
      {
        name: "medicine_name",
        label: "Medicine Name",
        type: "text",
        required: true,
        order: 1,
      },
      { name: "hsn", label: "HSN Code", type: "text", order: 2 },
      { name: "pack", label: "Pack", type: "text", order: 3, defaultValue: "1 * "  },
      {
        name: "manufacture_by",
        label: "Manufactured By",
        type: "text",
        order: 4,
      },
      { name: "expiry_date", label: "Expiry Date", type: "date", order: 5 },
      { name: "batch", label: "Batch No.", type: "text", order: 6 },
    ],
  },
  {
    title: "Invoice Details",
    fields: [
      {
        name: "agency_details",
        label: "Agency Details",
        type: "text",
        required: true,
        order: 2,
      },
      {
        name: "invoice_number",
        label: "Invoice Number",
        type: "text",
        required: true,
        order: 1,
        autoGenerate: true,
      },
      {
        name: "invoice_date",
        label: "Invoice Date",
        type: "date",
        required: true,
        order: 3,
        defaultValue: new Date().toISOString().split("T")[0],
      },
    ],
  },
  {
    title: "Pricing Details",
    fields: [
      {
        name: "qty",
        label: "Quantity",
        type: "number",
        required: true,
        order: 1,
      },
      { name: "free", label: "Free", type: "text", order: 2, defaultValue: "0"  },
      { name: "scheme", label: "Scheme", type: "text", order: 3, defaultValue: "0"  },
      { name: "mrp", label: "MRP", type: "number", order: 4 },
      { name: "rate", label: "Rate", type: "number", order: 5 },
      { name: "gst", label: "GST (%)", type: "number", order: 6 },
      {
        name: "total",
        label: "Total",
        type: "number",
        disabled: true,
        order: 7,
      },
      {
        name: "gst_amount",
        label: "GST Amount",
        type: "number",
        disabled: true,
        order: 8,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        disabled: true,
        order: 9,
      },
    ],
  },
];
