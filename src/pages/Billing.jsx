import React, { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { showErrorToast } from "../components/toast/toast";
import { cryptoPayment } from "../api/Apis";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";


// Grid layout with fixed proportions to handle large data
const gridLayout =
  "grid grid-cols-[1.5fr_1fr_1fr_2fr_1fr_1.2fr_1.2fr_0.8fr] gap-4 items-center";

 


const BillingPage = () => {
  const [billingList, setBillingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBillingData = async (signal) => {
    try {
      setLoading(true);
      const res = await apiFunction("get", cryptoPayment, null, null, signal);
      setBillingList(res?.data?.data || []);
    } catch (error) {
      if (error.name !== "AbortError") {
        showErrorToast("Failed to fetch billing data");
      }
    } finally {
      setLoading(false);
    }
  };

 const InvoiceTemplate = ({ item }) => (
  <div
    style={{
      width: "800px",
      padding: "40px",
      background: "#ffffff",
      color: "#000",
      fontFamily: "Outfit",
    }}
  >
    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>INVOICE</h1>

    <p><b>Plan:</b> {item.plan_name}</p>
    <p><b>Payment ID:</b> {item.payment_id}</p>
    <p><b>Method:</b> {item.method}</p>
    <p><b>Amount:</b> ${item.amount}</p>
    <p><b>Invoice Date:</b> {new Date(item.start_date).toLocaleDateString()}</p>

    <hr style={{ margin: "20px 0" }} />

    <p style={{ fontSize: "12px", color: "#666" }}>
      This is a system generated invoice.
    </p>
  </div>
);

const handleDownloadInvoice = async (item) => {
  const container = document.createElement("div");

  // off-screen render
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "-10000px";

  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<InvoiceTemplate item={item} />);

  setTimeout(async () => {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${item.payment_id}.pdf`);

    root.unmount();
    document.body.removeChild(container);
  }, 300);
};




  useEffect(() => {
    const controller = new AbortController();
    fetchBillingData(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div
      style={{ fontFamily: "Outfit, sans-serif" }}
      className="min-h-screen bg-[#0b0d14] text-gray-100 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Billing
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            View your subscriptions and payment history
          </p>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-[#111827] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* TABLE HEADER */}
              <div
                className={`${gridLayout} px-6 py-4 bg-[#1e293b] text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-700`}
              >
                <div>Plan Name</div>
                <div>Method</div>
                <div>Amount</div>
                <div>Payment ID</div>
                <div>Status</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div className="text-center">Invoice</div>
              </div>

              {/* TABLE BODY */}
              <div className="max-h-[550px] overflow-y-auto divide-y divide-gray-800 custom-scrollbar">
                {loading ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    Loading records...
                  </div>
                ) : billingList.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500 italic">
                    No billing history found
                  </div>
                ) : (
                  billingList.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`${gridLayout} px-6 py-4 text-sm text-gray-300 hover:bg-[#1e293b]/50 transition-colors group`}
                    >
                      {/* Plan - N/A Check */}
                      <div
                        className="font-semibold text-white truncate"
                        title={item.plan_name || "N/A"}
                      >
                        {item.plan_name || "N/A"}
                      </div>

                      {/* Method - N/A Check */}
                      <div className="text-gray-400">
                        {item.method || "N/A"}
                      </div>

                      {/* Amount - N/A Check */}
                      <div className="font-mono font-bold text-emerald-400">
                        {item.amount ? `$${item.amount}` : "N/A"}
                      </div>

                      {/* Payment ID - Truncation with Hover Tooltip */}
                      <div className="relative group/id max-w-[180px]">
                        <div
                          className="font-mono text-xs text-gray-500 truncate cursor-help hover:text-blue-400 transition-colors"
                          title={item.payment_id || "N/A"}
                        >
                          {item.payment_id || "N/A"}
                        </div>

                        {/* Tooltip Fix: Using top-full to show it below the row, avoiding header collision */}
                        {item.payment_id && (
                          <div className="absolute top-full left-0 mt-2 hidden group-hover/id:block bg-gray-900 text-white text-[10px] p-3 rounded-lg shadow-2xl border border-gray-700 z-[100] break-all w-64 backdrop-blur-md">
                            <p className="text-gray-400 mb-1 border-b border-gray-700 pb-1 uppercase text-[9px] font-bold tracking-widest">
                              Full Payment ID
                            </p>
                            {item.payment_id}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border
                          ${
                            item.status === "success"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : item.status === "failed"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </div>

                      {/* Dates - N/A Check */}
                      <div className="text-gray-400">
                        {item.start_date
                          ? new Date(item.start_date).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </div>
                      <div className="text-gray-400">
                        {item.end_date
                          ? new Date(item.end_date).toLocaleDateString("en-IN")
                          : "N/A"}
                      </div>

                      {/* Action - Invoice Download Icon */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDownloadInvoice(item)}
                          className="p-2 rounded-lg cursor-pointer bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all"
                          title="Download Invoice"
                        >
                         <Download size={18}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600 text-[10px] tracking-widest uppercase font-bold opacity-50">
          Secure Billing Dashboard • Powered by CryptoPay
        </p>
      </div>
    </div>
  );
};

export default BillingPage;
