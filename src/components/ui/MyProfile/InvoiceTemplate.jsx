import React from "react";

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

const getInvoiceData = (item = {}) => ({
  paymentId: item.payment_id || item.id || "N/A",
  planName: item.plan_name || item.Plan?.name || "Plan",
  amount: item.amount ?? item.Plan?.price ?? "0",
  method:
    item.method ||
    item.payment_method ||
    item.paymentMethod ||
    item.payment?.method ||
    item.Payment?.method ||
    item.transaction?.method ||
    item.gateway ||
    item.provider ||
    "N/A",
  status: item.status || (item.isActive ? "Active" : "Pending"),
  startDate: item.start_date || item.startDate,
  endDate: item.end_date || item.endDate,
});

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

export const InvoiceTemplate = ({ item, user = {} }) => {
  const invoice = getInvoiceData(item);
  const statusColor =
    invoice.status === "Paid" || invoice.status === "Active"
      ? "#16a34a"
      : invoice.status === "Rejected"
        ? "#dc2626"
        : "#d97706";

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
          <img
            src="/logo-1.png"
            alt="TrafficSaviour logo"
            style={{ width: "100px", height: "auto", objectFit: "contain" }}
          />
          <h2 style={{ fontSize: "25px", margin: "4px 0 0", color: "#a855f7" }}>
            TrafficSaviour
          </h2>
        </div>

        <div style={{ textAlign: "right", fontSize: "12px", color: "#374151" }}>
          <h1 style={{ fontSize: "28px", margin: 0 }}>INVOICE</h1>
          <p><b>Invoice ID:</b> {invoice.paymentId}</p>
          <p><b>Date:</b> {formatDate(invoice.startDate)}</p>
          <p>
            <b>Status:</b>{" "}
            <span style={{ color: statusColor, fontWeight: 600 }}>
              {String(invoice.status).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "14px", marginBottom: "6px", color: "#111827" }}>Billed For</h3>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
          <b>Name:</b> {user?.name || "N/A"}
        </p>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
          <b>Email:</b> {user?.email || "N/A"}
        </p>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
          Subscription Plan: <b>{invoice.planName}</b>
        </p>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
          Payment Method: {invoice.method}
        </p>
      </div>

      <div style={{ marginBottom: "30px", fontSize: "13px", color: "#374151" }}>
        <p style={{ margin: 0 }}><b>Email:</b> billing@trafficsaviour.com</p>
        <p style={{ margin: 0 }}><b>Phone:</b> +1 321-418-8331</p>
        <p style={{ margin: 0 }}>
          <b>Address:</b> 5600 Tribune Way, Plano, TX 75094-4502, US
        </p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={th}>Description</th>
            <th style={th}>Period</th>
            <th style={{ ...th, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>{invoice.planName} Subscription</td>
            <td style={td}>{formatDate(invoice.startDate)} - {formatDate(invoice.endDate)}</td>
            <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>${invoice.amount}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <div style={{ width: "250px" }}>
          <div style={totalRow}><span>Subtotal</span><span>${invoice.amount}</span></div>
          <div style={totalRow}><span>Tax</span><span>$0.00</span></div>
          <div style={{ ...totalRow, fontWeight: 700, fontSize: "16px" }}>
            <span>Total</span><span>${invoice.amount}</span>
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
          If you have any questions, contact our billing team at <b>billing@trafficsaviour.com</b>.
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
        This is a system generated invoice. No signature required.<br />
        © {new Date().getFullYear()} TrafficSaviour. All rights reserved.
      </div>
    </div>
  );
};
