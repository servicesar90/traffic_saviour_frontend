import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

export const SubscriptionView = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("plan");
    if (stored) {
      setDetails(JSON.parse(stored));
    }
  }, []);

  const InvoiceTemplate = ({ data }) => {
    return (
      <div
        style={{
          width: "800px",
          padding: "40px",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontFamily: "Manrope, Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <div
              style={{
                width: "120px",
                height: "40px",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              LOGO
            </div>

            <h1 style={{ fontSize: "28px", margin: 0 }}>INVOICE</h1>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              <span style={{ fontSize: "16px", color: "#111827", fontWeight: 700 }}>Click Stopper</span>
            </p>
          </div>

          <div style={{ textAlign: "right", fontSize: "12px", color: "#374151" }}>
            <p><b>Invoice ID:</b> {data?.payment_id}</p>
            <p><b>Date:</b> {data?.start_date ? new Date(data.start_date).toLocaleDateString() : "N/A"}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color: data?.status === "Paid" ? "#16a34a" : "#d97706",
                  fontWeight: 600,
                }}
              >
                {(data?.status || "pending").toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "6px", color: "#111827" }}>Billed For</h3>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Subscription Plan: <b>{data?.plan_name || data?.Plan?.name || "N/A"}</b>
          </p>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Payment Method: {data?.method || "N/A"}
          </p>
        </div>

        <div style={{ marginBottom: "30px", fontSize: "13px", color: "#374151" }}>
          <p style={{ margin: 0 }}><b>Email:</b> billing@clickstopper.com</p>
          <p style={{ margin: 0 }}>
            <b>Phone:</b>{" "}
            <a href="tel:+13214188331" style={{ color: "#111827", textDecoration: "none" }}>
              +1 321-418-8331
            </a>
          </p>
          <p style={{ margin: 0 }}>
            <b>Address:</b> 5600 Tribune Way, Plano, TX 75094-4502, US
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={th}>Description</th>
              <th style={th}>Period</th>
              <th style={{ ...th, textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>{data?.Plan?.name || data?.plan_name || "Plan"} Subscription</td>
              <td style={td}>
                {data?.start_date ? new Date(data.start_date).toLocaleDateString() : "N/A"} -{" "}
                {data?.end_date ? new Date(data.end_date).toLocaleDateString() : "N/A"}
              </td>
              <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>${data?.amount || data?.Plan?.price || "0"}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <div style={{ width: "250px" }}>
            <div style={totalRow}>
              <span>Subtotal</span>
              <span>${data?.amount || data?.Plan?.price || "0"}</span>
            </div>
            <div style={totalRow}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div style={{ ...totalRow, fontWeight: 700, fontSize: "16px" }}>
              <span>Total</span>
              <span>${data?.amount || data?.Plan?.price || "0"}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "30px",
            paddingTop: "10px",
            borderTop: "1px dashed #e5e7eb",
            fontSize: "12px",
            color: "#4b5563",
          }}
        >
          <p style={{ marginBottom: "6px" }}>
            This invoice reflects the successful processing of your subscription payment.
          </p>
          <p style={{ marginBottom: "6px" }}>
            If you have any questions, please contact our billing team at <b>billing@clickstopper.com</b>.
          </p>
          <p style={{ fontStyle: "italic" }}>Thank you for your confidence in our work.</p>
        </div>

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            fontSize: "11px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          This is a system generated invoice. No signature required.
          <br />
          (c) {new Date().getFullYear()} Click Stopper. All rights reserved.
        </div>
      </div>
    );
  };

  const th = {
    padding: "12px",
    fontSize: "12px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  };

  const td = {
    padding: "12px",
    fontSize: "13px",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
  };

  const totalRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  };

  const handleAction = async (actionType) => {
    if (!details) return;

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-10000px";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<InvoiceTemplate data={details} />);

    setTimeout(async () => {
      if (actionType === "download") {
        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${details.payment_id || "subscription"}.pdf`);
      } else if (actionType === "print" || actionType === "view") {
        const win = window.open("", "_blank");
        win.document.write(`
          <html>
            <head><title>Invoice - ${details.payment_id || "subscription"}</title></head>
            <body>${container.innerHTML}</body>
          </html>
        `);
        win.document.close();
        if (actionType === "print") {
          win.focus();
          win.print();
        }
      }

      root.unmount();
      document.body.removeChild(container);
    }, 500);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6">
        <h2 className="text-[22px] font-extrabold text-[#141824] mb-4">Plan Status Summary</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Plan State" value={details?.isActive ? "Active" : "Inactive"} />
            <TableRow label="Activation Date" value={details?.startDate?.split("T")[0] || "Not Available"} />
            <TableRow label="Recent Billing Date" value={details?.endDate?.split("T")[0] || "Not Available"} />
            <TableRow label="Upcoming Billing Date" value={details?.endDate?.split("T")[0] || "Not Available"} />
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6 space-y-4">
        <h2 className="text-[22px] font-extrabold text-[#141824]">Plan Billing Details</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Cycle Type" value={details?.Plan?.name?.split(" ")[1] || "Not Available"} />
            <TableRow label="Selected Plan" value={details?.Plan?.name || "Not Available"} />
            <TableRow label="Payable Total" value={details?.Plan?.price ? `$${details.Plan.price}` : "Not Available"} />
          </tbody>
        </table>

        <div className="pt-2 flex flex-wrap gap-2">
          <ActionButton title="Open Invoice" onClick={() => handleAction("view")} variant="secondary" />
          <ActionButton title="Print Invoice Copy" onClick={() => handleAction("print")} variant="secondary" />
          <ActionButton title="Download Invoice PDF" onClick={() => handleAction("download")} />
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ label, value }) => (
  <tr className="border-b border-[#E7EBF3]">
    <td className="p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">{label}</td>
    <td className="p-3 text-[13px] font-semibold text-[#1e293b]">{value}</td>
  </tr>
);

const ActionButton = ({ title, onClick, variant = "primary" }) => (
  <button
    onClick={onClick}
    className={
      variant === "secondary"
        ? "bg-white border border-[#d5d9e4] px-4 py-2 text-[13px] rounded-md hover:bg-[#f8fafc] cursor-pointer font-semibold text-[#475569]"
        : "bg-[#3c79ff] text-white px-4 py-2 text-[13px] rounded-md hover:bg-[#356ee6] cursor-pointer font-semibold"
    }
  >
    {title}
  </button>
);
