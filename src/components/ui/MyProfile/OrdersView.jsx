import React, { useEffect, useState } from "react";

export const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://your-api-url.com/orders");
        const data = await res.json();

        setOrders(data.orders || []);
        setLoading(false);
      } catch (err) {
        setError("No orders yet");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6">
      <h2 className="text-[22px] font-extrabold text-[#141824] mb-4">Order History</h2>

      {loading && <p className="text-slate-500">Fetching your orders...</p>}
      {error && <p className="text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-700 border-b border-[#d5d9e4]">
                <th className="text-left p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">ORDER ID</th>
                <th className="text-left p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">ORDER DATE</th>
                <th className="text-left p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">CURRENT STATUS</th>
                <th className="text-left p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">TOTAL AMOUNT</th>
                <th className="text-left p-3 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">QUICK ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-slate-500">
                    No order records found
                  </td>
                </tr>
              )}

              {orders.map((o, i) => (
                <tr key={i} className="border-b border-[#E7EBF3] hover:bg-[#F8FAFC] transition">
                  <td className="p-3 text-[#3874ff] font-semibold">{o.id}</td>
                  <td className="p-3 text-slate-700">{o.date}</td>
                  <td className="p-3 text-slate-700">{o.status}</td>
                  <td className="p-3 font-semibold text-slate-900">{o.total}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-white border border-[#d5d9e4] px-3 py-1.5 text-[12px] rounded-md hover:bg-[#f8fafc] cursor-pointer font-semibold text-[#475569]">
                        Open
                      </button>
                      <button className="bg-white border border-[#d5d9e4] px-3 py-1.5 text-[12px] rounded-md hover:bg-[#f8fafc] cursor-pointer font-semibold text-[#475569]">
                        Print Bill
                      </button>
                      <button className="bg-[#3c79ff] text-white px-3 py-1.5 text-[12px] rounded-md hover:bg-[#356ee6] cursor-pointer font-semibold">
                        Download Bill
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
