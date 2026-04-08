import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  createCampaignApi,
  getAllCampaign,
  ipClicks,
  campdata,
  updateCampaignStatus,
  signOutApi
} from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showInfoToast, showSuccessToast } from "../components/toast/toast";
import { Pencil, Copy, Trash2, ChevronLeft, ChevronRight } from "lucide-react";


// Note: TABS definition is kept here for reference

function AllCampaignsDashboard() {
  // --- Existing State ---
  
  const [dateRange, setDateRange] = useState("d/m/y to d/m/y");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const campaignAbortRef = useRef(null);
const ipClickAbortRef = useRef(null);
const statsAbortRef = useRef(null);

  
  const ITEMS_PER_PAGE = 5;

  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });

  const [stats, setStats] = useState({
     total_campaigns: 0,
     active_campaigns: 0,
     blocked_campaigns: 0,
     allowed_campaigns: 0,
   });

  //  NEW STATE for Dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);

  // useRef for Click Outside logic
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // --- API Fetch Function (Unchanged, except for the console.log) ---
  const fetchCampaigns = useCallback(async (page=1) => {
     if (campaignAbortRef.current) {
    campaignAbortRef.current.abort();
  }

  const controller = new AbortController();
  campaignAbortRef.current = controller;

 
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction("get",`${getAllCampaign}?page=${page}&limit=${ITEMS_PER_PAGE}`, null, null, controller.signal);
   if(!response) return;

      // Assume total items is available in response.data.total or we use array length
      const dataRows = response.data.data || [];
      

      setCampaigns(dataRows);
       setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages);
    setTotalRecords(response.data.totalRecords);
      setTotalItems(response.data.total || dataRows.length);
      setIsLoading(false);
    } catch (err) {
 
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



  const fetchIpClicks = async () => {
     if (ipClickAbortRef.current) {
    ipClickAbortRef.current.abort();
  }

  const controller = new AbortController();
  ipClickAbortRef.current = controller;
    try {
      setLoading(true);

      const res = await apiFunction("get", ipClicks, null, null,controller.signal);
      if(!res) return;
      const rawData = res?.data?.data || [];

      const formattedData = rawData.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        Safe: Number(item.total_s_clicks || 0),
        Money: Number(item.total_m_clicks || 0),
        Total: Number(item.total_t_clicks || 0),
      }));

      setChartData(formattedData);

      const totals = rawData.reduce(
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
       if (err?.code === "ERR_CANCELED") return;
    
      setChartData([]);
      setClickSummary({ totalClicks: 0, safeClicks: 0, moneyClicks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
      if (statsAbortRef.current) {
    statsAbortRef.current.abort();
  }

  const controller = new AbortController();
  statsAbortRef.current = controller;
      try {
        const res = await apiFunction("get", campdata, null, null, controller.signal);
   if (!res) return;
        
  
        setStats({
          total_campaigns: res?.data?.data?.total_campaigns || 0,
          active_campaigns: res?.data?.data?.active_campaigns || 0,
          blocked_campaigns: res?.data?.data?.blocked_campaigns || 0,
          allowed_campaigns: res?.data?.data?.allowed_campaigns || 0,
        });
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
    // console.error("Stats API Error:", error);
       
      }
    };


  const handleStatusChange = async (uid, newStatus) => {
  try {
    //  current campaign find karo
    const currentItem = campaigns.find(item => item.uid === uid);
    const oldStatus = currentItem?.status;

    // agar same status pe click hua to kuch mat karo
    if (!currentItem || oldStatus === newStatus) return;

    //  loading UI
    setCampaigns(prev =>
      prev.map(item =>
        item.uid === uid ? { ...item, statusLoading: true } : item
      )
    );

    const data = { status: newStatus };

    //  PATCH API
    const res = await apiFunction( 
      "patch",
      createCampaignApi,
      uid,
      data
    );

    if (!res?.data?.success) {
      showErrorToast("Failed updating status");
      return;
    }

    //  update campaigns list
    setCampaigns(prev =>
      prev.map(item =>
        item.uid === uid
          ? { ...item, status: newStatus, statusLoading: false }
          : item
      )
    );

    //  UPDATE STATS WITHOUT RELOAD
    setStats(prev => {
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

    showSuccessToast(`Status updated  : ${newStatus}`);

  } catch (err) {
    // console.error("Status update error:", err);
    showErrorToast("Something went wrong!");

    //  loading hatao
    setCampaigns(prev =>
      prev.map(item =>
        item.uid === uid ? { ...item, statusLoading: false } : item
      )
    );
  }
};



  useEffect(() => {
  




    fetchCampaigns();
    fetchIpClicks();
    fetchStats();
  }, [fetchCampaigns]);
  

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionSelect = async (action, campaignId, row) => {
    setOpenDropdownId(null);
    switch (action) {
      case "edit":
        navigate("/Dashboard/create-campaign", {
          state: {
            mode: "edit",
            id: row.uid,
            data: row,
          },
        });
        break;
      case "duplicate": {
        try {
          if (!row) return;

          const payload = JSON.parse(JSON.stringify(row));
          delete payload.uid;
          delete payload._id;
          delete payload.createdAt;
          delete payload.updatedAt;
          delete payload.date_time;

          const data = {
            ...payload,
            campaignName:
              (payload.campaign_info?.campaignName || "Campaign") + " (Copy)",
            trafficSource: payload.campaign_info?.trafficSource,
          };

          const res = await apiFunction("post", createCampaignApi, null, data);

          if (res?.data?.status || res?.data?.success) {
            const newCampaign = res.data.data;
            setCampaigns((prev) => [newCampaign, ...prev]);
            showSuccessToast("Campaign duplicated successfully");
            await fetchCampaigns();
            await fetchStats();
          }
        } catch (err) {
          showErrorToast(
            err?.response?.data?.message || "Failed to duplicate campaign"
          );
        }

        break;
      }

      case "delete":
        if (window.confirm("Are you sure you want to delete this campaign?")) {
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
  // --- Existing Handlers ---
 const handleRefresh = async () => {
  if (isRefreshing) return;

  try {
    setIsRefreshing(true);

    await Promise.all([
      fetchCampaigns(),
      fetchStats(),
    ]);
  } catch (err) {
    // console.error(err);
  } finally {
    setTimeout(() => setIsRefreshing(false), 600); // smooth finish
  }
};
 const handlePageChange = (page) => {
  if (page < 1 || page > totalPages) return;
  fetchCampaigns(page);
};

const MAX_VISIBLE_PAGES = 5;

const getVisiblePages = () => {
  let start = Math.max(
    1,
    currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
  );

  let end = start + MAX_VISIBLE_PAGES - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );
};


const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
const endItem = Math.min(
  currentPage * ITEMS_PER_PAGE,
  totalRecords
);


  const handleApplyFilter = () => {
    showInfoToast(
      `Applying filter: Search='${searchTerm}', Date='${dateRange}'. Refetching data...`
    );
  };

  
  const handleAddNewCampaign = () => {
    showInfoToast("Redirecting to Creating New Campaign");
    navigate("/Dashboard/create-campaign");
  };



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
  //  NEW Render Function: Action Dropdown Menu
  const renderActionDropdown = (campaignId, row) => (
    // ref   dropdownRef    wrapper div    click outside  
    <div
      className="fixed right-0 top-full mt-2 w-48 bg-white border border-slate-200 z-20"
      style={{
        zIndex: 9999999, // over ALL elements
        left: dropdownPos.left,
        top: dropdownPos.top, // adjust dynamically if needed
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
        return(
          <>
          <tr key={item.campaignId} className="odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60 transition-colors">
          <td className="px-3 py-1.5 text-sm text-left text-slate-600">{index + 1}</td>
          <td className="px-3 py-1.5 text-sm text-left text-slate-900 font-medium">{item.campaign_info?.campaignName}</td>
          <td className="px-3 py-1.5 text-sm text-left text-slate-600">{item.campaign_info?.trafficSource}</td>
          <td className="px-3 py-1.5 text-left">
             <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Active")}
      className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Active" ? "text-[#f97316]"
          : "text-slate-400 hover:text-slate-600"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M7 4v16l13-8L7 4z"/>
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">Active</span>
    </button>

    {/*  Boost */}
    <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Allow")}
      className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Allow" ? "text-[#16a34a]"
          : "text-slate-400 hover:text-slate-600"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M13 2L3 14h7v8l10-12h-7z"/>
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">Allow</span>
    </button>

    {/*  Block */}
    <button
      disabled={item.statusLoading}
      onClick={() => handleStatusChange(item.uid, "Block")}
      className={`relative group p-1 rounded transition-all duration-300 transform hover:scale-110
        ${item.statusLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${item.status === "Block" ? "text-[#dc2626]"
          : "text-slate-400 hover:text-slate-600"
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
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">Block</span>
    </button></td>
          <td className="px-3 py-1.5 text-sm text-left "> {item.integration ? (
            
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
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-700 text-xs px-3 py-1 rounded whitespace-nowrap z-50 border border-slate-200">
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
                )}</td>
          <td className="px-3 py-1.5 text-sm text-slate-600 text-center">{item?.campclicks?.total_t_clicks || 0}</td>
          <td className="px-3 py-1.5 whitespace-nowrap text-sm text-slate-600 text-right w-24">
  <div className="ml-auto w-fit inline-flex items-center gap-1 relative group">
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
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      hidden group-hover:block bg-white text-slate-700 text-xs 
      px-3 py-1 rounded whitespace-nowrap z-50 border border-slate-200">
      {item?.safe_page || "No URL Found"}
    </div>
  </div>
</td>

        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-slate-600 text-right w-24">
  <div className="ml-auto w-fit inline-flex items-center gap-1 relative group">
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
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      hidden group-hover:block bg-white text-slate-700 text-xs 
      px-3 py-1 rounded whitespace-nowrap z-50 border border-slate-200">
      {item?.money_page?.[0]?.url || "No URL Found"}
    </div>
  </div>
</td>

          <td className="px-3 py-1.5 text-sm text-slate-600 text-left">
            {new Date(item.date_time).toLocaleString()}
          </td>
          <td className="px-3 py-1.5 text-sm">
            <div className="flex items-center justify-end gap-3">
              <div className="relative group">
                <button
                  onClick={() => handleActionSelect("edit", item?.uid, item)}
                  className="p-1 rounded hover:bg-slate-100 text-[#7c8698] cursor-pointer transition-transform duration-150 hover:scale-110 hover:text-slate-700"
                  aria-label="Edit"
                >
                  <Pencil size={18} strokeWidth={2.25} />
                </button>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">
                  Edit
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() => handleActionSelect("duplicate", item?.uid, item)}
                  className="p-1 rounded hover:bg-slate-100 text-[#7c8698] cursor-pointer transition-transform duration-150 hover:scale-110 hover:text-slate-700"
                  aria-label="Duplicate"
                >
                  <Copy size={18} strokeWidth={2.25} />
                </button>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">
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
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 group-hover:block z-50">
                  Delete
                </span>
              </div>
            </div>
          </td>
        </tr>
          </>
        )
      })}
    </tbody>
  );
};

  return (
    <div className="min-h-screen text-slate-900">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="dashboard-heading text-left">Campaigns</h2>
            <p className="dashboard-subheading">
              Manage, refresh, and review all campaigns in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNewCampaign}
              className="flex items-center px-4 py-2 rounded-md font-medium text-sm border transition-all duration-200 cursor-pointer bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm border transition-all duration-200 cursor-pointer
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
          </div>
        </div>
      </div>

            <div className="mb-8 flex flex-wrap items-center gap-8">
        <StatItem icon={<StatStarStack />} value={stats.total_campaigns} label="All campaigns" />
        <StatItem icon={<StatPauseStack />} value={stats.active_campaigns} label="Active campaigns" />
        <StatItem icon={<StatAllowStack />} value={stats.allowed_campaigns} label="Allow campaigns" />
        <StatItem icon={<StatBlockStack />} value={stats.blocked_campaigns} label="Block campaigns" />
      </div>


      {/* Campaign Table Container */}
      <div className="mt-4 border-y border-x-0 border-[#d5d9e4] overflow-hidden bg-white mb-6" style={{ borderLeft: 0, borderRight: 0 }}>
        <div className="flex flex-col bg-white overflow-hidden">

          {/* ===== FIXED HEADER ===== */}
          <div className="flex-none overflow-x-auto bg-slate-50" style={{ borderLeft: 0, borderRight: 0 }}>
            <table className="min-w-full table-fixed">
              <TableColGroup />

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">#</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Campaign</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Source</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Integration</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Clicks</th>
                  <th className="px-3 py-2 text-center text-[13px] font-extrabold text-[#31374A] uppercase">Safe</th>
                  <th className="px-3 py-2 text-center text-[13px] font-extrabold text-[#31374A] uppercase">Money</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Created</th>
                  <th className="px-3 py-2 text-left text-[13px] font-extrabold text-[#31374A] uppercase">Action</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* ===== SCROLLABLE BODY ===== */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar max-h-[300px] border-y border-x-0 border-[#d5d9e4]" style={{ borderLeft: 0, borderRight: 0 }}>
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
                <ChevronLeft size={16} /> Previous
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
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination/Summary Section (Unchanged) */}
      {/* <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div>
          {campaigns.length > 0
            ? `1 to ${campaigns.length} Items of ${totalItems}`
            : `0 Items of 0`}
          {" "}
          <a href="#" className="text-blue-500 hover:text-blue-400">
            View all
          </a>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-medium text-sm transition duration-150">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-medium text-sm transition duration-150">
            Next
          </button>
        </div>
      </div> */}

      {/* Fixed Components */}

      
    </div>
  );
}

export default AllCampaignsDashboard;






