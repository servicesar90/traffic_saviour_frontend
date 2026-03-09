import { useEffect, useMemo, useRef, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { clicksbycampaign, getAllCampNames } from "../api/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showErrorToast } from "../components/toast/toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const dropdownStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1em 1em",
};

const PIE_COLORS = ["#3b82f6", "#22c55e"];
const AXIS_TICK = { fill: "#9ca3af", fontSize: 12 };
const TOOLTIP_STYLE = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "6px",
  color: "#fff",
};
const DEMO_ROWS = [
  { ip: "87.122.142.147", proxy: "yes", risk: 81, status: 1, country: "Germany", os: "Windows", device: "desktop", referrer: "google.com", isp: "Deutsche Telekom AG", user_agent: "Chrome Desktop" },
  { ip: "2a02:908:15a7:c20:75de:7207:be7c:c10c", proxy: "no", risk: 24, status: 0, country: "Germany", os: "OS X", device: "desktop", referrer: "youtube.com", isp: "Vodafone GmbH", user_agent: "Safari Mac" },
  { ip: "145.239.86.111", proxy: "yes", risk: 74, status: 1, country: "France", os: "Linux", device: "robot", referrer: "doubleclick.net", isp: "OVH SAS", user_agent: "Bot Agent" },
  { ip: "205.147.17.34", proxy: "no", risk: 19, status: 0, country: "United States", os: "Android", device: "phone", referrer: "facebook.com", isp: "AT&T", user_agent: "Chrome Android" },
  { ip: "91.180.53.248", proxy: "yes", risk: 92, status: 1, country: "Belgium", os: "Windows", device: "desktop", referrer: "googleadservices.com", isp: "Proximus", user_agent: "Edge Windows" },
  { ip: "87.65.125.33", proxy: "yes", risk: 88, status: 1, country: "Belgium", os: "Windows", device: "desktop", referrer: "google.com", isp: "Telenet", user_agent: "Chrome Desktop" },
  { ip: "91.180.53.248", proxy: "yes", risk: 90, status: 1, country: "Belgium", os: "Windows", device: "desktop", referrer: "googleadservices.com", isp: "Proximus", user_agent: "Edge Windows" },
  { ip: "87.122.142.147", proxy: "no", risk: 45, status: 0, country: "Germany", os: "Windows", device: "desktop", referrer: "bing.com", isp: "Deutsche Telekom AG", user_agent: "Chrome Desktop" },
];

const normalizeText = (value, fallback = "Unknown") => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  if (!text) return fallback;
  if (text.toLowerCase() === "n/a" || text.toLowerCase() === "unknown") return fallback;
  return text;
};

const isTruthyProxy = (value) => {
  const text = normalizeText(value, "none").toLowerCase();
  return !["none", "no", "false", "0", "not detected"].includes(text);
};

