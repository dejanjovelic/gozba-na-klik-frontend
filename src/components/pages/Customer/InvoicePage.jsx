import React, { useState } from "react";
import axios from "axios";
import { fetchOrderPdfInvoiceAsync } from "../../../services/OrderService";

const InvoiceViewer = ({ orderId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const token = localStorage.getItem("token");

  const loadPdf = async () => {
    try {
      const response = await fetchOrderPdfInvoiceAsync(9)
      console.log("Status:", response.status);
      console.log("Content-Type:", response.headers["content-type"]);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("PDF load error:", err);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetchOrderPdfInvoiceAsync(9);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Faktura.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div>
      <button onClick={loadPdf}>Prikaži fakturu</button>
      <button onClick={downloadPdf}>Preuzmi fakturu</button>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="Invoice PDF"
          style={{ width: "100%", height: "800px", marginTop: "20px" }}
        ></iframe>
      )}
    </div>
  );
};

export default InvoiceViewer;
