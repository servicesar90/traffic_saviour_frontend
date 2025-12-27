import React,{useState} from "react";
import PropTypes from "prop-types";
import { apiFunction } from "../api/ApiFunction";
import { blacklistIpApi } from "../api/Apis";
import { showSuccessToast, showErrorToast } from "../components/toast/toast";

const BlacklistedIPsPage = ({
  ips = [],
  totalItems,
  currentPage,
  itemsPerPage,
  onViewAll,
  onPrevious,
  onNext,
  onAddIp,
  onRefresh,
}) => {
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a8 8 0 1111.31 6.9l1.39 1.39a1 1 0 01-1.42 1.42l-2.83-2.83A1 1 0 0113 9h3a6 6 0 10-6 6v-2a1 1 0 012 0v3a1 1 0 01-1 1H8a8 8 0 01-4-13z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Reusable Button
  const Button = ({ children, variant, icon: Icon, onClick }) => {
    let classes =
      "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    if (variant === "primary") {
      classes += " bg-blue-600 hover:bg-blue-700 text-white shadow-md";
    } else if (variant === "secondary") {
      classes += " bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600";
    } else if (variant === "pagination") {
      classes += " bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
    }

    return (
      <button className={classes} onClick={onClick}>
        {Icon && <Icon />}
        {children}
      </button>
    );
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [openIpModal, setOpenIpModal] = useState(false);
const [ipList, setIpList] = useState("");
const [ipAddress, setIpAddress] = useState("");



;




const addBlacklistedIps = async (ipAddress) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const data = {
      userId: userId,
      IPAddress: ipAddress, // ⚠️ backend field name
    };

    const response = await apiFunction(
      "post",
      blacklistIpApi,
      null,
      data
    );

    console.log("IP added successfully:", response.data);
  } catch (error) {
    console.error(
      "Error adding IP:",
      error.response?.data || error.message
    );
  }
};


const handleAddIp = () => {
  if (!ipAddress) {
    alert("Please enter IP address");
    return;
  }

  addBlacklistedIps(ipAddress);
};




  return (
    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 400 }} className="min-h-screen bg-[#0b0d14] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Blacklisted IPs</h1>
            <p className="text-sm text-gray-400 mt-2">
              Manage, add or remove blacklisted IP addresses with ease
            </p>
          </div>

          <div className="flex space-x-3">
          <button
             onClick={() => setOpenIpModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-sm shadow-lg transition duration-150 cursor-pointer"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Ip
          </button>
          <button
           
            className="flex items-center cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium text-sm shadow-lg transition duration-150"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
        </div>

        {/* Table */}
        <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#2B3B58] text-gray-300 text-xs font-semibold uppercase tracking-wider">
            <div>SN</div>
            <div>IP Address</div>
            <div>Added On</div>
            <div>Actions</div>
          </div>

          {ips.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-sm border-t border-gray-700">
              No IP addresses found.
            </div>
          ) : (
            ips.map((ip, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 px-6 py-3 text-sm text-gray-200 border-t border-gray-700 hover:bg-[#25344E] transition-colors"
              >
                <div>{ip.sn}</div>
                <div>{ip.ip}</div>
                <div>{ip.addedOn}</div>
                <div>{ip.actions || "-"}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-400 gap-4">
          <span>
            {startItem}–{endItem} of {totalItems} items —{" "}
            <button onClick={onViewAll} className="text-blue-500 hover:underline">
              View all
            </button>
          </span>

          <div className="flex gap-2">
            <Button variant="pagination" onClick={onPrevious}>
              Previous
            </Button>
            <Button variant="pagination" onClick={onNext}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {openIpModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

    {/* Modal Box */}
    <div className="w-full max-w-xl bg-[#0f172a] text-gray-200 rounded-xl shadow-2xl border border-gray-700">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 text-lg font-semibold">
        Add IP
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <textarea 
          value={text}
          onChange={(e) => setIpList(e.target.value)}
          placeholder=""
          rows={6}
          className="w-full bg-[#020617] border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />

        <p className="text-sm text-gray-400 mt-3">
          Enter one IP per line. Examples:
        </p>

        <div className="text-sm text-gray-500 mt-1 space-y-1">
          <div>240.4.91.158</div>
          <div>115546</div>
          <div>6b5d:4417:cee5:9676:6926:b272:d8ae:f9e6</div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">

        <button
          onClick={() => setOpenIpModal(false)}
          className="px-4 py-2 cursor-pointer border border-red-500 text-red-400 rounded-md hover:bg-red-500/10 transition"
        >
          ✕ Cancel
        </button>

        <button
          onClick={() => {
            console.log(ipList);
            setOpenIpModal(false);
            addBlacklistedIps(ipAddress)
          }}
          className="px-4 py-2 cursor-pointer  bg-blue-600 hover:bg-blue-700 rounded-md text-white transition flex items-center gap-1"
        >
          + Add
        </button>

      </div>
    </div>
  </div>
)}

    </div>
  );
};



export default BlacklistedIPsPage;
