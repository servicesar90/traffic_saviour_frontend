import React, { useEffect, useState } from "react";
import { FaCopy, FaFileInvoiceDollar } from "react-icons/fa";
import { apiFunction } from "../../../api/ApiFunction";
import { cryptoPayment } from "../../../api/Apis";
import { showErrorToast, showSuccessToast } from "../../toast/toast";
import { runInvoiceAction } from "./invoiceActions";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "N/A";

export const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user] = useState(getStoredUser);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiFunction(
          "get",
          cryptoPayment,
          null,
          null,
          controller.signal
        );
        setOrders(res?.data?.data || []);
      } catch (requestError) {
        if (requestError?.code !== "ERR_CANCELED") {
          setError(
            requestError?.response?.data?.message ||
              "Unable to load transaction history."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, []);

  const downloadInvoice = async (order) => {
    try {
      await runInvoiceAction({ action: "download", item: order, user });
    } catch (invoiceError) {
      showErrorToast(invoiceError?.message || "Unable to download the invoice.");
    }
  };

  const copyPaymentId = async (paymentId) => {
    try {
      await navigator.clipboard.writeText(paymentId);
      showSuccessToast("Payment ID copied to clipboard.");
    } catch {
      showErrorToast("Unable to copy the Payment ID.");
    }
  };

  return (
    <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6">
      <div className="mb-4 text-left">
        <h2 className="text-[22px] font-extrabold text-[#141824]">Order History</h2>
        <p className="text-[12px] text-[#64748b] mt-1">
          All subscription transactions linked to your account.
        </p>
      </div>

      {loading && <p className="text-slate-500 py-6">Fetching your transactions...</p>}
      {error && <p className="text-rose-600 py-6">{error}</p>}

      {!loading && !error && (
        <div className="rounded-md border border-[#e5eaf3] overflow-hidden">
          <div className="max-h-[368px] overflow-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-[#f8fafc]">
              <tr className="bg-[#f8fafc] border-b border-[#d5d9e4]">
                <HeaderCell>Transaction ID</HeaderCell>
                <HeaderCell>Plan</HeaderCell>
                <HeaderCell>Method</HeaderCell>
                <HeaderCell>Date</HeaderCell>
                <HeaderCell>Status</HeaderCell>
                <HeaderCell>Total</HeaderCell>
                <HeaderCell>Invoice</HeaderCell>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">
                    No transaction records found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id || order.payment_id || index}
                    className="h-16 border-b border-[#E7EBF3] last:border-b-0 hover:bg-[#F8FAFC] transition"
                  >
                    <td className="p-3 text-left">
                      <PaymentIdCell
                        paymentId={order.payment_id || order.id || "N/A"}
                        onCopy={copyPaymentId}
                      />
                    </td>
                    <td className="p-3 text-left text-slate-700 font-semibold">
                      {order.plan_name || order.Plan?.name || "N/A"}
                    </td>
                    <td className="p-3 text-left text-slate-700">{order.method || "N/A"}</td>
                    <td className="p-3 text-left text-slate-700">{formatDate(order.start_date || order.createdAt)}</td>
                    <td className="p-3 text-left">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-3 text-left font-semibold text-slate-900">
                      {order.amount != null ? `$${order.amount}` : "N/A"}
                    </td>
                    <td className="p-3 text-left">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex items-center gap-2 bg-[#3c79ff] text-white px-3 py-1.5 text-[12px] rounded-md hover:bg-[#356ee6] cursor-pointer font-semibold"
                      >
                        <FaFileInvoiceDollar /> Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderCell = ({ children }) => (
  <th className="text-left p-3 h-12 text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">
    {children}
  </th>
);

const PaymentIdCell = ({ paymentId, onCopy }) => (
  <div className="relative inline-flex max-w-[210px] items-center gap-1.5 group/payment-id">
    <span
      className="inline-block max-w-[160px] truncate font-mono text-xs font-semibold text-[#3874ff]"
      title={paymentId}
    >
      {paymentId}
    </span>
    {paymentId !== "N/A" && (
      <button
        type="button"
        onClick={() => onCopy(paymentId)}
        className="shrink-0 rounded p-1 text-[#64748b] hover:bg-[#eaf1ff] hover:text-[#3c79ff] cursor-pointer transition"
        aria-label="Copy Payment ID"
        title="Copy Payment ID"
      >
        <FaCopy size={11} />
      </button>
    )}
    <span className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden max-w-[320px] break-all rounded-md border border-[#d5d9e4] bg-white px-2.5 py-1.5 font-mono text-[11px] text-[#334155] shadow-lg group-hover/payment-id:block">
      {paymentId}
    </span>
  </div>
);

const StatusBadge = ({ status = "Pending" }) => {
  const colorClass =
    status === "Paid"
      ? "bg-[#ecfdf3] text-[#027a48] border-[#abefc6]"
      : status === "Rejected"
        ? "bg-[#fff1f3] text-[#be123c] border-[#fecdd3]"
        : "bg-[#fffbeb] text-[#b45309] border-[#fde68a]";

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${colorClass}`}>
      {status}
    </span>
  );
};
