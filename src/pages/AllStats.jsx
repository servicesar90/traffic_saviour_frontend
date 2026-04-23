import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, ZoomControl } from "react-leaflet";
import { Pencil, Copy, Trash2 } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartRangeDays, setChartRangeDays] = useState(10);
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
  const [isTodoDrawerOpen, setIsTodoDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerDescription, setDrawerDescription] = useState("");
  const [drawerSubtasks, setDrawerSubtasks] = useState([]);
  const [drawerStatus, setDrawerStatus] = useState("");
  const [drawerDueDate, setDrawerDueDate] = useState("");
  const [drawerReminder, setDrawerReminder] = useState("");
  const [drawerTag, setDrawerTag] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
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
  const [countryPage, setCountryPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const countryTraffic = [
    { country: "India", value: 1240, lat: 20.5937, lng: 78.9629 },
    { country: "United States", value: 980, lat: 37.0902, lng: -95.7129 },
    { country: "United Kingdom", value: 640, lat: 55.3781, lng: -3.4360 },
    { country: "Germany", value: 520, lat: 51.1657, lng: 10.4515 },
    { country: "Brazil", value: 420, lat: -14.2350, lng: -51.9253 },
    { country: "Australia", value: 360, lat: -25.2744, lng: 133.7751 },
  ];

  const maxTrafficValue = Math.max(...countryTraffic.map((c) => c.value));
  const COUNTRIES_PER_PAGE = 5;
  const countryTotalPages = Math.max(
    1,
    Math.ceil(countryTraffic.length / COUNTRIES_PER_PAGE)
  );
  const countryPageSafe = Math.min(countryPage, countryTotalPages);
  const countryStart = (countryPageSafe - 1) * COUNTRIES_PER_PAGE;
  const countryEnd = Math.min(countryStart + COUNTRIES_PER_PAGE, countryTraffic.length);
  const countrySlice = countryTraffic.slice(countryStart, countryEnd);

  const fetchIpClicks = async () => {
    try {
      setLoading(true);
      const res = await apiFunction("get", ipClicks);
      const rawData = res?.data?.data || [];

      const lastDays = rawData.slice(-chartRangeDays);
      const formattedData = lastDays.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        Safe: Number(item.total_s_clicks || 0),
        Money: Number(item.total_m_clicks || 0),
        Total: Number(item.total_t_clicks || 0),
      }));

      setChartData(formattedData);

      const totals = lastDays.reduce(
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
      setChartData([]);
      setClickSummary({ totalClicks: 0, safeClicks: 0, moneyClicks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    try {
      setIsRefreshing(true);
      await Promise.all([fetchIpClicks(), fetchStats(), fetchCampaigns()]);
    } catch (err) {
      // console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
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

  const resetDrawerFields = () => {
    setDrawerTitle("");
    setDrawerDescription("");
    setDrawerSubtasks([]);
    setDrawerStatus("");
    setDrawerDueDate("");
    setDrawerReminder("");
    setDrawerTag("");
    setEditingTaskId(null);
  };

  const handleSaveDrawerTask = () => {
    if (!drawerTitle.trim()) return;

    const now = new Date();
    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                text: drawerTitle.trim(),
                dueDate: drawerDueDate || "",
                status: drawerStatus || "",
                reminder: drawerReminder || "",
                tag: drawerTag || "",
                description: drawerDescription || "",
                subtasks: drawerSubtasks || [],
              }
            : task
        )
      );
    } else {
      const task = {
        id: Date.now(),
        text: drawerTitle.trim(),
        completed: false,
        createdAt: now.toISOString(),
        dueDate: drawerDueDate || "",
        status: drawerStatus || "",
        reminder: drawerReminder || "",
        tag: drawerTag || "",
        description: drawerDescription || "",
        subtasks: drawerSubtasks || [],
      };
      setTasks((prev) => [task, ...prev]);
    }
    resetDrawerFields();
    setIsTodoDrawerOpen(false);
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

  const handleAddSubtask = () => {
    setDrawerSubtasks((prev) => [
      ...prev,
      { id: Date.now(), text: "New subtask", completed: false },
    ]);
  };
  
  const handleToggleSubtask = (id) => {
    setDrawerSubtasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleSubtaskText = (id, value) => {
    setDrawerSubtasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: value } : task))
    );
  };

  const openTodoDrawer = () => {
    resetDrawerFields();
    setIsTodoDrawerOpen(true);
  };

  const handleEditTask = (task) => {
    setDrawerTitle(task.text || "");
    setDrawerDescription(task.description || "");
    setDrawerSubtasks(task.subtasks || []);
    setDrawerStatus(task.status || "");
    setDrawerDueDate(task.dueDate || "");
    setDrawerReminder(task.reminder || "");
    setDrawerTag(task.tag || "");
    setEditingTaskId(task.id);
    setIsTodoDrawerOpen(true);
  };


  //  Filtered tasks by search
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskDateLabel = (task) => {
    const dateSource = task.dueDate || task.createdAt;
    if (!dateSource) return "";
    const date = new Date(dateSource);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTaskTimeLabel = (task) => {
    if (!task.createdAt) return "";
    const date = new Date(task.createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTaskStatusLabel = (task) => {
    const status = (task.status || "").toLowerCase();
    if (status === "inprogress") return "ON PROCESS";
    if (status === "done") return "COMPLETED";
    if (status === "todo") return "DRAFT";
    return "DRAFT";
  };

  const getTaskStatusClass = (task) => {
    const status = (task.status || "").toLowerCase();
    if (status === "inprogress") {
      return "bg-[#E0F2FE] text-[#0B6AD6] border-[#7CC3FF]";
    }
    if (status === "done") {
      return "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]";
    }
    return "bg-[#E8EEFF] text-[#2B5BFF] border-[#8DA2FF]";
  };

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
  const StatStack = ({ squareColor, circleColor, iconColor, iconPath, iconViewBox = "0 0 24 24" }) => (
    <span className="stat-stack-icon" aria-hidden="true">
      <span className="stat-stack-square" style={{ backgroundColor: squareColor }} />
      <span className="stat-stack-circle" style={{ backgroundColor: circleColor }}>
        <svg viewBox={iconViewBox} className="stat-stack-glyph" style={{ color: iconColor }}>
          <path fill="currentColor" d={iconPath} />
        </svg>
      </span>
    </span>
  );

  const StatStarStack = () => (
    <StatStack
      squareColor="#90D67F"
      circleColor="#D9FBD0"
      iconColor="#22c55e"
      iconPath="M12 2.75l2.82 5.72 6.31.92-4.57 4.46 1.08 6.3L12 17.2l-5.64 2.96 1.08-6.3-4.57-4.46 6.31-.92L12 2.75z"
    />
  );

  const StatPauseStack = () => (
    <StatStack
      squareColor="#FFCC85"
      circleColor="#FFEFCA"
      iconColor="#f59e0b"
      iconPath="M8 5.5v13l10-6.5-10-6.5z"
    />
  );

  const StatBlockStack = () => (
    <StatStack
      squareColor="#F48270"
      circleColor="#FFE0DB"
      iconColor="#ef4444"
      iconPath="M7.05 7.05a1 1 0 011.41 0L12 10.59l3.54-3.54a1 1 0 111.41 1.41L13.41 12l3.54 3.54a1 1 0 01-1.41 1.41L12 13.41l-3.54 3.54a1 1 0 01-1.41-1.41L10.59 12 7.05 8.46a1 1 0 010-1.41z"
    />
  );

  const StatAllowStack = () => (
    <StatStack
      squareColor="#90D67F"
      circleColor="#D9FBD0"
      iconColor="#22c55e"
      iconPath="M9.2 16.2L4.8 11.8a1 1 0 111.4-1.4l3 3 8.6-8.6a1 1 0 011.4 1.4l-10 10a1 1 0 01-1.4 0z"
    />
  );

  const StatItem = ({ icon, value, label }) => (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h4 className="text-[20px] leading-[20px] text-[#121824] font-bold text-left">
          {value}
        </h4>
        <p className="text-[0.8rem] leading-none text-[#3e465b] font-normal mt-1">
          {label}
        </p>
      </div>
    </div>
  );

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          borderStyle: "solid",
          whiteSpace: "nowrap",
          boxShadow: "rgba(0, 0, 0, 0.2) 1px 2px 10px",
          backgroundColor: "rgb(239, 242, 246)",
          borderWidth: "1px",
          borderRadius: "4px",
          color: "rgb(20, 24, 36)",
          fontSize: 14,
          lineHeight: "21px",
          padding: 10,
          borderColor: "rgb(203, 208, 221)",
        }}
      >
        <div className="ms-1">
          {payload.map((entry, idx) => (
            <div
              key={`${entry.dataKey}-${idx}`}
              className={idx === payload.length - 1 ? "mb-0" : ""}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: entry.color,
                  display: "inline-block",
                }}
              />
              <span>
                {label} : {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const demo30Days = Array.from({ length: 30 }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const safe = 80 + Math.round(Math.sin((i + 1) / 3) * 60 + i * 4);
    const money = 40 + Math.round(Math.cos((i + 1) / 4) * 40 + i * 3);
    return { date: `${day} May`, Safe: safe, Money: money };
  });

  const baseSeriesFull = chartData?.length ? chartData : demo30Days;
  const baseSeries = baseSeriesFull.slice(-chartRangeDays);
  const rangeTotalClicks = baseSeries.reduce((sum, point) => {
    const safe = Number(point.Safe || 0);
    const money = Number(point.Money || 0);
    return sum + safe + money;
  }, 0);
  const rangeSafeClicks = baseSeries.reduce(
    (sum, point) => sum + Number(point.Safe || 0),
    0
  );
  const rangeMoneyClicks = baseSeries.reduce(
    (sum, point) => sum + Number(point.Money || 0),
    0
  );
  const safePercent = rangeTotalClicks
    ? Math.round((rangeSafeClicks / rangeTotalClicks) * 100)
    : 0;
  const moneyPercent = rangeTotalClicks
    ? Math.round((rangeMoneyClicks / rangeTotalClicks) * 100)
    : 0;

  const denseSeries = baseSeries.flatMap((d, i) => {
    if (i === baseSeries.length - 1) return [d];
    const next = baseSeries[i + 1];
    return [
      d,
      {
        date: `${d.date} `,
        Safe: Math.round((d.Safe + next.Safe) / 2),
        Money: Math.round((d.Money + next.Money) / 2),
        _ghost: true,
      },
    ];
  });

  const labelSet = new Set(baseSeries.map((d) => d.date));

  const miniBarSeries = baseSeries.map((d) => {
    const safe = Number(d.Safe || 0);
    const money = Number(d.Money || 0);
    return safe + money;
  });
  const miniBarMax = Math.max(1, ...miniBarSeries);

  const StatCard = ({
    value,
    title,
    subtitle = "Since last week",
    badge = "13.4%",
    tone,
    lineColor = "#5b6ff3",
    badgeBg = "bg-white/90",
    badgeText = "text-emerald-600",
    rightNode,
  }) => (
    <div
      className={`rounded-[14px] p-4 min-h-[108px] shadow-[0_10px_22px_rgba(31,41,55,0.08)] border border-white/80 ${tone}`}
    >
      <div className="text-[12px] text-slate-500 mb-2">{title}</div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[24px] leading-tight font-semibold text-slate-900 tracking-tight">
            {value}
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="text-[12px] text-slate-500">{subtitle}</span>
            <span className={`text-[11px] font-semibold ${badgeText} ${badgeBg} border border-white/70 px-2 py-[2px] rounded-full inline-flex items-center gap-1`}>
              {badge}
              <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                <path d="M5 2 L8 6 H2 L5 2 Z" fill="currentColor" />
              </svg>
            </span>
          </div>
        </div>
        {rightNode ? (
          <div className="mt-1">{rightNode}</div>
        ) : (
          <svg width="60" height="26" viewBox="0 0 60 26" fill="none">
            <path
              d="M2 18 C 9 12, 15 16, 21 10 C 27 5, 31 14, 37 8 C 43 3, 50 8, 58 6"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
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
          className="block w-full text-left px-4 py-2 text-sm text-slate-700 text-xs hover:bg-slate-100 transition duration-100 cursor-pointer"
        >
          Edit Campaign
        </button>
        <button
          onClick={() => handleActionSelect("duplicate", campaignId, row)}
          className="block w-full text-left px-4 py-2 text-sm text-slate-700 text-xs hover:bg-slate-100 transition duration-100 cursor-pointer"
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
      <col className="w-24" />
      <col className="w-24" />
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
      <tbody className="bg-white divide-y divide-[#d5d9e4]">
        {campaigns.map((item, index) => {
          const campaignId = item.campaign_info?.campaign_id || index;
          const isDropdownOpen = openDropdownId === item?.uid;
          return (
            <>
              <tr
                key={item.campaignId}
                className="odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
              >
                <td className="px-3 py-1.5 text-sm  text-left text-slate-600">
                  {index + 1}
                </td>
                <td className="px-3 py-1.5 text-sm text-left text-slate-900 font-medium">
                  {item.campaign_info?.campaignName}
                </td>
                <td className="px-3 py-1.5 text-sm text-left text-slate-600">
                  {item.campaign_info?.trafficSource}
                </td>
                <td className="px-3 py-1.5 text-sm text-left">
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Active")}
                    className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Active" ? "text-[#f97316]"
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
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs group-hover:block z-50">Active</span>
                  </button>

                  {/*  Boost */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Allow")}
                    className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Allow" ? "text-[#16a34a]"
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
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs group-hover:block z-50">Allow</span>
                  </button>

                  {/*  Block */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Block")}
                    className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${
          item.statusLoading
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          item.status === "Block" ? "text-[#dc2626]"
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
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs group-hover:block z-50">Block</span>
                  </button>
                </td>
                <td className="px-3 py-1.5 text-sm text-left ">
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
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-700 text-xs text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200">
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
                <td className="px-3 py-1.5 text-sm text-slate-600 text-center">
                  {item?.campclicks?.total_t_clicks || 0}
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap text-sm text-slate-600 text-right w-24">
                  <div className="ml-auto w-fit inline-flex items-center gap-1 relative group">
                    {/* i Icon */}
                    <svg
                      className="h-3 w-3 text-blue-400 cursor-pointer"
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
      hidden group-hover:block bg-white text-slate-700 text-xs text-xs 
      px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200"
                    >
                      {item?.safe_page || "No URL Found"}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-1.5 whitespace-nowrap text-sm text-slate-600 text-right w-24">
                  <div className="ml-auto w-fit inline-flex items-center gap-1 relative group">
                    {/* i Icon */}
                    <svg
                      className="h-3 w-3 text-blue-400 cursor-pointer"
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
      hidden group-hover:block bg-white text-slate-700 text-xs text-xs 
      px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-200"
                    >
                      {item?.money_page?.[0]?.url || "No URL Found"}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-1.5 text-sm text-slate-600 text-left">
                  {new Date(item.date_time).toLocaleString()}
                </td>
                <td className="px-3 py-1.5 text-sm">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="relative group">
                      <button
                        onClick={() => handleActionSelect("edit", item?.uid, item)}
                        className="p-1 rounded hover:bg-slate-100 text-[#7c8698] cursor-pointer transition-transform duration-150 hover:scale-110 hover:text-slate-700 text-xs"
                        aria-label="Edit"
                      >
                        <Pencil size={18} strokeWidth={2.25} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs shadow-sm group-hover:block z-50">
                        Edit
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => handleActionSelect("duplicate", item?.uid, item)}
                        className="p-1 rounded hover:bg-slate-100 text-[#7c8698] cursor-pointer transition-transform duration-150 hover:scale-110 hover:text-slate-700 text-xs"
                        aria-label="Duplicate"
                      >
                        <Copy size={18} strokeWidth={2.25} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs shadow-sm group-hover:block z-50">
                        Duplicate
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => handleActionSelect("delete", item?.uid, null)}
                        className="p-1 rounded hover:bg-rose-50 text-red-500 cursor-pointer transition-transform duration-150 hover:scale-110 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={18} strokeWidth={2.25} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 text-xs shadow-sm group-hover:block z-50">
                        Delete
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col justify-between items-start gap-4">
          <div>
            <h2 className="dashboard-heading text-left">Viewer Demographics</h2>
            <p className="dashboard-subheading">
              Here is a snapshot of campaign performance and traffic safety.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddNewCampaign}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              <svg
                className="h-3 w-3"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border transition-all duration-200
                ${
                  isRefreshing
                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed opacity-80"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                }
              `}
            >
              <svg
                className={`h-3 w-3 transition-transform duration-300 ${isRefreshing ? "animate-spin" : ""}`}
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
            <div className="hidden lg:flex items-center gap-2" />
          </div>
        </div>

      </div>

     {/* Top Stats */}
      <div className="mb-8 flex flex-wrap items-center gap-8">
        <StatItem
          icon={<StatStarStack />}
          value={stats.total_campaigns}
          label="All campaigns"
        />
        <StatItem
          icon={<StatPauseStack />}
          value={stats.active_campaigns}
          label="Active campaigns"
        />
        <StatItem
          icon={<StatAllowStack />}
          value={stats.allowed_campaigns}
          label="Allow campaigns"
        />
        <StatItem
          icon={<StatBlockStack />}
          value={stats.blocked_campaigns}
          label="Block campaigns"
        />
      </div>
      <hr
        className="w-full mt-6 mb-10"
        style={{ border: 0, borderTop: "1px solid #d5d9e4", height: 0 }}
      />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr] mb-16">
        <div className="bg-[#F5F7FA] rounded-3xl p-6 shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">Traffic Clicks</h3>
              <p className="text-[#525b75] leading-[1.2] text-sm">
                Safe and money page clicks over the last {chartRangeDays} days
              </p>
            </div>
            <div className="w-full sm:w-auto text-left">
              <select
                value={chartRangeDays}
                onChange={(e) => setChartRangeDays(Number(e.target.value))}
                className="rounded-sm border border-[#CBD0DD] bg-white px-4 py-1.5 text-xs text-[#4b5565] w-48"
              >
                <option value={10}>Last 10 days</option>
                <option value={15}>Last 15 days</option>
              </select>
            </div>
          </div>

          <div className="bg-[#F5F7FA]" style={{ width: "100%", height: 280 }}>
            {loading ? (
              <p className="text-center text-slate-400 mt-6">Loading...</p>
            ) : (
              <ResponsiveContainer>
                  <LineChart
                  data={denseSeries}
                  margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#E3E6ED" strokeOpacity={1} strokeDasharray="0" horizontal={false} vertical={true} />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#5f6b84", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(value) => (labelSet.has(value) ? value : "")}
                    tickLine={false}
                    axisLine={{ stroke: "#CBD0DD", strokeWidth: 1, strokeOpacity: 1, strokeDasharray: "0" }}
                    height={28}
                    tickMargin={10}
                    interval={0}
                    padding={{ left: 0, right: 0 }}
                  />

                  <YAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    width={0}
                  />

                  <Tooltip content={<ChartTooltip />} cursor={false} />

                  <Line
                    type="linear"
                    dataKey="Safe"
                    stroke="#3874FF"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    type="linear"
                    dataKey="Money"
                    stroke="#0097EB"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-3 flex items-center gap-6 text-sm text-[#5f6b84]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#3874FF" }} />
              <span>Safe page clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#0097EB" }} />
              <span>Money page clicks</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {/* Mini Card 1 */}
          <div className="bg-white border border-slate-200/70 rounded-md p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Total clicks</p>
                <p className="text-xs text-slate-400">Last {chartRangeDays} days</p>
              </div>
              <div className="text-lg font-semibold text-slate-900">
                {rangeTotalClicks.toLocaleString("en-US")}
              </div>
            </div>
            <div className="mt-4 h-20 px-3">
              {(() => {
                const barWidth = 4;
                const gap = miniBarSeries.length > 10 ? 4 : 8;
                const totalWidth =
                  miniBarSeries.length * barWidth +
                  Math.max(0, miniBarSeries.length - 1) * gap +
                  12;
                return (
                  <svg viewBox={`0 0 ${totalWidth} 60`} className="w-full h-full">
                    <g transform="translate(6,4)">
                      {miniBarSeries.map((value, idx) => {
                        const x = idx * (barWidth + gap);
                        const height = Math.max(8, Math.round((value / miniBarMax) * 50));
                        const y = 54 - height;
                        const isSafe = idx % 2 !== 0;
                        const label = isSafe ? "Safe" : "Money";
                        return (
                          <rect
                            key={`mini-bar-${idx}`}
                            x={x}
                            y={y}
                            width={barWidth}
                            height={height}
                            rx="3"
                            fill={isSafe ? "#3874FF" : "#0097EB"}
                          >
                            <title>{`${label}: ${value}`}</title>
                          </rect>
                        );
                      })}
                    </g>
                  </svg>
                );
              })()}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-4 rounded-sm bg-[#3874FF]" />
                  Safe
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-4 rounded-sm bg-[#0097EB]" />
                  Money
                </span>
              </span>
              <span>{chartRangeDays}d</span>
            </div>
          </div>

          {/* Mini Card 2 */}
          <div className="bg-white border border-slate-200/70 rounded-md p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">New traffic</p>
                <p className="text-xs text-slate-400">Last {chartRangeDays} days</p>
              </div>
              <div className="text-lg font-semibold text-slate-900">356</div>
            </div>
            <div className="mt-4 h-20">
              <svg viewBox="0 0 140 50" className="w-full h-full">
                <polyline
                  points="4,36 24,34 42,28 60,30 78,24 96,12 114,18 134,8"
                  fill="none"
                  stroke="#3874FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="4,40 24,38 42,34 60,36 78,32 96,26 114,28 134,24"
                  fill="none"
                  stroke="#D6E2FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>01 May</span>
              <span>07 May</span>
            </div>
          </div>

          {/* Mini Card 3 */}
          <div className="bg-white border border-slate-200/70 rounded-md p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Safe share</p>
                <p className="text-xs text-slate-400">Last {chartRangeDays} days</p>
              </div>
              <div className="text-xs text-slate-500">{safePercent}%</div>
            </div>
            <div className="mt-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 60 60" className="h-22 w-22">
                <circle cx="30" cy="30" r="24" stroke="#E7EDF9" strokeWidth="4" fill="none" />
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  stroke="#3874FF"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="151"
                  strokeDashoffset={151 - (151 * safePercent) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="34" textAnchor="middle" fontSize="12" fill="#2b1f57" fontWeight="700">
                  {safePercent}%
                </text>
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Safe</span>
              <span>of total</span>
            </div>
          </div>

          {/* Mini Card 4 */}
          <div className="bg-white border border-slate-200/70 rounded-md p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Money share</p>
                <p className="text-xs text-slate-400 text-left">Last {chartRangeDays} days</p>
              </div>
              <div className="text-xs text-slate-500">{moneyPercent}%</div>
            </div>
            <div className="mt-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 60 60" className="h-22 w-22">
                <circle cx="30" cy="30" r="24" stroke="#E7EDF9" strokeWidth="4" fill="none" />
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  stroke="#0097EB"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="151"
                  strokeDashoffset={151 - (151 * moneyPercent) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="34" textAnchor="middle" fontSize="12" fill="#2b1f57" fontWeight="700">
                  {moneyPercent}%
                </text>
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Money</span>
              <span>of total</span>
            </div>
          </div>
        </div>
      </div>
      <hr
        className="mt-6 w-[calc(100%+48px)] -mx-6"
        style={{ border: 0, borderTop: "1px solid var(--app-border)", height: 0 }}
      />
      {/* Money movement and invoices removed */}

      <div className="bg-white -mx-6 px-6 pt-10">
        <div className="flex items-start justify-between gap-4 px-0 py-4 bg-white">
          <div>
            <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">
              Campaign Performance
            </h3>
            <p className="text-[#525b75] leading-[1.2] text-sm text-left">
              A quick view of traffic safety, clicks, and status.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm" />
        </div>

        <div className="overflow-hidden bg-white">
          <hr
            className="w-full"
            style={{ border: 0, borderTop: "1px solid #d5d9e4", height: 0 }}
          />
          <div className="flex flex-col bg-white overflow-hidden">
            {/* ===== FIXED HEADER ===== */}
            <div className="flex-none overflow-x-auto bg-white" style={{ borderLeft: 0, borderRight: 0 }}>
              <table className="min-w-full table-fixed">
                <TableColGroup />

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Campaign
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Source
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Integration
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Clicks
                    </th>
                    <th className="px-3 py-2 text-center text-[13px] font-extrabold text-[#31374A] uppercase">
                      Safe
                    </th>
                    <th className="px-3 py-2 text-center text-[13px] font-extrabold text-[#31374A] uppercase">
                      Money
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Created
                    </th>
                    <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

          {/* ===== SCROLLABLE BODY ===== */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar max-h-[300px] border-y border-[#d5d9e4]" style={{ borderLeft: 0, borderRight: 0 }}>
            <table className="min-w-full table-fixed">
              <TableColGroup />
              {renderTableContent()}
            </table>
          </div>

          {/* ===== FIXED FOOTER ===== */}
          <div className="flex-none bg-white px-4 py-3 flex items-center justify-between">
            {/* LEFT */}
            <div className="text-sm text-slate-500 flex items-center gap-4">
              <span>
                {startItem} to {endItem} items of {totalRecords}
              </span>
            </div>

            {/* RIGHT  Minimal Pagination */}
            <div className="flex items-center gap-4 text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`flex items-center gap-1 ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                }`}
              >
                <span className="text-lg leading-none">‹</span> Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                }`}
              >
                Next <span className="text-lg leading-none">›</span>
              </button>
            </div>
          </div>
          
          </div>
        </div>

        <hr
          className="mt-16 w-[calc(100%+48px)] -mx-6"
          style={{ border: 0, borderTop: "1px solid var(--app-border)", height: 0 }}
        />
      </div>

      {/* Traffic by Country */}
      <div className="mt-0 -mx-6 bg-[var(--app-bg)] py-0">
        <div className="grid gap-0 grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Left list + header */}
          <div className="px-6 py-10 min-h-[380px]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">
                  Traffic by Country
                </h3>
                <p className="text-[#525b75] leading-[1.2] text-sm text-left">
                  Dummy data preview for geography-based traffic.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {countrySlice.map((row) => (
                <div key={row.country} className="flex items-center gap-4">
                  <div className="w-28 text-xs text-slate-700 text-xs">{row.country}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#3874FF]"
                      style={{ width: `${Math.round((row.value / maxTrafficValue) * 100)}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs text-slate-500">
                    {row.value.toLocaleString("en-US")}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <div>
                {countryTraffic.length === 0
                  ? "0 items"
                  : `${countryStart + 1} to ${countryEnd} items of ${countryTraffic.length}`}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <button
                  disabled={countryPageSafe === 1}
                  onClick={() => setCountryPage((p) => Math.max(1, p - 1))}
                  className={`flex items-center gap-1 ${
                    countryPageSafe === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  }`}
                >
                  <span className="text-lg leading-none"></span> Previous
                </button>
                <button
                  disabled={countryPageSafe === countryTotalPages}
                  onClick={() =>
                    setCountryPage((p) => Math.min(countryTotalPages, p + 1))
                  }
                  className={`flex items-center gap-1 ${
                    countryPageSafe === countryTotalPages
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  }`}
                >
                  Next <span className="text-lg leading-none"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Right map */}
          <div className="relative border-l border-slate-200/70 border-y-0 bg-[#F7F9FC] p-0 overflow-hidden h-[380px]">
            <MapContainer
              center={[20, 10]}
              zoom={2}
              zoomControl={false}
              style={{ height: "100%", width: "100%" }}
            >
              <ZoomControl position="topleft" />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution=""
              />
              {countryTraffic.map((row) => {
                const radius = Math.max(
                  6,
                  Math.round((row.value / maxTrafficValue) * 16)
                );
                return (
                  <CircleMarker
                    key={row.country}
                    center={[row.lat, row.lng]}
                    radius={radius}
                    pathOptions={{
                      color: "#3874FF",
                      fillColor: "#3874FF",
                      fillOpacity: 0.35,
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -6]} opacity={1}>
                      {row.country}: {row.value.toLocaleString("en-US")}
                    </LeafletTooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>
        <hr
          className="mt-0 w-full"
          style={{ border: 0, borderTop: "1px solid var(--app-border)", height: 0 }}
        />
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        {/* To-do */}
        <div className="bg-[var(--app-bg)] rounded-2xl p-3 min-h-[220px] shadow-none">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">
                Todo list <span className="font-normal">({tasks.length})</span>
              </h3>
              <p className="text-[#525b75] leading-[1.2] text-sm text-left">
                Your tasks and reminders at a glance.
              </p>
            </div>
            <button
              type="button"
              onClick={openTodoDrawer}
              className="text-[#3874FF] text-[14px] font-semibold flex items-center gap-1 hover:text-[#2f63d6] cursor-pointer"
            >
              <span className="text-base leading-none">+</span>
              Add new task
            </button>
          </div>
          <div className="relative mt-3 mb-2 max-w-[300px]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/70 pl-9 pr-3 py-1.5 rounded-md text-slate-700 text-xs"
              type="search"
              placeholder="Search tasks"
              aria-label="Search"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400"
              aria-hidden="true"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </div>

          <div className="bg-[#f6f5fb] rounded-xl pt-2 pb-3 pr-4 pl-0 min-h-[120px] overflow-x-hidden">
            {/*  Task List */}
            <div className="h-[220px] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {filteredTasks.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">No tasks found</p>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id}>
                    <div className="flex items-center justify-between gap-3 py-3 text-left">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="h-4 w-4 shrink-0"
                        />
                        <div
                          className={`text-sm truncate ${
                            task.completed
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                          title={task.text}
                        >
                          {task.text}
                        </div>
                        <span
                          className={`ml-2 text-[10px] uppercase font-semibold px-2 py-0.5 border rounded-full whitespace-nowrap ${getTaskStatusClass(
                            task
                          )}`}
                        >
                          {getTaskStatusLabel(task)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path
                              fill="currentColor"
                              d="M16.5 6.5h-6A4.5 4.5 0 0 0 6 11v6a3 3 0 0 0 3 3h6a4.5 4.5 0 0 0 4.5-4.5v-6a3 3 0 0 0-3-3Zm1.5 9a3 3 0 0 1-3 3H9a1.5 1.5 0 0 1-1.5-1.5v-6A3 3 0 0 1 10.5 8h6A1.5 1.5 0 0 1 18 9.5v6Zm-3.75-9.5 1.25-1.25-1.06-1.06L12 5.19 9.56 2.75 8.5 3.81 10.94 6.25h3.31Z"
                            />
                          </svg>
                          <span>{task.subtasks?.length || 0}</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path
                              fill="currentColor"
                              d="M20 4H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3v3l4-3h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 13H10.5L8 19v-2H4V6h16v11Z"
                            />
                          </svg>
                          <span>0</span>
                        </div>
                        {getTaskDateLabel(task) && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>{getTaskDateLabel(task)}</span>
                          </>
                        )}
                        {getTaskTimeLabel(task) && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>{getTaskTimeLabel(task)}</span>
                          </>
                        )}
                        <div className="flex items-center gap-2 ml-2">
                          <div className="relative group">
                            <button
                              type="button"
                              onClick={() => handleEditTask(task)}
                              className="text-slate-500 hover:text-slate-700 cursor-pointer"
                              aria-label="Edit task"
                            >
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
                                <path d="M8.5 15.5l.7-3.1 5.8-5.8 2.4 2.4-5.8 5.8-3.1.7Z" />
                                <path d="M13.6 6.9l2.4 2.4" />
                              </svg>
                            </button>
                            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                              Edit
                            </span>
                          </div>
                          <div className="relative group">
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-rose-500 hover:text-rose-600 cursor-pointer"
                              aria-label="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                              Delete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr
                      className="w-full"
                      style={{ border: 0, borderTop: "1px solid var(--app-border)", height: 0 }}
                    />
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
        <div className="bg-[var(--app-bg)] rounded-2xl p-3 min-h-[220px] shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-900 font-semibold">
              Click Metrics - Realtime Logs
            </h4>
            <div className="text-slate-400 text-sm">
              Recent activity in 10 days
            </div>
          </div>

          <div className="bg-[#f6f5fb] border border-slate-200/70 rounded-xl p-6">
            {loading ? (
              <p className="text-center text-slate-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/*  Total Clicks */}
                <div className="text-center">
                  <div className="bg-white/90 border border-slate-200/70 p-4 rounded-xl inline-block shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
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
                  <div className="bg-white/90 border border-slate-200/70 p-4 rounded-xl inline-block shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
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
 


          {/* Todo Drawer */}
      <div className={`fixed inset-0 z-[9999] ${isTodoDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isTodoDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsTodoDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[360px] bg-[#F3F6FA] shadow-2xl transition-transform duration-300 flex flex-col ${isTodoDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between p-5">
            <input
              value={drawerTitle}
              onChange={(e) => setDrawerTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 min-w-0 bg-transparent text-lg font-semibold text-slate-900 outline-none"
            />
            <button
              onClick={() => setIsTodoDrawerOpen(false)}
              className="ml-3 h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:text-slate-800 shrink-0"
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

          <div className="px-5 pb-6 space-y-6 flex-1 overflow-y-auto">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 inline-flex items-center gap-2">
                Description
              </label>
              <textarea
                value={drawerDescription}
                onChange={(e) => setDrawerDescription(e.target.value)}
                rows={5}
                placeholder="Add description..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700"
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">Subtasks</div>
              <div className="space-y-3">
                {drawerSubtasks.length === 0 ? (
                  <div className="text-xs text-slate-400">No subtasks yet.</div>
                ) : (
                  drawerSubtasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 pb-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleSubtask(task.id)}
                        className="h-4 w-4"
                      />
                      <input
                        value={task.text}
                        onChange={(e) => handleSubtaskText(task.id, e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
                        placeholder="Subtask title"
                      />
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="mt-3 text-[#3874FF] text-sm font-semibold hover:text-[#2f63d6]"
              >
                + Add subtask
              </button>
            </div>

            <div>
              <div className="text-base font-semibold text-slate-800 mb-3">Others Information</div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="">Select</option>
                    <option value="todo">To do</option>
                    <option value="inprogress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Due Date</label>
                  <input
                    type="date"
                    value={drawerDueDate}
                    onChange={(e) => setDrawerDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Reminder</label>
                  <input
                    value={drawerReminder}
                    onChange={(e) => setDrawerReminder(e.target.value)}
                    placeholder="Reminder"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Tag</label>
                  <input
                    value={drawerTag}
                    onChange={(e) => setDrawerTag(e.target.value)}
                    placeholder="Select organizer..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                </div>
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={handleSaveDrawerTask}
                    className="rounded-lg bg-[#3874FF] px-4 py-2 text-sm text-white hover:bg-[#2f63d6] !text-white cursor-pointer"
                  >
                    {editingTaskId ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
