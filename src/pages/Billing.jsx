import React, { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { showErrorToast } from "../components/toast/toast";
import { cryptoPayment } from "../api/Apis";

const billingApi = "/billing"; // 👈 apna actual API path yahan daalna

const BillingPage = () => {
  const [billingList, setBillingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));
    //   const userId = userData?.id;

    //   if (!userId) {
    //     showErrorToast("User not logged in");
    //     return;
    //   }

      const res = await apiFunction(
        "get",
        cryptoPayment,
        null,
        null
      );
      console.log(res);
      

      setBillingList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return (
    <div
      style={{ fontFamily: "Outfit, sans-serif" }}
      className="min-h-screen bg-[#0b0d14] text-gray-100 p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Billing
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            View your subscriptions, payments and invoices
          </p>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[200px_140px_120px_220px_120px_160px_160px_120px]
                          gap-4 px-6 py-4 bg-[#2B3B58]
                          text-gray-300 text-xs font-semibold uppercase tracking-wider">
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
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">

            {loading && (
              <div className="px-6 py-6 text-center text-gray-400">
                Loading billing records...
              </div>
            )}

            {!loading && billingList.length === 0 && (
              <div className="px-6 py-6 text-center text-gray-400">
                No billing history found
              </div>
            )}

            {!loading &&
              billingList.map((item, index) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-[200px_140px_120px_220px_120px_160px_160px_120px]
                              gap-4 px-6 py-3 text-sm text-gray-200
                              border-t border-gray-700 hover:bg-[#25344E] transition"
                >
                  {/* Plan Name */}
                  <div className="font-medium truncate" title={item.plan_name}>
                    {item.plan_name}
                  </div>

                  {/* Method */}
                  <div>{item.method}</div>

                  {/* Amount */}
                  <div className="font-mono">
                    ${item.amount}
                  </div>

                  {/* Payment ID */}
                  <div
                    className="font-mono truncate"
                    title={item.payment_id}
                  >
                    {item.payment_id}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold
                        ${
                          item.status === "success"
                            ? "bg-green-500/20 text-green-400"
                            : item.status === "failed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Start Date */}
                  <div>
                    {item.start_date
                      ? new Date(item.start_date).toLocaleDateString("en-IN")
                      : "-"}
                  </div>

                  {/* End Date */}
                  <div>
                    {item.end_date
                      ? new Date(item.end_date).toLocaleDateString("en-IN")
                      : "-"}
                  </div>

                  {/* Invoice */}
                  <div className="flex justify-center">
                    {item.invoice_url ? (
                      <button
                        onClick={() =>
                          window.open(item.invoice_url, "_blank")
                        }
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700
                                   text-white text-xs rounded-md transition"
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
