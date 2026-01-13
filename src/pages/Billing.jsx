import React, { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { showErrorToast } from "../components/toast/toast";
import { cryptoPayment } from "../api/Apis";

// Grid layout with fixed proportions to handle large data
const gridLayout = "grid grid-cols-[1.5fr_1fr_1fr_2fr_1fr_1.2fr_1.2fr_0.8fr] gap-4 items-center";

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

  useEffect(() => {
    const controller = new AbortController();
    fetchBillingData(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div style={{ fontFamily: "Outfit, sans-serif" }} className="min-h-screen bg-[#0b0d14] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Billing</h1>
          <p className="text-sm text-gray-400 mt-2">View your subscriptions and payment history</p>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-[#111827] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              
              {/* TABLE HEADER */}
              <div className={`${gridLayout} px-6 py-4 bg-[#1e293b] text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-700`}>
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
                  <div className="px-6 py-12 text-center text-gray-500">Loading records...</div>
                ) : billingList.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500 italic">No billing history found</div>
                ) : (
                  billingList.map((item, index) => (
                    <div key={item.id || index} className={`${gridLayout} px-6 py-4 text-sm text-gray-300 hover:bg-[#1e293b]/50 transition-colors group`}>
                      
                      {/* Plan - N/A Check */}
                      <div className="font-semibold text-white truncate" title={item.plan_name || "N/A"}>
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
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border
                          ${item.status === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                            item.status === "failed" ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                            "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                          {item.status || "N/A"}
                        </span>
                      </div>

                      {/* Dates - N/A Check */}
                      <div className="text-gray-400">{item.start_date ? new Date(item.start_date).toLocaleDateString("en-IN") : "N/A"}</div>
                      <div className="text-gray-400">{item.end_date ? new Date(item.end_date).toLocaleDateString("en-IN") : "N/A"}</div>

                      {/* Action - Invoice Download Icon */}
                      <div className="flex justify-center">
                        {item.invoice_url ? (
                          <button
                            onClick={() => window.open(item.invoice_url, "_blank")}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all group/btn"
                            title="Download Invoice"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </button>
                        ) : (
                          <span className="text-gray-700 text-xs font-bold italic">N/A</span>
                        )}
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