const getTopCounts = (rows, getter, limit = 6, excludeUnknown = false) => {
  const map = new Map();
  rows.forEach((row) => {
    const key = normalizeText(getter(row), "Unknown");
    if (excludeUnknown && key === "Unknown") return;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

const DateRangePicker = ({ dateRange, setDateRange, customRequired }) => {
  const [startDate, endDate] = dateRange;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex-grow max-w-xs min-w-s">
      <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
        Date Range {customRequired && <span className="text-red-500">*</span>}
      </label>

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={today}
        dayClassName={(date) => {
          const day = new Date(date);
          day.setHours(0, 0, 0, 0);
          return day.getTime() === today.getTime()
            ? "!bg-blue-600 !text-white rounded-full"
            : "";
        }}
        onChange={(update) => {
          const normalize = (d) =>
            d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12) : null;
          setDateRange([normalize(update?.[0]), normalize(update?.[1])]);
        }}
        isClearable
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/yyyy to dd/MM/yyyy"
        wrapperClassName="w-full"
        popperClassName="dashboard-datepicker-popper"
        calendarClassName="dashboard-datepicker-calendar"
        className="dashboard-datepicker-input w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white cursor-pointer"
      />
    </div>
  );
};

const CampaignDropdown = ({ campId, setCampId, campaigns }) => (
  <div className="flex-grow max-w-xs">
    <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
      Campaign <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        id="campaign"
        value={campId || ""}
        onChange={(e) => setCampId(e.target.value)}
        className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white appearance-none pr-8 cursor-pointer"
        style={dropdownStyle}
      >
        <option value="" disabled>
          Choose...
        </option>
        {campaigns.map((camp) => (
          <option key={camp.uid} value={camp.uid}>
            {camp?.campaign_info?.campaignName}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const Tile = ({ title, value, accent }) => (
  <div className={`rounded-xl border border-gray-700 p-4 ${accent}`}>
    <p className="text-xs uppercase tracking-wider text-gray-300">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const Panel = ({ title, children }) => (
  <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6">
    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const ListPanel = ({ title, items, valueLabel = "Clicks" }) => (
  <Panel title={title}>
    {items.length === 0 ? (
      <p className="text-sm text-gray-500">No data found.</p>
    ) : (
      <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2"
          >
            <span className="text-sm text-gray-200 truncate pr-3">{item.label}</span>
            <span className="text-xs font-semibold text-blue-400">
              {item.value} {valueLabel}
            </span>
          </div>
        ))}
      </div>
    )}
  </Panel>
);

const Statistics = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [campaigns, setCampaigns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campId, setCampId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const campaignControllerRef = useRef(null);
  const tableControllerRef = useRef(null);

  useEffect(() => {
    campaignControllerRef.current = new AbortController();
    const fetchCampaigns = async () => {
      try {
        const res = await apiFunction(
          "get",
          getAllCampNames,
          null,
          null,
          campaignControllerRef.current.signal
        );
        setCampaigns(res?.data?.data || []);
      } catch {
        // no-op
      }
    };
    fetchCampaigns();
    return () => campaignControllerRef.current?.abort();
  }, []);

  const fetchData = async () => {
    const [start, end] = dateRange;
    if (!start || !end) {
      showErrorToast("Please select a date range first.");
      return;
    }
    if (!campId) {
      showErrorToast("Please select a campaign.");
      return;
    }
    if (tableControllerRef.current) tableControllerRef.current.abort();
    tableControllerRef.current = new AbortController();
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    setLoading(true);
    try {
      const res = await apiFunction(
        "get",
        `${clicksbycampaign}?startdate=${startDate}&enddate=${endDate}&campId=${campId}`,
        null,
        null,
        tableControllerRef.current.signal
      );
      setTableData(res?.data?.data || []);
    } catch {
      showErrorToast("Failed to load stats data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => tableControllerRef.current?.abort();
  }, []);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setDateRange([null, null]);
      setCampId(null);
      setTableData([]);
      setIsResetting(false);
    }, 500);
  };

  const isPreviewMode = tableData.length === 0;
  const sourceRows = isPreviewMode ? DEMO_ROWS : tableData;

  const derived = useMemo(() => {
    const totalClicks = sourceRows.length;
    const uniqueClicks = new Set(
      sourceRows.map((item) => normalizeText(item?.ip, "Unknown"))
    ).size;
    const vpnClicks = sourceRows.filter((item) => isTruthyProxy(item?.proxy)).length;
    const highRiskClicks = sourceRows.filter((item) => Number(item?.risk || 0) >= 70).length;

    const safeClicks = sourceRows.filter((item) => !item?.status).length;
    const moneyClicks = sourceRows.filter((item) => Boolean(item?.status)).length;
    const pieData = [
      { name: "Safe", value: safeClicks },
      { name: "Money", value: moneyClicks },
    ];

    const trendData = sourceRows.map((item, index) => ({
      slot: `P${index + 1}`,
      risk: Number(item?.risk || 0),
      proxy: isTruthyProxy(item?.proxy) ? 1 : 0,
      clicks: index + 1,
    }));

    const riskBandData = [
      { label: "Low (<30)", value: sourceRows.filter((r) => Number(r.risk || 0) < 30).length },
      {
        label: "Medium (30-69)",
        value: sourceRows.filter((r) => Number(r.risk || 0) >= 30 && Number(r.risk || 0) < 70).length,
      },
      { label: "High (70+)", value: sourceRows.filter((r) => Number(r.risk || 0) >= 70).length },
    ];

    const deviceRadar = getTopCounts(sourceRows, (item) => item?.device, 6, true).map((d) => ({
      device: d.label,
      value: d.value,
    }));

    const topCountries = getTopCounts(sourceRows, (item) => item?.country, 7, true);
    const topReferrers = getTopCounts(sourceRows, (item) => item?.referrer, 7, true);
    const topIps = getTopCounts(sourceRows, (item) => item?.ip, 7, true);
    const topOs = getTopCounts(sourceRows, (item) => item?.os, 7, true);

    return {
      totalClicks,
      uniqueClicks,
      vpnClicks,
      highRiskClicks,
      pieData,
      trendData,
      riskBandData,
      deviceRadar,
      topCountries,
      topReferrers,
      topIps,
      topOs,
    };
  }, [sourceRows]);

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Statistics</h1>
        <p className="text-sm text-gray-400 mt-1">
          Reframed performance view with alternate chart placement
        </p>
      </header>

      <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/40 mb-6">
        <div className="flex flex-row flex-wrap items-end gap-4">
          <CampaignDropdown campId={campId} setCampId={setCampId} campaigns={campaigns} />
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} customRequired={false} />
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md h-[38px] text-sm font-medium cursor-pointer transition"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className={`px-4 py-2 text-sm border border-gray-700 rounded-md h-[38px] transition cursor-pointer ${
              isResetting ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {isResetting ? "Resetting..." : "Reset"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-gray-400">Loading stats...</div>
      ) : (
        <div className="space-y-6">
          {isPreviewMode && (
            <div className="rounded-lg border border-blue-700/50 bg-blue-900/20 px-4 py-3 text-sm text-blue-200">
              Preview mode: sample data is displayed until live API data is available.
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8 bg-gray-850/40 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Risk Trend Timeline</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={derived.trendData} margin={{ top: 8, right: 12, left: -22, bottom: 4 }}>
                    <defs>
                      <linearGradient id="safeGradientStats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="moneyGradientStats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="slot" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="clicks" fill="url(#safeGradientStats)" barSize={14} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="risk" fill="url(#moneyGradientStats)" barSize={14} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              <Tile title="Total Clicks" value={derived.totalClicks} accent="bg-gradient-to-br from-slate-800 to-slate-900" />
              <Tile title="Unique Clicks" value={derived.uniqueClicks} accent="bg-gradient-to-br from-sky-900/40 to-slate-900" />
              <Tile title="VPN Clicks" value={derived.vpnClicks} accent="bg-gradient-to-br from-indigo-900/40 to-slate-900" />
              <Tile title="High Risk Clicks" value={derived.highRiskClicks} accent="bg-gradient-to-br from-red-900/30 to-slate-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4">
              <Panel title="Safe vs Money Split">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={derived.pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={92} paddingAngle={3} dataKey="value">
                        {derived.pieData.map((entry, index) => (
                          <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            <div className="xl:col-span-4">
              <Panel title="Risk Bands">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={derived.riskBandData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                      <defs>
                        <linearGradient id="safeGradientRiskBand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                      <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                      <Bar dataKey="value" fill="url(#safeGradientRiskBand)" barSize={12} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            <div className="xl:col-span-4">
              <Panel title="Device Radar">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={derived.deviceRadar}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="device" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                      <PolarRadiusAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <Radar name="Devices" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-2">
              <ListPanel title="Top Referrers" items={derived.topReferrers} />
            </div>
            <div>
              <ListPanel title="Top IPs" items={derived.topIps} />
            </div>
            <div>
              <ListPanel title="Top OS" items={derived.topOs} />
            </div>
          </div>

          <div className="grid grid-cols-1">
            <Panel title="Top Countries (Ranked)">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={derived.topCountries}
                    margin={{ top: 8, right: 18, left: 18, bottom: 4 }}
                  >
                    <defs>
                      <linearGradient id="safeGradientCountryRank" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="label" width={120} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Bar dataKey="value" fill="url(#safeGradientCountryRank)" barSize={12} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
