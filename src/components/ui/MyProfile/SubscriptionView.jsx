import React,{useState, useEffect} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

export const SubscriptionView = () => {
  

   

  const [details, setDetails] = useState(null); 

  
  
    // Load user AFTER component mounts
    useEffect(() => {
      const stored = localStorage.getItem("plan");
      if (stored) {
        setDetails(JSON.parse(stored)); 
      }
    }, []);

    

    const InvoiceTemplate = ({data}) => {
    return (
      <div
        style={{
          width: "800px",
          padding: "40px",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontFamily: "Outfit, Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            {/* LOGO PLACEHOLDER */}
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
            <h3 style={{ fontSize: "16px", margin: 0 }}>Click Stopper</h3>
            </p>
          </div>
  
          <div style={{ textAlign: "right", fontSize: "12px", color: "#374151" }}>
            <p><b>Invoice ID:</b> {data?.payment_id}</p>
            <p><b>Date:</b> {new Date(data?.start_date).toLocaleDateString()}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    data?.status === "Paid"
                      ? "#16a34a"
                      : item.status === "Rejected"
                      ? "#dc2626"
                      : "#d97706",
                  fontWeight: 600,
                }}
              >
                {data?.status?.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
  
        {/* BILL TO */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "6px", color: "#111827" }}>
            Billed For
          </h3>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Subscription Plan: <b>{data?.plan_name || "N/A"}</b>
          </p>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Payment Method: {data?.method || "N/A"}
          </p>
        </div>
  
        {/* COMPANY DETAILS */}
        <div style={{ marginBottom: "30px", fontSize: "13px", color: "#374151" }}>
          <p style={{ margin: 0 }}><b>Email:</b> billing@clickstopper.com</p>
          <p style={{ margin: 0 }}>
    <b>Phone:</b>{" "}
    <a
      href="tel:+13214188331"
      style={{ color: "#111827", textDecoration: "none" }}
    >
      +1 321-418-8331
    </a>
  </p>
          <p style={{ margin: 0 }}>
            <b>Address:</b> 5600 Tribune Way, Plano, TX 75094-4502, US
          </p>
        </div>
  
        {/* TABLE */}
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
              <td style={td}>{data?.plan_name} Subscription</td>
              <td style={td}>
                {data?.start_date
                  ? new Date(data?.start_date).toLocaleDateString()
                  : "N/A"}{" "}
                –{" "}
                {data?.end_date
                  ? new Date(data?.end_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>
                ${data?.amount}
              </td>
            </tr>
          </tbody>
        </table>
  
        {/* TOTAL */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <div style={{ width: "250px" }}>
            <div style={totalRow}>
              <span>Subtotal</span>
              <span>${data?.amount}</span>
            </div>
            <div style={totalRow}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div style={{ ...totalRow, fontWeight: 700, fontSize: "16px" }}>
              <span>Total</span>
              <span>${data?.amount}</span>
            </div>
          </div>
        </div>
  
        {/* EXTRA / LEGAL CONTENT BELOW TOTAL */}
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
            All amounts are in USD. Please make the payment within 15 days from the
            issue date of this invoice.
          </p>
  
          <p style={{ marginBottom: "6px" }}>
            Tax is not charged on this bill as per paragraph 1 of Article 9 of the
            Value Added Tax Act.
          </p>
  
          <p style={{ marginBottom: "6px" }}>
            If you have any questions regarding this invoice or your subscription,
            please contact our billing team at <b>billing@clickstopper.com</b>.
          </p>
  
          <p style={{ fontStyle: "italic" }}>
            Thank you for your confidence in my work.
          </p>
        </div>
  
        {/* FOOTER */}
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
          © {new Date().getFullYear()} Click Stopper. All rights reserved.
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

    // 1. Create hidden container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-10000px";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<InvoiceTemplate data={details} />);

    // Wait for render
    setTimeout(async () => {
      if (actionType === "download") {
        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${details.payment_id}.pdf`);
      } 
      else if (actionType === "print" || actionType === "view") {
        const win = window.open("", "_blank");
        win.document.write(`
          <html>
            <head><title>Invoice - ${details.payment_id}</title></head>
            <body>${container.innerHTML}</body>
          </html>
        `);
        win.document.close();
        if (actionType === "print") {
          win.focus();
          win.print();
        }
      }

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    }, 500);
  };

  

  return (
    <div className="text-white space-y-10">

      {/* SUBSCRIPTION DETAILS TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Status" value={details?.isActive ? "Active" : "Inactive"} />
            <TableRow label="Start Date" value={details?.startDate?.split("T")[0] || "Not Available"} />
            <TableRow label="Last Order Date" value={details?.endDate?.split("T")[0] || "Not Available"} />
            <TableRow label="Next Payment Date" value={details?.endDate?.split("T")[0] || "Not Available"} />
            {/* <TableRow label="Payment Method" value={details?.method || "Not Available"} /> */}
          </tbody>
        </table>

        {/* ACTION BUTTONS */}
        {/* <div className="flex gap-4 mt-6">
          <ActionButton title="Cancel" />
          <ActionButton title="Add Payment" />
          <ActionButton title="Renew Now" />
        </div> */}
      </div>

      {/* SUBSCRIPTION TOTALS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Subscription Details</h2>

        <table className="w-full border-collapse text-sm">
         <tbody>
            <TableRow label="Billing Cycle" value={details?.Plan?.name.split(" ")[1] ||"Not Available" } />
            {/* <TableRow label="Currency" value={details?.currency || "Not Available"} /> */}
            <TableRow label="Plan Name" value={details?.Plan?.name || "Not Available"} />
            <TableRow label="Total" value={details?.Plan?.price || "Not Available"} />

            
          </tbody>
        </table>
      </div>

      {/* RELATED ORDERS */}
      {/* <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Related orders</h2>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-700 text-left border-b border-slate-600">
              <th className="p-3">ORDER</th>
              <th className="p-3">DATE</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">TOTAL</th>
              <th className="p-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
           
              <tr  className="border-b border-slate-700">
                <td className="p-3">{details?.payment_id ||"N/A"}</td>
                <td className="p-3">{details?.start_date ||"N/A"}</td>
                <td className="p-3">{details?.status || "N/A"}</td>
                <td className="p-3 text-purple-400">{details?.amount || "Not Available"}{details?.currency}</td>
                <td className="p-3 flex gap-2">
                  <ActionButton title="View 👁" onClick={() => handleAction("view")} />
                  <ActionButton title="Print Invoice" onClick={() => handleAction("print")} />
                  <ActionButton title="Download Invoice" onClick={() => handleAction("download")} />
                </td>
              </tr>
            
          </tbody>
        </table>
      </div> */}

    </div>
  );
};

// Small reusable row component
const TableRow = ({ label, value }) => (
  <tr className="border-b border-slate-700">
    <td className="p-3 font-medium">{label}</td>
    <td className="p-3">{value}</td>
  </tr>
);

// Button Component
const ActionButton = ({ title, onClick }) => (
  <button onClick={onClick}
  className="bg-orange-600 px-4 py-1 text-sm rounded hover:bg-orange-700 cursor-pointer">

    {title}
  </button>
);
