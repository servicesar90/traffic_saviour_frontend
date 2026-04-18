

import React, { useEffect, useCallback, useState } from "react";
import { Eye, Code2, Trash2 } from "lucide-react";

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
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [selectedCdnCode, setSelectedCdnCode] = useState({});
  const navigate = useNavigate();
 
  const abortControllerRef = useRef(null);


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
    setLoadingCampaigns(true);
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
      setLoadingCampaigns(false);
    }
  }, []);

  const getInitials = (name = "") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "NA";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };


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
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 p-0 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="dashboard-heading text-left">Web Analytics</h1>
            <p className="dashboard-subheading text-left">
              Track your URLs and monitor real-time visitor data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen1(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              <svg
                className="h-4 w-4"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border transition-all duration-200 ${
                isLoading
                  ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed opacity-80"
                  : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              <svg
                className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} // Spinning animation
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
        <div
          className="overflow-x-hidden bg-transparent"
          style={{
            borderLeft: "none",
            borderRight: "none",
            outline: "none",
            borderBottom: "none",
            boxShadow: "inset 0 -0.5px 0 rgba(213,217,228,0.55)",
          }}
        >
          <div className="w-full min-w-0">
            <div
              className="grid grid-cols-[34px_minmax(170px,1fr)_minmax(200px,1.1fr)_minmax(64px,0.4fr)_minmax(160px,0.85fr)_102px] [&>*+*]:border-l-[0.5px] [&>*+*]:border-[rgba(213,217,228,0.55)] [&>*:last-child]:border-r-0 text-[#31374A] text-[13px] font-extrabold uppercase"
              style={{
                borderTop: "none",
                borderBottom: "none",
                backgroundImage:
                  "linear-gradient(rgba(213,217,228,0.55), rgba(213,217,228,0.55)), linear-gradient(rgba(213,217,228,0.55), rgba(213,217,228,0.55))",
                backgroundSize: "100% 0.5px, 100% 0.5px",
                backgroundPosition: "top left, bottom left",
                backgroundRepeat: "no-repeat",
                boxShadow:
                  "inset 0 0.5px 0 rgba(213,217,228,0.55), inset 0 -0.5px 0 rgba(213,217,228,0.55)",
              }}
            >
              <div className="flex items-center justify-center py-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-2 text-center">
                <span>Campaign</span>
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-2 text-center">
               
                <span>Tracking URL</span>
              </div>
              <div className="flex items-center justify-center py-2 px-2 text-center">Visitor Count</div>
              <div className="flex items-center justify-center py-2 px-2 text-center">Created On</div>
              <div className="flex items-center justify-center py-2 px-2">Operations</div>
            </div>

            {loadingCampaigns && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse" />
                  <span
                    className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
                <p className="text-sm">Loading campaigns...</p>
              </div>
            )}

            {!loadingCampaigns && campaigns?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500">
                <div className="text-2xl mb-3 text-slate-400">No items</div>
                <p className="text-lg font-medium text-slate-700">No Campaigns Created Yet</p>
                <p className="text-sm mt-1 max-w-xs">Create your first campaign to start tracking analytics and performance.</p>
                <button onClick={() => setOpen1(true)} className="mt-6 px-6 py-2 bg-[#3c79ff] hover:bg-[#356ee6] !text-white  rounded-md text-sm cursor-pointer">+ Create Campaign</button>
              </div>
            )}

            {!loadingCampaigns &&
              campaigns?.length > 0 &&
              campaigns.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[34px_minmax(170px,1fr)_minmax(200px,1.1fr)_minmax(64px,0.4fr)_minmax(160px,0.85fr)_102px] [&>*+*]:border-l-[0.5px] [&>*+*]:border-[rgba(213,217,228,0.55)] [&>*:last-child]:border-r-0 text-slate-700 text-[14px] hover:bg-slate-50"
                  style={{
                    borderTop: "none",
                    backgroundImage:
                      "linear-gradient(rgba(213,217,228,0.55), rgba(213,217,228,0.55))",
                    backgroundSize: "100% 0.5px",
                    backgroundPosition: "top left",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex items-center justify-center py-1.5">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  </div>

                  <div className="flex items-center gap-2 py-1.5 px-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {getInitials(item?.name)}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-semibold truncate" style={{ color: "#3c79ff" }} title={item?.name}>
                        {item?.name || "NA"}
                      </div>
                      <div className="text-[14px] text-slate-600 truncate">Web Analytics Campaign</div>
                    </div>
                  </div>

                  <div className="py-1.5 px-3 min-w-0">
                    <div className="text-[14px] text-slate-700 truncate" title={item?.integrationUrl || "-"}>
                      {item?.integrationUrl || "-"}
                    </div>
                  </div>

                  <div className="py-1.5 px-3">{item?.clickCount || 0}</div>

                  <div className="py-1.5 px-3 text-slate-500 text-[14px]">{formatDateTime(item?.createdAt)}</div>

                  <div className="py-1.5 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="relative group">
                        <button
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] cursor-pointer transition-colors"
                          onClick={() => navigate(`/Dashboard/real-time-analytics/${item.id}`)}
                          aria-label="View"
                        >
                          <Eye size={16} />
                        </button>
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          View
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7] cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedCdnCode({
                              item,
                              cdn: item?.integrationCode || "",
                              link: item?.integrationUrl || "",
                            });
                            setOpenCodeModal(true);
                          }}
                          aria-label="Code"
                        >
                          <Code2 size={16} />
                        </button>
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          Code
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] cursor-pointer transition-colors"
                          onClick={() => handleDeleteCampaign(item.id)}
                          aria-label="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* View All */}
      </div>
      {/* CODE DRAWER */}
      <div
        className={`fixed inset-0 z-50 ${openCodeModal ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${openCodeModal ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpenCodeModal(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[430px] bg-[#f5f7fa] border-l border-[#d5d9e4] shadow-2xl transition-transform duration-300 flex flex-col ${openCodeModal ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between p-5 border-b border-[#d5d9e4]">
            <div>
              <div className="text-lg font-semibold text-slate-900 text-left">
                Analytics Integration Code
              </div>
              <div className="text-xs text-slate-500 text-left">
                Copy and test URL integration
              </div>
            </div>
            <button
              onClick={() => setOpenCodeModal(false)}
              className="ml-3 h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:text-slate-800 shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2 text-left">
                Integration Script
              </label>
              <div className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700">
                <pre className="whitespace-pre-wrap max-h-56 overflow-auto custom-scrollbar">
                  {selectedCdnCode?.cdn}
                </pre>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-md cursor-pointer !text-white ${
                isCopied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#3c79ff] hover:bg-[#356ee6]"
              }`}
            >
              {isCopied ? "Copied!" : "Copy Code"}
            </button>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2 text-left">
                URL To Test
              </label>
              <div className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700 break-all">
                {selectedCdnCode?.link}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#d5d9e4] flex justify-start gap-3">
            <button
              onClick={() => setOpenCodeModal(false)}
              className="px-4 py-2 cursor-pointer border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-[#3c79ff] hover:bg-[#356ee6] rounded-md cursor-pointer !text-white"
              onClick={() => {
                javascriptIntegration({ selectedCdnCode });
              }}
            >
              TEST URL
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 ${open1 ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open1 ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen1(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[380px] bg-[#f5f7fa] border-l border-[#d5d9e4] shadow-2xl transition-transform duration-300 flex flex-col ${open1 ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between p-5 border-b border-[#d5d9e4]">
            <div>
              <div className="text-lg font-semibold text-slate-900 text-left">Add URL</div>
              <div className="text-xs text-slate-500">Create analytics URL entry</div>
            </div>
            <button
              onClick={() => setOpen1(false)}
              className="ml-3 h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:text-slate-800 shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Name
              </label>
              <input
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                placeholder="eg: PPC Offer"
                className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                URL
              </label>
              <input
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="eg: https://www.google.com/"
                className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700"
              />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#d5d9e4] flex justify-start gap-3">
            <button
              onClick={() => setOpen1(false)}
              className="px-4 py-2 cursor-pointer border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
            >
              Cancel
            </button>

            <button
              onClick={addUrlCamp}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-[#3c79ff] hover:bg-[#356ee6] rounded-md cursor-pointer !text-white ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Adding..." : "+ Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAnalyticsPage;

