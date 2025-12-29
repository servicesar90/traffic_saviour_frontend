import React, { useEffect, useState } from "react";

export const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://your-api-url.com/orders"); // CHANGE TO YOUR API
        const data = await res.json();

        setOrders(data.orders); // assume { orders: [...] }
        setLoading(false);
      } catch (err) {
        setError("No Orders yet");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Loading orders...</p>}

      {/* ERROR */}
      {error && <p className="text-red-400">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-700 text-sm text-white border-b border-slate-600">
                <th className="text-left p-3">ORDER</th>
                <th className="text-left p-3">DATE</th>
                <th className="text-left p-3">STATUS</th>
                <th className="text-left p-3">TOTAL</th>
                <th className="text-left p-3">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((o, i) => (
                <tr key={i} className="border-b border-slate-700">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.date}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3 text-purple-400">{o.total}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-orange-600 px-4 py-1 text-sm rounded hover:bg-orange-700 cursor-pointer">
                      VIEW 👁
                    </button>
                    <button className="bg-orange-600 px-4 py-1 text-sm rounded hover:bg-orange-700 cursor-pointer">
                      PRINT INVOICE
                    </button>
                    <button className="bg-orange-600 px-4 py-1 text-sm rounded hover:bg-orange-700 cursor-pointer">
                      DOWNLOAD INVOICE
                    </button>
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
