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

      // Keep latest 30 days for range filtering
      const last30DaysData = rawData.slice(-30);

      // Chart data
      const formattedData = last30DaysData.map((item) => ({
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
  const StatStarStack = () => (
    <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
      <svg
        className="svg-inline--fa fa-square fa-stack-2x fa-stack-square"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="square"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.1875em 0.75em", color: "#90D67F" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(-128, 128)  scale(1, 1)  rotate(-10 0 0)">
            <path
              fill="currentColor"
              d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-circle fa-stack-2x fa-stack-circle stack-circle text-stats-circle-success"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="circle"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ transformOrigin: "0.6875em 0.25em" }}
      >
        <g transform="translate(256 256)">
          <g transform="translate(96, -128)  scale(1.125, 1.125)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
              transform="translate(-256 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-star fa-stack-1x text-success fa-stack-star"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="star"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        style={{ transformOrigin: "0.9375em 0em" }}
      >
        <g transform="translate(288 256)">
          <g transform="translate(192, -256)  scale(0.875, 0.875)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
              transform="translate(-288 -256)"
            />
          </g>
        </g>
      </svg>
    </span>
  );

  const StatPauseStack = () => (
    <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
      <svg
        className="svg-inline--fa fa-square fa-stack-2x fa-stack-square"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="square"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.1875em 0.75em", color: "#FFCC85" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(-128, 128)  scale(1, 1)  rotate(-10 0 0)">
            <path
              fill="currentColor"
              d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-circle fa-stack-2x fa-stack-circle stack-circle text-stats-circle-warning"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="circle"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ transformOrigin: "0.6875em 0.25em" }}
      >
        <g transform="translate(256 256)">
          <g transform="translate(96, -128)  scale(1.125, 1.125)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
              transform="translate(-256 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-play fa-stack-1x text-warning"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="play"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.6875em 0em" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(192, -256)  scale(0.875, 0.875)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 41.6V470.4c0 35.5 43.8 51.9 72.4 34.9l352-208.1c28.6-16.9 28.6-58.6 0-75.5z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
    </span>
  );

  const StatBlockStack = () => (
    <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
      <svg
        className="svg-inline--fa fa-square fa-stack-2x fa-stack-square"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="square"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.1875em 0.75em", color: "#F48270" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(-128, 128)  scale(1, 1)  rotate(-10 0 0)">
            <path
              fill="currentColor"
              d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-circle fa-stack-2x fa-stack-circle stack-circle text-stats-circle-danger"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="circle"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ transformOrigin: "0.6875em 0.25em" }}
      >
        <g transform="translate(256 256)">
          <g transform="translate(96, -128)  scale(1.125, 1.125)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
              transform="translate(-256 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-xmark fa-stack-1x text-danger"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="xmark"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        style={{ transformOrigin: "0.75em 0em" }}
      >
        <g transform="translate(192 256)">
          <g transform="translate(192, -256)  scale(0.875, 0.875)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              transform="translate(-192 -256)"
            />
          </g>
        </g>
      </svg>
    </span>
  );

  const StatAllowStack = () => (
    <span className="fa-stack" style={{ minHeight: 46, minWidth: 46 }}>
      <svg
        className="svg-inline--fa fa-square fa-stack-2x fa-stack-square"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="square"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.1875em 0.75em", color: "#90D67F" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(-128, 128)  scale(1, 1)  rotate(-10 0 0)">
            <path
              fill="currentColor"
              d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-circle fa-stack-2x fa-stack-circle stack-circle text-stats-circle-success"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="circle"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ transformOrigin: "0.6875em 0.25em" }}
      >
        <g transform="translate(256 256)">
          <g transform="translate(96, -128)  scale(1.125, 1.125)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
              transform="translate(-256 -256)"
            />
          </g>
        </g>
      </svg>
      <svg
        className="svg-inline--fa fa-check fa-stack-1x text-success"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="check"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ transformOrigin: "0.75em 0em" }}
      >
        <g transform="translate(224 256)">
          <g transform="translate(192, -256)  scale(0.875, 0.875)  rotate(0 0 0)">
            <path
              fill="currentColor"
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.2 0z"
              transform="translate(-224 -256)"
            />
          </g>
        </g>
      </svg>
    </span>
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
                        ? "bg-[#2b1f57] text-white"
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
    <div className="min-h-screen text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="dashboard-heading text-left">Viewer Demographics</h2>
            <p className="dashboard-subheading">
              Here is a snapshot of campaign performance and traffic safety.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNewCampaign}
              className="flex items-center px-4 py-2 rounded-xl font-medium text-sm border transition-all duration-200 cursor-pointer bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border transition-all duration-200 cursor-pointer
                ${
                  isRefreshing
                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100"
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
      <div className="h-px w-full bg-[var(--app-border)] mt-6 mb-10" />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] mb-16">
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

        <div className="bg-white/90 border border-slate-200/70 rounded-3xl p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Accounts</h3>
            <button className="h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100">
              ...
            </button>
          </div>
          <div className="space-y-3">
            {accountCards.map((card) => (
              <div key={card.title} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-[0_6px_14px_rgba(15,23,42,0.05)]">
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
          <button className="mt-4 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:bg-slate-100">
            + Create account
          </button>
        </div>
      </div>
      <div className="mt-6 mb-16 h-px w-[calc(100%+48px)] bg-[var(--app-border)] -mx-6" />
      {/* Money movement and invoices removed */}

      <div className="mt-8 border border-slate-200/70 rounded-3xl overflow-hidden bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <button className="px-4 py-1.5 rounded-full bg-[#2b1f57] text-white">Recent</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">My transactions</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">Monthly money in</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600">Monthly money out</button>
          </div>
          <div className="text-xs text-slate-400">Transactions</div>
        </div>
        <div className="flex flex-col border border-slate-200/70 rounded-3xl bg-white overflow-hidden">
          {/* ===== FIXED HEADER ===== */}
          <div className="flex-none overflow-x-auto bg-[#f6f5fb]">
            <table className="min-w-full table-fixed">
              <TableColGroup />

              <thead className="bg-[#f6f5fb]">
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
          <div className="flex-none bg-[#f6f5fb] border-t border-slate-200 px-6 py-3 flex items-center justify-between">
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
                        ? "bg-[#2b1f57] text-white border-[#2b1f57]"
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
        <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-6 min-h-[220px] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-900 font-semibold">To do</h4>
            <div className="text-slate-400 text-sm">Reminders list</div>
          </div>

          <div className="bg-[#f6f5fb] border border-slate-200/70 rounded-xl p-4 min-h-[120px]">
            {/*  Search */}
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/70 px-3 py-2 rounded-lg text-slate-700 mb-3"
              placeholder="Search tasks"
            />

            {/*  Add Task */}
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 w-full bg-white/90 border border-slate-200/70 px-3 py-2 rounded-lg text-slate-700"
                placeholder="Write new task..."
              />
              <button
                onClick={handleAddTask}
                className="bg-[#2b1f57] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#241a4a]"
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
                    className="flex items-center justify-between bg-white/90 border border-slate-200/70 px-3 py-2 rounded-lg"
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
        <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-6 min-h-[220px] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
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
 


    </div>
  );
};

export default Dashboard;








