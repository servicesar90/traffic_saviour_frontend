

import React, { useEffect, useCallback, useState } from "react";

import { addUrlCampData, getAllCampaign,getAllAnalyticsCamp,  javascriptIntegrationCheckApi } from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";





import { showErrorToast, showSuccessToast } from "../components/toast/toast";


const WebAnalyticsPage = ({
  analyticsData = [],
  currentPage,
  itemsPerPage,
  onViewAll,
  onPrevious,
  onNext,
  onAddNewUrl,
  onRefresh,
  onViewClick,
  onCodeClick,
  onDeleteClick,
}) => {
  // MODAL STATES
  const [open, setOpen] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [selectedCdnCode, setSelectedCdnCode] = useState({});
  const navigate = useNavigate();
 
  const abortControllerRef = useRef(null);

  const Button = ({
    children,
    variant,
    icon: Icon,
    onClick,
    className = "",
  }) => {
    let baseClasses =
      "px-4 py-2 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 focus:outline-none";

    if (variant === "primary") {
      baseClasses += " bg-blue-600 hover:bg-blue-700 text-white shadow-md";
    } else if (variant === "secondary") {
      baseClasses +=
        " bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600";
    } else if (variant === "pagination") {
      baseClasses +=
        " bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
    } else if (variant === "icon") {
      baseClasses =
        "p-2 rounded-lg bg-transparent hover:bg-[#25344E] transition-all duration-200";
    }

    return (
      <button className={`${baseClasses} ${className}`} onClick={onClick}>
        {Icon && <Icon />}
        {children}
      </button>
    );
  };

  const TrashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CodeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-300"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414L13.414 10l-4.707 4.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ChartBarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  const [campaigns, setCampaigns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [urlName, setUrlName] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
// campaigns already exists

 


  const fetchCampaigns = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const response = await apiFunction("get", getAllAnalyticsCamp, null, null,signal);
      console.log(response);
      
     
      
      const dataRows = response.data.data || [];
      
      setCampaigns(dataRows);
      setTotalItems(dataRows.length);
    } catch (err) {
      setError("Failed to load campaigns");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }, []);


  const handleDeleteCampaign = async (id) => {
  if (!id) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this campaign?"
  );
  if (!confirmDelete) return;

  try {
    const res = await apiFunction(
      "delete",
      getAllAnalyticsCamp,
    id,   // 👈 ID here
      null
    );

    showSuccessToast("Campaign deleted successfully");

    // 🔄 Refresh list after delete
    fetchCampaigns();

  } catch (error) {
   
    showErrorToast(
      error?.response?.data?.message || "Failed to delete campaign"
    );
  }
};


