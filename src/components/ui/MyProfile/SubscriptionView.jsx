import React from "react";

export const SubscriptionView = () => {
  const subscription = {
    status: "Active",
    startDate: "August 15, 2024",
    lastOrderDate: "August 15, 2025",
    nextPaymentDate: "August 16, 2026",
    paymentType: "Via Manual Renewal",
  };

  const orders = [
    {
      id: "#15056",
      date: "August 15, 2025",
      status: "Completed",
      total: "149.00$ For 1 Item",
    },
    {
      id: "#13343",
      date: "August 15, 2024",
      status: "Completed",
      total: "₹12,496.78 For 1 Item",
    },
  ];

  return (
    <div className="text-white space-y-10">

      {/* SUBSCRIPTION DETAILS TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Status" value={subscription.status} />
            <TableRow label="Start Date" value={subscription.startDate} />
            <TableRow label="Last Order Date" value={subscription.lastOrderDate} />
            <TableRow label="Next Payment Date" value={subscription.nextPaymentDate} />
            <TableRow label="Payment" value={subscription.paymentType} />
          </tbody>
        </table>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-6">
          <ActionButton title="Cancel" />
          <ActionButton title="Add Payment" />
          <ActionButton title="Renew Now" />
        </div>
      </div>

      {/* SUBSCRIPTION TOTALS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Subscription totals</h2>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="p-3">PRODUCT</th>
              <th className="p-3">TOTAL</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-slate-700">
              <td className="p-3">Premium Plan - MS × 1</td>
              <td className="p-3 text-purple-400">₹149.00 / Year</td>
            </tr>
            <tr className="border-b border-slate-700">
              <td className="p-3 font-semibold">SUBTOTAL:</td>
              <td className="p-3 text-purple-400">₹149.00</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">TOTAL:</td>
              <td className="p-3 text-purple-400">₹149.00 / Year</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RELATED ORDERS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
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
            {orders.map((o, i) => (
              <tr key={i} className="border-b border-slate-700">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.date}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-purple-400">{o.total}</td>
                <td className="p-3 flex gap-2">
                  <ActionButton title="View 👁" />
                  <ActionButton title="Print Invoice" />
                  <ActionButton title="Download Invoice" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
const ActionButton = ({ title }) => (
  <button className="bg-orange-600 px-4 py-1 text-sm rounded hover:bg-orange-700 cursor-pointer">
    {title}
  </button>
);
