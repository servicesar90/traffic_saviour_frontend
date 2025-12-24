import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// import {ipClicks} from "../api/Apis.js";
import { apiFunction } from "../api/ApiFunction.js";
import { ipClicks, campdata, getAllCampaign,signOutApi, createCampaignApi } from "../api/Apis.js";
import { showInfoToast } from "../components/toast/toast.jsx";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    blocked_campaigns: 0,
    allowed_campaigns: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
   const [dropdownPos, setDropdownPos] = useState(null);
  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleRefresh = () => {
    fetchIpClicks();
    fetchStats();
    fetchCampaigns();
  };

  const goToCampaign = (id) => alert("Open campaign: " + id);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => p + 1);

 const fetchIpClicks = async () => {
  try {
    setLoading(true);

    const res = await apiFunction("get", ipClicks);
    const rawData = res?.data?.data || [];

    // 👉 Only latest 10 days
    const last10DaysData = rawData.slice(-10);

    // Chart data
    const formattedData = last10DaysData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      Safe: Number(item.total_s_clicks || 0),
      Money: Number(item.total_m_clicks || 0),
      Total: Number(item.total_t_clicks || 0),
    }));

    setChartData(formattedData);

    // Summary totals (only last 10 days)
    const totals = last10DaysData.reduce(
      (acc, item) => {
        acc.totalClicks += Number(item.total_t_clicks || 0);
        acc.safeClicks += Number(item.total_s_clicks || 0);
        acc.moneyClicks += Number(item.total_m_clicks || 0);
        return acc;
      },
      { totalClicks: 0, safeClicks: 0, moneyClicks: 0 }
    );

    setClickSummary(totals);
  } catch (err) {
    console.error("IP Click API Error:", err);
    setChartData([]);
    setClickSummary({ totalClicks: 0, safeClicks: 0, moneyClicks: 0 });
  } finally {
    setLoading(false);
  }
};

  

  const fetchCampaigns = useCallback(async () => { 
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction("get", getAllCampaign, null, null);
      console.log(response.data);

      // Assume total items is available in response.data.total or we use array length
      const dataRows = response.data.data || [];

      setCampaigns(dataRows);
      setTotalItems(response.data.total || dataRows.length);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load campaign data.";
      setError(errorMessage); // Updated to show actual error if available
      setIsLoading(false);
      setCampaigns([]);
      setTotalItems(0);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiFunction("get", campdata, null, null);

      setStats({
        total_campaigns: res?.data?.data?.total_campaigns || 0,
        active_campaigns: res?.data?.data?.active_campaigns || 0,
        blocked_campaigns: res?.data?.data?.blocked_campaigns || 0,
        allowed_campaigns: res?.data?.data?.allowed_campaigns || 0,
      });
    } catch (error) {
      console.error("Stats API Error:", error);
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask("");
  };

  // ✅ Toggle complete/incomplete
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // ✅ Delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // ✅ Filtered tasks by search
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (e,campaignId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDropdownPos({
      top: rect.bottom + 2, // below button
      left: rect.right -150, // align right (w-48 = 192px)
    });
    setOpenDropdownId(openDropdownId === campaignId ? null : campaignId);
  };

  const handleActionSelect = async (action, campaignId, row) => {
    setOpenDropdownId(null); // मेनू बंद करें
    switch (action) {
      case "edit":
        // alert(`Editing campaign ID: ${campaignId}`);
        navigate("/Dashboard/create-campaign", {
          state: {
            mode: "edit",
            data: row, // campaign data from db
          },
        });
        // TODO: Navigate to Edit screen or open a modal
        break;
      case "duplicate":
        // alert(`Duplicating campaign ID: ${campaignId}`);
        // TODO: Call API to duplicate campaign
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete campaign ID: ${campaignId}?`
          )
        ) {
          // TODO: Call API to delete campaign and then fetchCampaigns() to refresh
          const res = await apiFunction(
            "delete",
            createCampaignApi,
            campaignId,
            null
          );
          if (res) return alert(`Deleting campaign ID: ${campaignId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleAddNewCampaign = () => {
    showInfoToast("Redirecting to Creating New Campaign");
    navigate("/Dashboard/create-campaign");
  };


    const handleStatusChange = async (uid, newStatus) => {
    try {
      // loading UI
      setCampaigns(prev =>
        prev.map(item =>
          item.uid === uid ? { ...item, statusLoading: true } : item
        )
      );
  
      const data ={
        status:newStatus
      }
      // backend API call
      const res = await apiFunction(
        "patch",
        createCampaignApi, 
        uid,       // change route according to backend
        data
      );
  
      if (!res?.data?.success) {
        showErrorToast("Failed updating status");
        return;
      }
  
      // update UI instantly
      setCampaigns(prev =>
        prev.map(item =>
          item.uid === uid
            ? { ...item, status: newStatus, statusLoading: false }
            : item
        )
      );
  
      showSuccessToast(`Status updated ✔ : ${newStatus}`);
  
    } catch (err) {
      console.error("Status update error:", err);
      showErrorToast("Something went wrong!");
  
      // remove loading state
      setCampaigns(prev =>
        prev.map(item =>
          item.uid === uid ? { ...item, statusLoading: false } : item
        )
      );
    }
  };

  useEffect(() => {
      const token = localStorage.getItem("token");
  if (!token) {
    signOut();
    navigate('/signin')
  }


    fetchIpClicks();
    fetchStats();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Load Todos from LocalStorage on page load
  useEffect(() => {
    const savedTasks = localStorage.getItem("dashboard_todos");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // ✅ Auto Save Todos to LocalStorage
  useEffect(() => {
    localStorage.setItem("dashboard_todos", JSON.stringify(tasks));
  }, [tasks]);

  // Small reusable StatCard
  const StatCard = ({ icon, value, title, subtitle }) => (
    <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-800 text-lg">{icon}</div>
          <div>
            <div className="text-2xl font-semibold text-white">{value}</div>
            <div className="text-xs text-slate-400">{title}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </div>
  );

  const renderActionDropdown = (campaignId, row) => (
    // ref को सीधे dropdownRef के बजाय किसी wrapper div को दें ताकि click outside काम करे
    <div className="fixed right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-20"
    style={{
      zIndex: 9999999, // over ALL elements
      left: dropdownPos.left,
      top: dropdownPos.top, // adjust dynamically if needed
    }}
    >
      <div className="py-1">
        <button
          onClick={() => handleActionSelect("edit", campaignId, row)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white transition duration-100"
        >
          Edit Campaign
        </button>
        <button
          onClick={() => handleActionSelect("duplicate", campaignId, null)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white transition duration-100"
        >
          Duplicate Campaign
        </button>
        <button
          onClick={() => handleActionSelect("delete", campaignId, null)}
          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300 transition duration-100"
        >
          Delete Campaign
        </button>
      </div>
    </div>
  );

  const renderTableContent = () => {
    // ... (Loading/Error/Empty Data checks)
    if (isLoading) {
      /* ... loading JSX ... */ return (
        <tr>
          <td colSpan="10" className="text-center py-10 text-blue-400 text-xl">
            <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full"></div>
            <p className="mt-4">Loading Campaigns...</p>
          </td>
        </tr>
      );
    }
    if (error) {
      /* ... error JSX ... */ return (
        <tr>
          <td colSpan="10" className="text-center py-10 text-gray-400">
            No campaigns found.
          </td>
        </tr>
      );
    }
    if (campaigns.length === 0) {
      /* ... empty JSX ... */ return (
        <span className="flex justify-center items-center">
          <div className=" py-10 text-gray-500 text-md">
            No campaigns found.
          </div>
        </span>
      );
    }

    // --- Actual Table Body Rendering ---
    return (
      <tbody className="bg-gray-900 divide-y divide-gray-800">
        {campaigns.map((item, index) => {
          const campaignId = item.campaign_info?.campaign_id || index;
          const isDropdownOpen = openDropdownId === item?.uid;
          console.log(openDropdownId, campaignId);

          return (
            <tr key={campaignId}>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-12">
                {index + 1}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-blue-400 text-left hover:text-blue-300 cursor-pointer w-40">
                {item.campaign_info?.campaignName || "Not Provided"}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-24">
                {item.campaign_info?.trafficSource || "Not Provided"}
              </td>
             <td className="px-3 py-3 whitespace-nowrap text-sm text-left w-32">
  <div className="flex items-center text-left ">
    <div>
        {/* ▶ Play / Activate */}
    <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Active")}
      className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Active"
          ? "text-green-500 drop-shadow-[0_0_6px_rgba(16,185,129,.8)]"
          : "text-gray-500 hover:text-gray-300"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M7 4v16l13-8L7 4z"/>
      </svg>
    </button>

    {/* ⚡ Boost */}
    <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Allow All")}
      className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Allow All"
          ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,.8)]"
          : "text-gray-500 hover:text-gray-300"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M13 2L3 14h7v8l10-12h-7z"/>
      </svg>
    </button>

    {/* 🚫 Block */}
    <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Block All")}
      className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Block"
          ? "text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,.8)]"
          : "text-gray-500 hover:text-gray-300"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="5" y1="19" x2="19" y2="5"/>
      </svg>
    </button>


    </div>

  

  </div>
</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-center w-32">
                {item.integration ? (
                  <div className="relative group flex justify-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    {/* ⭐ Tooltip container */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      {item.integrationUrl || "No URL Found"}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </td>

              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-20">
                {item?.campclicks?.total_t_clicks || "No Clicks"}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-16">
                <div className="flex items-center space-x-1 relative group">
                  {/* i Icon */}
                  <svg
                    className="h-4 w-4 text-blue-400 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    />
                  </svg>

                  {/* Value */}
                  <span>{item?.campclicks?.total_s_clicks|| 0}</span>

                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block 
        bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50"
                  >
                    {item?.safe_page || "No URL Found"}
                  </div>
                </div>
              </td>

              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-20">
                <div className="flex items-center space-x-1 relative group">
                  {/* i Icon */}
                  <svg
                    className="h-4 w-4 text-blue-400 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    />
                  </svg>

                  {/* Value */}
                  <span>{item?.campclicks?.total_m_clicks || 0}</span>

                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block 
        bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50"
                  >
                    {item?.money_page[0]?.url || "No URL Found"}
                  </div>
                </div>
              </td>

              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-left w-48">
                {new Date(item.date_time).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
              {/* ⭐ UPDATED ACTION COLUMN */}
              <td
                ref={isDropdownOpen ? dropdownRef : null}
                className="px-3 py-3 whitespace-nowrap text-sm text-gray-400 w-20 text-left relative"
              >
                <button
                  onClick={(e) => handleActionClick(e,item?.uid)}
                  className={`text-2xl leading-none font-bold p-1 rounded-full cursor-pointer ${
                    isDropdownOpen
                      ? "bg-gray-600 text-white"
                      : "hover:bg-gray-700"
                  }`}
                >
                  ⋯ {/* Vertical three dots */}
                </button>
                {isDropdownOpen && renderActionDropdown(item?.uid, item)}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-slate-400 text-sm">Let's do something new.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddNewCampaign}
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
            Add New Campaign
          </button>
          <button
            onClick={handleRefresh}
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

      {/* Top Stats */}
      <div className="mb-6 flex gap-6 flex-wrap">
        <StatCard icon="📊" value={stats.total_campaigns} title="Campaigns" />
        <StatCard icon="▶️" value={stats.active_campaigns} title="Active" />
        <StatCard icon="⚡" value={stats.allowed_campaigns} title="Allow All" />
        <StatCard icon="🚫" value={stats.blocked_campaigns} title="Block All" />
      </div>

      <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-2">
          Clicks Overview
        </h3>
        <p className="text-sm text-slate-400 mb-4">Cumulative Click Log</p>

        <div style={{ width: "100%", height: 260 }}>
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
          ) : chartData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-2">📉</div>
              <p className="text-slate-400 text-sm font-medium">
                No IP Click Data Available
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Data will appear here once clicks are recorded.
              </p>
            </div>
          ) : (
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="safeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>

                  <linearGradient
                    id="moneyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#1e293b"
                  vertical={false}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />

                <Legend
                  wrapperStyle={{
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                  iconType="circle"
                  verticalAlign="top"
                  align="right"
                />

                <Bar
                  dataKey="Safe"
                  stackId="a"
                  fill="url(#safeGradient)"
                  barSize={16}
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="Money"
                  stackId="a"
                  fill="url(#moneyGradient)"
                  barSize={16}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden">
  
  {/* TABLE SCROLL AREA */}
  <div className="overflow-y-auto max-h-[70vh]">
     <table className="min-w-full divide-y divide-gray-700 table-fixed">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">
                Sn <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-40">
                Campaign Name <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                Source <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                Status <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                Intergration <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                Clicks <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                Safe <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                Money <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">
                Created on <span className="text-sm">⇅</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                Action
              </th>
            </tr>
          </thead>
          {/* Dynamic Table Body (Handles Loading/Error/Data) */}
          {renderTableContent()}
        </table>
  </div>

  {/* FOOTER STRIP */}
  <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
    <span className="text-sm text-gray-400">
      Showing 1–10 of 120 campaigns
    </span>

    {/* PAGINATION */}
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
        Prev
      </button>

      <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">
        1
      </button>

      <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
        2
      </button>

      <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
        Next
      </button>
    </div>
  </div>
</div>


      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* To-do */}
        <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6 min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">To do</h4>
            <div className="text-slate-400 text-sm">Reminders List for me</div>
          </div>

          <div className="bg-slate-900 border border-gray-800 rounded-md p-4 min-h-[120px]">
            {/* ✅ Search */}
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-gray-700 px-3 py-2 rounded-md text-slate-300 mb-3"
              placeholder="Search tasks"
            />

            {/* ✅ Add Task */}
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 w-full bg-transparent border border-gray-700 px-3 py-2 rounded-md text-slate-300"
                placeholder="Write new task..."
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* ✅ Task List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">
                  No tasks found
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-md"
                  >
                    <div
                      onClick={() => handleToggleComplete(task.id)}
                      className={`cursor-pointer text-sm ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-white"
                      }`}
                    >
                      {task.text}
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      ❌
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ✅ Task Count */}
            <div className="mt-3 text-slate-400 text-xs text-right">
              {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Click Metrics */}
        <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6 min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">
              Click Metrics - Realtime Logs
            </h4>
            <div className="text-slate-400 text-sm">
              Recent activity across all campaigns
            </div>
          </div>

          <div className="bg-slate-900 border border-gray-800 rounded-md p-6">
            {loading ? (
              <p className="text-center text-slate-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* 🔥 Total Clicks */}
                <div className="text-center">
                  <div className="bg-slate-800 p-4 rounded-md inline-block">
                    <div className="text-2xl font-semibold text-white">
                      {clickSummary.totalClicks}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">
                    Total Clicks
                  </div>
                </div>

                {/* 🔥 Safe Clicks */}
                <div className="text-center">
                  <div className="bg-slate-800 p-4 rounded-md inline-block">
                    <div className="text-2xl font-semibold text-white">
                      {clickSummary.safeClicks}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">Safe Clicks</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