const addUrlCamp = async (signal) => {
  // basic validation
  if (!urlName.trim() || !urlValue.trim()) {
    showErrorToast("Name and URL are required");
    return;
  }

  try {
    setIsSubmitting(true);

    const payload = {
      name: urlName,
      integrationUrl: urlValue,
    };

    const res = await apiFunction(
      "post",
      getAllAnalyticsCamp,
      null,
      payload,
    );

    if (res?.data?.success) {
      // reset fields
      setUrlName("");
      setUrlValue("");

      // close modal
      setOpen1(false);

      // refresh list
      fetchCampaigns();
      showSuccessToast('Campaign Created Successfully..!!')
    }
  } catch (error) {
    console.log(error);
    
    showErrorToast("Failed to add URL");
  } finally {
    setIsSubmitting(false);
  }
};



 useEffect(() => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  fetchCampaigns(controller.signal);

  return () => {
    controller.abort(); // 💣 screen leave
  };
}, [fetchCampaigns]);


  const handleRefresh = () => {
    fetchCampaigns();
  };

  const handleCopyCode = async () => {
    try {
    
      await navigator.clipboard.writeText(selectedCdnCode?.cdn);
      setIsCopied(true);
      showSuccessToast("Code copied to clipboard!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      showErrorToast("Failed to copy. Try again.");
    }
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // integration check
  const javascriptIntegration = async (camp) => {
    // console.log("ghfdu", camp?.selectedCdnCode?.item);
    const item = camp?.selectedCdnCode?.item;
    const url = item?.integrationUrl
    const data = {
      url: url,        // client site URL
      campId: item?.id           // expected camp id
    }
    const res = await apiFunction(
      "post",
      javascriptIntegrationCheckApi, null, data
    );
    // console.log(res);
  
    if (res.status === 200) {
      const data = {
        integration: true,
      }
      try {
        // console.log("guhsuhuahu");
        
        const integrate = await apiFunction("patch", getAllAnalyticsCamp, item?.id, data)
        // console.log(integrate);
      } catch (error) {
        // console.log("error",error);
        
      }
      
      showSuccessToast("✅ Integration Successful");
    } else {
      showErrorToast("❌ Integration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Web Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Track your URLs and monitor real-time visitor data
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setOpen1(true)}
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
              Add URL
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading} // Disable button while fetching
              className={`flex items-center cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium text-sm shadow-lg transition duration-150 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className={`h-5 w-5 mr-2 ${isLoading ? "animate-spin" : ""}`} // Spinning animation
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
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-[#2B3B58] text-gray-300 text-xs font-semibold uppercase tracking-wider">
            <div>SN</div>
            <div>Name</div>
            <div>URL</div>
            <div>Total Visitors</div>
            <div>View</div>
            <div>Code</div>
            <div>Created</div>
            <div>Actions</div>
          </div>

          {loadingCampaigns && (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
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
      <p className="text-sm">Loading campaigns...</p>
    </div>
  )}

  {/* 📭 Empty State */}
  {!loadingCampaigns && campaigns?.length === 0 && (
    <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
      <div className="text-4xl mb-3">🚀</div>

      <p className="text-lg font-medium text-gray-300">
        No Campaigns Created Yet
      </p>

      <p className="text-sm mt-1 max-w-xs">
        Create your first campaign to start tracking analytics and performance.
      </p>

      <button
       onClick={() => setOpen1(true)}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm shadow"
      >
        + Create Campaign
      </button>
    </div>
  )}

  {/* ✅ Data State */}
  {!loadingCampaigns &&
    campaigns?.length > 0 &&
    campaigns.map((item, index) => (
      <div
        key={item.id}
        className="grid grid-cols-8 gap-4 px-6 py-3 border-t border-gray-700 text-gray-200 hover:bg-[#25344E]"
      >
        <div>{index + 1}</div>

        <div className="truncate" title={item?.name}>
          {item?.name || "NA"}
        </div>

        {/* Integration URL Tooltip */}
        <div className="relative group inline-block">
          <span className="text-blue-400 cursor-pointer">ℹ️</span>
          <div
            className="absolute hidden group-hover:block bg-gray-900 text-white text-xs 
            p-2 rounded-md border border-gray-700 shadow-md whitespace-nowrap 
            -top-10 left-1/2 -translate-x-1/2 z-10"
          >
            {item?.integrationUrl || "-"}
          </div>
        </div>

        <div>{item?.clickCount || 0}</div>

        <div>
          <Button
            variant="icon"
            icon={ChartBarIcon}
            className="cursor-pointer"
            onClick={() =>
              navigate(`/Dashboard/real-time-analytics/${item.id}`)
            }
          />
        </div>

        {/* Code modal */}
        <div>
          <button
            onClick={() => {
              setSelectedCdnCode({
                item,
                cdn: item?.integrationCode || "",
                link: item?.integrationUrl || "",
              });
              setOpenCodeModal(true);
            }}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <CodeIcon />
          </button>
        </div>

        <div>{formatDateTime(item?.createdAt)}</div>

        <div>
          <Button
            variant="icon"
            className="cursor-pointer"
            icon={TrashIcon}
            onClick={() => handleDeleteCampaign(item.id)}
          />
        </div>
      </div>
    ))}
        </div>

        {/* View All */}
      </div>

      {/* CODE MODAL */}
      {openCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[750px] shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h2 className="text-xl text-white font-semibold ">
                Analytics Integration Code
              </h2>

              <button
                onClick={() => setOpenCodeModal(false)}
                className="text-gray-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-3">
              Paste this script inside {"<head>"} of your website:
            </p>

            {/* Code Box */}
            <div className="bg-black border border-slate-700 rounded-lg p-3 text-sm text-green-400">
              <pre className="whitespace-pre-wrap max-h-40 overflow-auto">
                {selectedCdnCode?.cdn}
              </pre>
            </div>

            <button
              onClick={handleCopyCode}
              className={`mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer ${
                isCopied
                  ? "bg-green-600 hover:bg-green-700 text-white" // Style when copied
                  : "bg-blue-600 hover:bg-blue-700 text-white" // Original style
              }`}
            >
              {isCopied ? (
                <>
                  <span>✅</span>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Copy Code</span>
                </>
              )}
            </button>

            {/* URL test */}
            <p className="mt-6 text-gray-300 text-sm mb-3">
              Enter URL to test integration:
            </p>

            <div className="bg-black border border-slate-700 rounded-lg p-3 text-sm text-green-400">
              <pre className="whitespace-pre-wrap max-h-40 overflow-auto">
                {selectedCdnCode?.link}
              </pre>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenCodeModal(false)}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/20  cursor-pointer"
              >
                Cancel
              </button>

              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg  cursor-pointer"
              onClick={()=>{javascriptIntegration({selectedCdnCode})
              }}
              >
                TEST URL
              </button>
            </div>
          </div>
        </div>
      )}

      {open1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* MODAL BOX */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[650px] shadow-2xl">
            {/* Title */}
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-3">
              Add Url
            </h2>

            {/* NAME FIELD */}
            <div className="mb-5">
              <label className="text-gray-400 text-xs block mb-2 uppercase  text-left">
                Name
              </label>
              <input
  value={urlName}
  onChange={(e) => setUrlName(e.target.value)}
  placeholder="eg: PPC Offer"
  className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
/>

            </div>

            {/* URL FIELD */}
            <div className="mb-8">
              <label className="text-gray-400 text-xs block mb-2 uppercase  text-left">
                Url
              </label>
            <input
  value={urlValue}
  onChange={(e) => setUrlValue(e.target.value)}
  placeholder="eg: https://www.google.com/"
  className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
/>

            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen1(false)}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/30  cursor-pointer"
              >
                ✕ Cancel
              </button>

             <button
  onClick={addUrlCamp}
  disabled={isSubmitting}
  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer
    ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
>
  {isSubmitting ? "Adding..." : "+ Add"}
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebAnalyticsPage;
