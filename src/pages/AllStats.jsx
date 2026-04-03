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

// import {ipClicks} from "../api/Apis.js";
import { apiFunction } from "../api/ApiFunction.js";
import {
  ipClicks,
  campdata,
  getAllCampaign,

  createCampaignApi,
} from "../api/Apis.js";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../components/toast/toast.jsx";
import { cryptoPayment } from "../api/Apis.js";


const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    blocked_campaigns: 0,
    allowed_campaigns: 0,
  });

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const [billingList, setBillingList] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  

  const ITEMS_PER_PAGE = 5;

  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      await Promise.all([fetchIpClicks(), fetchStats(), fetchCampaigns()]);
    } catch (err) {
      // console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // smooth UX
    }
  };

  // const goToCampaign = (id) => alert("Open campaign: " + id);
  // const prevPage = () => setPage((p) => Math.max(1, p - 1));
  // const nextPage = () => setPage((p) => p + 1);

  const fetchIpClicks = async () => {
    try {
      setLoading(true);

      const res = await apiFunction("get", ipClicks);
      const rawData = res?.data?.data || [];

      //  Only latest 10 days
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
      // console.error("IP Click API Error:", err);
      setChartData([]);
      setClickSummary({ totalClicks: 0, safeClicks: 0, moneyClicks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction(
        "get",
        `${getAllCampaign}?page=${page}&limit=${ITEMS_PER_PAGE}`,
        null,
        null
      );
      // console.log(response);

      // Assume total items is available in response.data.total or we use array length
      const dataRows = response.data.data || [];

      setCampaigns(dataRows);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);

      setTotalItems(response.data.total || dataRows.length);
      setIsLoading(false);
    } catch (err) {
      // console.error("Error fetching campaigns:", err);
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
      // console.error("Stats API Error:", error);
    }
  };

  const fetchBillingData = async (signal) => {
    try {
      setBillingLoading(true);
      const res = await apiFunction("get", cryptoPayment, null, null, signal);
      setBillingList(res?.data?.data || []);
    } catch (error) {
      if (error.name !== "AbortError") {
        // silent: billing panel is non-blocking
      }
    } finally {
      setBillingLoading(false);
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask("");
  };

  //  Toggle complete/incomplete
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  //  Delete task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  //  Filtered tasks by search
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (e, campaignId) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 2, // below button
      left: rect.right - 150, // align right (w-48 = 192px)
    });
    setOpenDropdownId(openDropdownId === campaignId ? null : campaignId);
  };

  const handleActionSelect = async (action, campaignId, row) => {
    setOpenDropdownId(null); //   
    switch (action) {
      case "edit":
        // alert(`Editing campaign ID: ${campaignId}`);
        navigate("/Dashboard/create-campaign", {
          state: {
            mode: "edit",
            id: row.uid,
            data: row, // campaign data from db
          },
        });
        // TODO: Navigate to Edit screen or open a modal
        break;
      case "duplicate": {
        try {
          if (!row) return;
          // console.log(row);

          //  deep clone campaign
          const payload = JSON.parse(JSON.stringify(row));
       

          //  backend generated fields hatao
          delete payload.uid;
          delete payload._id;
          delete payload.createdAt;
          delete payload.updatedAt;
          delete payload.date_time;

          //  campaign name modify
          const data = {
            ...payload,

            campaignName:
              (payload.campaign_info?.campaignName || "Campaign") + " (Copy)",
            trafficSource: payload.campaign_info?.trafficSource,
          };

          // optional default status


          //  CREATE API CALL (same API as create)
          const res = await apiFunction("post", createCampaignApi, null, data);

          if (res?.data?.status || res?.data?.success) {
            const newCampaign = res.data.data;

            //  UI update (top me add)
            setCampaigns((prev) => [newCampaign, ...prev]);
            

            showSuccessToast("Campaign duplicated successfully");
            await fetchCampaigns();
            await fetchStats();
           

          }
        } catch (err) {
          // console.error("Duplicate campaign error:", err);
          showErrorToast(err?.response?.data?.message || "Failed to duplicate campaign");
        }

        break;
      }

      case "delete":
        if (window.confirm(`Are you sure you want to delete this campaign?`)) {
          const res = await apiFunction(
            "delete",
            createCampaignApi,
            campaignId,
            null
          );

          if (res) {
            setCampaigns((prev) =>
              prev.filter((item) => item.uid !== campaignId)
            );
            await fetchStats();
            
            
          }
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
      //  current campaign find karo
      const currentItem = campaigns.find((item) => item.uid === uid);
      const oldStatus = currentItem?.status;

      // agar same status pe click hua to kuch mat karo
      if (!currentItem || oldStatus === newStatus) return;

      //  loading UI
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid ? { ...item, statusLoading: true } : item
        )
      );

      const data = { status: newStatus };

      //  PATCH API
      const res = await apiFunction("patch", createCampaignApi, uid, data);

      if (!res?.data?.success) {
        showErrorToast("Failed updating status");
        return;
      }

      //  update campaigns list
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid
            ? { ...item, status: newStatus, statusLoading: false }
            : item
        )
      );

      //  UPDATE STATS WITHOUT RELOAD
      setStats((prev) => {
        const updated = { ...prev };

        // old status decrement
        if (oldStatus === "Active") updated.active_campaigns--;
        if (oldStatus === "Allow") updated.allowed_campaigns--;
        if (oldStatus === "Block") updated.blocked_campaigns--;

        // new status increment
        if (newStatus === "Active") updated.active_campaigns++;
        if (newStatus === "Allow") updated.allowed_campaigns++;
        if (newStatus === "Block") updated.blocked_campaigns++;

        return updated;
      });

      showSuccessToast(`Status updated OK: ${newStatus}`);
    } catch (err) {
      // console.error("Status update error:", err);
      showErrorToast("Something went wrong!");

      //  loading hatao
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid ? { ...item, statusLoading: false } : item
        )
      );
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchCampaigns(page);
  };
  

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  useEffect(() => {
    const token = localStorage.getItem("token");
  

    if (!token) {
      signOut();
      navigate("/signin");
    }
  

    fetchIpClicks();
    fetchStats();
    fetchCampaigns();
    const controller = new AbortController();
    fetchBillingData(controller.signal);
    return () => controller.abort();
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

  //  Load Todos from LocalStorage on page load
  useEffect(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  //  Auto Save Todos to LocalStorage
  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Small reusable StatCard
  const StatCard = ({ icon, value, title, subtitle }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500">{title}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </div>
  );

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const paidTotal = billingList
    .filter((item) => (item.status || "").toLowerCase() === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const unpaidTotal = billingList
    .filter((item) => (item.status || "").toLowerCase() !== "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthTotal = billingList
    .filter((item) => {
      const date = item.start_date ? new Date(item.start_date) : null;
      return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const paidCount = billingList.filter(
    (item) => (item.status || "").toLowerCase() === "paid"
  ).length;

  const accountCards = [
    {
      title: "Total Paid",
      number: `${paidCount} invoices`,
      balance: currency.format(paidTotal),
      color: "from-indigo-500 to-indigo-400",
    },
    {
      title: "Outstanding",
      number: "Pending invoices",
      balance: currency.format(unpaidTotal),
      color: "from-rose-500 to-orange-400",
    },
    {
      title: "This Month",
      number: "Current billing",
      balance: currency.format(monthTotal),
      color: "from-emerald-500 to-lime-400",
    },
  ];

  const invoiceRows = [...billingList]
    .sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0))
    .slice(0, 3)
    .map((item) => ({
      title: item.plan_name || "Subscription",
      status: item.status || "Processing",
      amount: currency.format(Number(item.amount || 0)),
      date: item.start_date ? new Date(item.start_date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "N/A",
    }));

  const safePercent = clickSummary.totalClicks
    ? Math.round((clickSummary.safeClicks / clickSummary.totalClicks) * 100)
    : 0;
  const moneyPercent = clickSummary.totalClicks
    ? Math.round((clickSummary.moneyClicks / clickSummary.totalClicks) * 100)
    : 0;

  const renderActionDropdown = (campaignId, row) => (
    // ref   dropdownRef    wrapper div    click outside  
    <div
      className="fixed right-0 top-full mt-2 w-48 rounded-xl shadow-lg bg-white border border-slate-200 z-20"
      style={{
        zIndex: 9999999, // over ALL elements
        left: dropdownPos?.left,
        top: dropdownPos?.top, // adjust dynamically if needed
      }}
    >
      <div className="py-1">
        <button
          onClick={() => handleActionSelect("edit", campaignId, row)}
          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition duration-100 cursor-pointer"
        >
          Edit Campaign
        </button>
        <button
          onClick={() => handleActionSelect("duplicate", campaignId, row)}
          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition duration-100 cursor-pointer"
        >
          Duplicate Campaign
        </button>
        <button
          onClick={() => handleActionSelect("delete", campaignId, null)}
          className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition duration-100 cursor-pointer"
        >
          Delete Campaign
        </button>
      </div>
    </div>
  );

  const TableColGroup = () => (
    <colgroup>
      <col className="w-12" />
      <col className="w-30" />
      <col className="w-30" />
      <col className="w-25" />
      <col className="w-32" />
      <col className="w-20" />
      <col className="w-16" />
      <col className="w-20" />
      <col className="w-48" />
      <col className="w-20" />
    </colgroup>
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan="10" className="text-center py-10 text-blue-400">
              Loading Campaigns...
            </td>
          </tr>
        </tbody>
      );
    }

    if (error || campaigns.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan="10" className="text-center py-10 text-slate-400">
              No campaigns found.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="bg-white divide-y divide-slate-200">
        {campaigns.map((item, index) => {
          const campaignId = item.campaign_info?.campaign_id || index;
          const isDropdownOpen = openDropdownId === item?.uid;
          return (
            <>
              <tr key={item.campaignId}>
                <td className="px-3 py-3 text-sm  text-left text-slate-600">
                  {index + 1}
                </td>
                <td className="px-3 py-3 text-sm text-left text-slate-900 font-medium">
                  {item.campaign_info?.campaignName}
                </td>
                <td className="px-3 py-3 text-sm text-left text-slate-600">
                  {item.campaign_info?.trafficSource}
                </td>
                <td className="px-3 py-3 text-left">
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Active")}
                    className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Active"
            ? "text-green-500 drop-shadow-[0_0_6px_rgba(16,185,129,.8)]"
            : "text-slate-400 hover:text-slate-600"
        }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M7 4v16l13-8L7 4z" />
                    </svg>
                  </button>

                  {/*  Boost */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Allow")}
                    className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Allow"
            ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,.8)]"
            : "text-slate-400 hover:text-slate-600"
        }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M13 2L3 14h7v8l10-12h-7z" />
                    </svg>
                  </button>

                  {/*  Block */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Block")}
                    className={`p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Block"
            ? "text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,.8)]"
            : "text-slate-400 hover:text-slate-600"
        }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="5" y1="19" x2="19" y2="5" />
                    </svg>
                  </button>
                </td>
                <td className="px-3 py-3 text-left ">
                  {" "}
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

                      {/*  Tooltip container */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-700 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200">
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
                <td className="px-3 py-3 text-slate-600 text-center">
                  {item?.campclicks?.total_t_clicks || 0}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-600 text-right w-16">
                  <div className="flex items-center gap-1 relative group">
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
                    <span>{item?.campclicks?.total_s_clicks || 0}</span>

                    {/* Tooltip */}
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      hidden group-hover:block bg-white text-slate-700 text-xs 
      px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200"
                    >
                      {item?.safe_page || "No URL Found"}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-600 text-right w-20">
                  <div className="flex items-center gap-1 relative group">
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
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      hidden group-hover:block bg-white text-slate-700 text-xs 
      px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200"
                    >
                      {item?.money_page?.[0]?.url || "No URL Found"}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 text-slate-600 text-left">
                  {new Date(item.date_time).toLocaleString()}
                </td>
                <td
                  ref={isDropdownOpen ? dropdownRef : null}
                  className="px-3 py-3"
                >
                  <button
                    onClick={(e) => handleActionClick(e, item?.uid)}
                    className={`text-2xl leading-none font-bold p-1 rounded-full cursor-pointer ${
                      isDropdownOpen
                        ? "bg-slate-900 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    ... {/* Vertical three dots */}
                  </button>
                  {isDropdownOpen && renderActionDropdown(item?.uid, item)}
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formattedDate}</p>
            <h2 className="text-2xl font-semibold">
              Welcome Back, {user?.name ? user.name.split(" ")[0] : "Admin"}!
            </h2>
            <p className="text-slate-500 text-sm">
              Here is a snapshot of campaign performance and traffic safety.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNewCampaign}
              className="flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-full font-medium text-sm text-white shadow-sm transition cursor-pointer"
            >
              <svg
                className="h-4 w-4 mr-2"
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
              New Campaign
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border transition-all duration-200 cursor-pointer
                ${
                  isRefreshing
                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }
              `}
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
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
            <div className="hidden lg:flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">Send</button>
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">Request</button>
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">Transfer</button>
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">Deposit</button>
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">Pay Bill</button>
              <button className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-slate-900 text-white hover:bg-slate-800">Create Invoice</button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="TC" value={stats.total_campaigns} title="Total Campaigns" />
        <StatCard icon="AC" value={stats.active_campaigns} title="Active" />
        <StatCard icon="AL" value={stats.allowed_campaigns} title="Allow All" />
        <StatCard icon="BL" value={stats.blocked_campaigns} title="Blocked" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Overview</h3>
              <p className="text-sm text-slate-500">Clicks performance across the last 10 days</p>
            </div>
            <button className="h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100">
              ...
            </button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-400">Total Clicks</p>
              <p className="text-2xl font-semibold text-slate-900">{clickSummary.totalClicks}</p>
            </div>
            <div className="text-sm text-emerald-500 font-medium">+5.8% this week</div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            {loading ? (
              <p className="text-center text-slate-400 mt-6">Loading...</p>
            ) : chartData?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-2xl mb-2 text-slate-400">N/A</div>
                <p className="text-slate-500 text-sm font-medium">
                  No IP Click Data Available
                </p>
                <p className="text-slate-400 text-xs mt-1">
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
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
                    </linearGradient>

                    <linearGradient
                      id="moneyGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      color: "#0f172a",
                    }}
                    cursor={{ fill: "rgba(148, 163, 184, 0.2)" }}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "#64748b",
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
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="Money"
                    stackId="a"
                    fill="url(#moneyGradient)"
                    barSize={16}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Accounts</h3>
            <button className="h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100">
              ...
            </button>
          </div>
          <div className="space-y-3">
            {accountCards.map((card) => (
              <div key={card.title} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-16 rounded-2xl bg-gradient-to-br ${card.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                    <p className="text-xs text-slate-400">{card.number}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">{card.balance}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-100">
            + Create account
          </button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Money movement</h3>
            <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-500">Aug 2026</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Money in</p>
                <button className="h-7 w-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100">+</button>
              </div>
              <p className="text-2xl font-semibold text-slate-900">${clickSummary.safeClicks}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${safePercent}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{safePercent}% from safe traffic</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">Money out</p>
                <button className="h-7 w-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100">+</button>
              </div>
              <p className="text-2xl font-semibold text-slate-900">${clickSummary.moneyClicks}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${moneyPercent}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{moneyPercent}% risk traffic</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Invoices</h3>
            <button className="h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100">...</button>
          </div>
          <div className="space-y-3">
            {billingLoading ? (
              <div className="text-sm text-slate-400">Loading invoices...</div>
            ) : invoiceRows.length === 0 ? (
              <div className="text-sm text-slate-400">No invoices yet</div>
            ) : (
              invoiceRows.map((row, index) => (
                <div key={`${row.title}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-400">{row.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{row.amount}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        row.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : row.status === "Unpaid"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <button className="px-4 py-1.5 rounded-full bg-slate-900 text-white">Recent</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">My transactions</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">Monthly money in</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">Monthly money out</button>
          </div>
          <div className="text-xs text-slate-400">Transactions</div>
        </div>
        <div className="flex flex-col border border-slate-200 rounded-3xl bg-white overflow-hidden">
          {/* ===== FIXED HEADER ===== */}
          <div className="flex-none overflow-x-auto bg-slate-50">
            <table className="min-w-full table-fixed">
              <TableColGroup />

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Sn
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Campaign Name
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Source
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Integration
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Clicks
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Safe
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Money
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Created on
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* ===== SCROLLABLE BODY ===== */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar max-h-[300px]">
            <table className="min-w-full table-fixed divide-y divide-slate-200 border-t border-slate-200">
              <TableColGroup />
              {renderTableContent()}
            </table>
          </div>

          {/* ===== FIXED FOOTER ===== */}
          <div className="flex-none bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            {/* LEFT */}
            <span className="text-sm text-slate-500">
              Showing{" "}
              <span className="text-slate-900 font-medium">
                {startItem}-{endItem}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-medium">{totalRecords}</span>{" "}
              campaigns
            </span>

            {/* RIGHT  Numbered Pagination */}
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === 1
                    ? "text-slate-400 border-slate-200 cursor-not-allowed"
                    : "text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded border cursor-pointer ${
                      page === currentPage
                        ? "bg-slate-900 text-white border-slate-900"
                        : "text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === totalPages
                    ? "text-slate-400 border-slate-200 cursor-not-allowed"
                    : "text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* To-do */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[220px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-900 font-semibold">To do</h4>
            <div className="text-slate-400 text-sm">Reminders list</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px]">
            {/*  Search */}
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 mb-3"
              placeholder="Search tasks"
            />

            {/*  Add Task */}
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700"
                placeholder="Write new task..."
              />
              <button
                onClick={handleAddTask}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Add
              </button>
            </div>

            {/*  Task List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">
                  No tasks found
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-lg"
                  >
                    <div
                      onClick={() => handleToggleComplete(task.id)}
                      className={`cursor-pointer text-sm ${
                        task.completed
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {task.text}
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-rose-500 text-xs hover:text-rose-600"
                    >
                      X
                    </button>
                  </div>
                ))
              )}
            </div>

            {/*  Task Count */}
            <div className="mt-3 text-slate-400 text-xs text-right">
              {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Click Metrics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[220px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-900 font-semibold">
              Click Metrics - Realtime Logs
            </h4>
            <div className="text-slate-400 text-sm">
              Recent activity in 10 days
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            {loading ? (
              <p className="text-center text-slate-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/*  Total Clicks */}
                <div className="text-center">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl inline-block">
                    <div className="text-2xl font-semibold text-slate-900">
                      {clickSummary.totalClicks}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">
                    Total Clicks
                  </div>
                </div>

                {/*  Safe Clicks */}
                <div className="text-center">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl inline-block">
                    <div className="text-2xl font-semibold text-slate-900">
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


