import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import { InvoiceTemplate } from "./InvoiceTemplate";

const waitForRender = () => new Promise((resolve) => setTimeout(resolve, 350));

const getPaymentId = (item = {}) => item.payment_id || item.id || "subscription";

export const runInvoiceAction = async ({ action, item, user }) => {
  const paymentId = getPaymentId(item);
  const printWindow = action === "view" || action === "print"
    ? window.open("", "_blank")
    : null;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "-10000px";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<InvoiceTemplate item={item} user={user} />);

  try {
    await waitForRender();

    if (action === "download") {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${paymentId}.pdf`);
      return;
    }

    if (!printWindow) {
      throw new Error("Please allow pop-ups to open the invoice.");
    }

    printWindow.document.write(`
      <html>
        <head><title>Invoice - ${paymentId}</title></head>
        <body style="margin:0">${container.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    if (action === "print") {
      printWindow.focus();
      printWindow.print();
    }
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
};
