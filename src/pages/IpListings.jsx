import React,{useState,useEffect, useRef} from "react";
import PropTypes from "prop-types";
import { apiFunction } from "../api/ApiFunction";
import { blacklistIpApi } from "../api/Apis";
import { showSuccessToast, showErrorToast } from "../components/toast/toast";

const BlacklistedIPsPage = ({

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
// ✅ ONLY ONCE
const [ips, setIps] = useState([]);
const [loadingIps, setLoadingIps] = useState(false);
const [isRefreshing, setIsRefreshing] = useState(false);
const abortRef = useRef(null);






const TrashIcon = ({ onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-500 hover:text-red-400 cursor-pointer"
    viewBox="0 0 20 20"
    fill="currentColor"
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
      clipRule="evenodd"
    />
  </svg>
);




const isValidIPv4 = (ip) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return ipv4Regex.test(ip);
};

const isValidIPv6 = (ip) => {
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
  return ipv6Regex.test(ip);
};

const isValidIP = (ip) => isValidIPv4(ip) || isValidIPv6(ip);




const addBlacklistedIps = async (rawText) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;

    if (!userId) {
      showErrorToast("User not logged in");
      return;
    }

    const ipArray = rawText
      .split("\n")
      .map(ip => ip.trim())
      .filter(ip => ip.length > 0);

    if (ipArray.length === 0) {
      showErrorToast("Please enter at least one IP");
      return;
    }

    // 🚫 STRICT VALIDATION
    const invalidIps = ipArray.filter(ip => !isValidIP(ip));

    if (invalidIps.length > 0) {
      showErrorToast(
        `Invalid IP(s): ${invalidIps.join(", ")}`
      );
      return; // ❌ STOP SUBMIT
    }

    // ✅ All IPs valid → proceed
    for (const ip of ipArray) {
      const payload = {
        userId,
        IPAddress: ip,
      };
      await apiFunction("post", blacklistIpApi, null, payload);
      await fetchBlacklistedIps();
    }


    showSuccessToast(`${ipArray.length} IP(s) added successfully`);
    setIpList("");
    setOpenIpModal(false);

  } catch (error) {
    // console.error(error);
    showErrorToast("Failed to add IP(s)");
  }
};


const fetchBlacklistedIps = async () => {
  if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
  try {
    setLoadingIps(true);

    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;

    if (!userId) {
      showErrorToast("User not logged in");
      return;
    }

    const res = await apiFunction(
  "get",
  `${blacklistIpApi}?userId=${userId}`,
  null,
  null, 
  controller.signal
);
if(!res) return;
 



    const rawData = res?.data || [];

    
  
    

    const formatted = rawData.map((item, index) => ({
      sn: index + 1,
      ip: item.IPAddress || "-",
      addedOn: item.createdAt
        ? new Date(item.createdAt).toLocaleString("en-IN")
        : "-",
      id: item.id,
    }));

    setIps(formatted);
  } catch (error) {
        if (error?.code === "ERR_CANCELED") return; 
    // console.error(error);
    showErrorToast("Failed to fetch IPs");
  } finally {
    setLoadingIps(false);
  }
};

const deleteBlacklistedIp = async (id) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this IP?"
    );

    if (!confirmDelete) return;

    await apiFunction(
      "delete",
      blacklistIpApi,
      id,
      null
    );

    showSuccessToast("IP deleted successfully");

    // 🔁 refresh list OR local remove
    setIps((prev) => prev.filter((ip) => ip.id !== id));
  } catch (error) {
    // console.error(error);
    showErrorToast("Failed to delete IP");
  }
};

const handleRefresh = async () => {
  if (isRefreshing) return;

  try {
    setIsRefreshing(true);
    await fetchBlacklistedIps();
  } finally {
    setTimeout(() => setIsRefreshing(false), 500); // smooth finish
  }
};




useEffect(() => {
  fetchBlacklistedIps();
   return () => {
    abortRef.current?.abort(); // 🧹 cleanup
  };
}, []);











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
  onClick={handleRefresh}
  disabled={isRefreshing}
  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm shadow-lg transition-all duration-200
    ${
      isRefreshing
        ? "bg-gray-600 cursor-not-allowed opacity-80"
        : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
    }
  `}
>
  <svg
    className={`h-5 w-5 transition-transform duration-300 ${
      isRefreshing ? "animate-spin" : ""
    }`}
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

  {isRefreshing ? "Refreshing..." : "Refresh"}
</button>

        </div>
        </div>

        {/* Table */}
       <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700">

  {/* Header */}
  <div className="grid grid-cols-[60px_minmax(0,1fr)_200px_100px] gap-4 px-6 py-4 bg-[#2B3B58] text-gray-300 text-xs font-semibold uppercase tracking-wider">
    <div>SN</div>
    <div>IP Address</div>
    <div>Added On</div>
    <div className="text-center">Actions</div>
  </div>

  {/* Body */}
  <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
     {loadingIps && (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg
        className="h-8 w-8 animate-spin mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9"
        />
      </svg>
      <p className="text-sm">Loading blacklisted IPs...</p>
    </div>
  )}

  {/* 📭 Empty State */}
  {!loadingIps && ips.length === 0 && (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <div className="text-4xl mb-3">📭</div>
      <p className="text-lg font-medium text-gray-300">
        No Blacklisted IPs Found
      </p>
      <p className="text-sm mt-1">
        You haven’t added any IP addresses yet.
      </p>

      <button
        onClick={() => setOpenIpModal(true)}
        className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm shadow cursor-pointer"
      >
        + Add Your First IP
      </button>
    </div>
  )}

  {/* ✅ Data State */}
  {!loadingIps &&
    ips.length > 0 &&
    ips.map((ip) => (
      <div
        key={ip.id}
        className="grid grid-cols-[60px_minmax(0,1fr)_200px_100px] gap-4 px-6 py-3 text-sm text-gray-200 border-t border-gray-700 hover:bg-[#25344E] transition-colors"
      >
        <div>{ip.sn}</div>

        <div
          className="font-mono truncate overflow-hidden whitespace-nowrap"
          title={ip.ip}
        >
          {ip.ip}
        </div>

        <div>{ip.addedOn}</div>

        <div className="flex justify-center items-center">
          <TrashIcon onClick={() => deleteBlacklistedIp(ip.id)} />
        </div>
      </div>
    ))}

    
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
  value={ipList}
  onChange={(e) => setIpList(e.target.value)}
  rows={6}
  className="w-full bg-[#020617] border border-gray-700 rounded-md p-3 text-sm text-gray-200"
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
  onClick={() => addBlacklistedIps(ipList)}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white cursor-pointer"
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
