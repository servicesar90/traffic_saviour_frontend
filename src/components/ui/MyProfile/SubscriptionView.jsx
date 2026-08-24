import React, { useEffect, useState } from "react";
import { apiFunction } from "../../../api/ApiFunction";
import { cryptoPayment } from "../../../api/Apis";
import { showErrorToast } from "../../toast/toast";
import { runInvoiceAction } from "./invoiceActions";

const parseStoredValue = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || fallback;
  } catch {
    return fallback;
  }
};

export const SubscriptionView = () => {
  const [details, setDetails] = useState(null);
  const [user, setUser] = useState({});
  const [latestTransaction, setLatestTransaction] = useState(null);

  useEffect(() => {
    setDetails(parseStoredValue("plan", null));
    setUser(parseStoredValue("user", {}));

    const controller = new AbortController();
    const fetchLatestTransaction = async () => {
      try {
        const response = await apiFunction(
          "get",
          cryptoPayment,
          null,
          null,
          controller.signal
        );
        const transactions = response?.data?.data || [];
        const latest = [...transactions].sort((a, b) => {
          const firstDate = new Date(a.start_date || a.createdAt || 0).getTime();
          const secondDate = new Date(b.start_date || b.createdAt || 0).getTime();
          return secondDate - firstDate;
        })[0];
        setLatestTransaction(latest || null);
      } catch (error) {
        if (error?.code !== "ERR_CANCELED") setLatestTransaction(null);
      }
    };

    fetchLatestTransaction();
    return () => controller.abort();
  }, []);

  const handleAction = async (action) => {
    if (!details) {
      showErrorToast("No plan details are available for this invoice.");
      return;
    }

    try {
      const invoiceDetails = {
        ...details,
        ...latestTransaction,
        Plan: details?.Plan || latestTransaction?.Plan,
      };
      await runInvoiceAction({ action, item: invoiceDetails, user });
    } catch (error) {
      showErrorToast(error?.message || "Unable to generate the invoice.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6">
        <h2 className="text-[22px] font-extrabold text-[#141824] mb-4">Plan Status Summary</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Plan State" value={details?.isActive ? "Active" : "Inactive"} />
            <TableRow
              label="Activation Date"
              value={(details?.start_date || details?.startDate)?.split("T")[0] || "Not Available"}
            />
            <TableRow
              label="Recent Billing Date"
              value={(details?.end_date || details?.endDate)?.split("T")[0] || "Not Available"}
            />
            <TableRow
              label="Upcoming Billing Date"
              value={(details?.end_date || details?.endDate)?.split("T")[0] || "Not Available"}
            />
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6 space-y-4">
        <h2 className="text-[22px] font-extrabold text-[#141824]">Plan Billing Details</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <TableRow label="Cycle Type" value={details?.Plan?.name?.split(" ")[1] || "Not Available"} />
            <TableRow label="Selected Plan" value={details?.Plan?.name || details?.plan_name || "Not Available"} />
            <TableRow
              label="Payable Total"
              value={details?.amount || details?.Plan?.price ? `$${details?.amount ?? details?.Plan?.price}` : "Not Available"}
            />
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
