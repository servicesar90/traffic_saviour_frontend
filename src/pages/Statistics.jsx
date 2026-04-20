import { useEffect, useMemo, useRef, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { clicksbycampaign, getAllCampNames } from "../api/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showErrorToast } from "../components/toast/toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip as LeafletTooltip,
  ZoomControl,
} from "react-leaflet";
import {
  Activity,
  Fingerprint,
  ShieldCheck,
  TriangleAlert,
  ExternalLink,
  Network,
  Monitor,
} from "lucide-react";

const dropdownStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23475569'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1em 1em",
};

const AXIS_TICK = { fill: "#64748b", fontSize: 12 };
const TOOLTIP_STYLE = {
  background: "#ffffff",
  border: "1px solid #d5d9e4",
  borderRadius: "6px",
  color: "#141824",
};
const DEMO_ROWS = [
  {
    ip: "87.122.142.147",
    proxy: "yes",
    risk: 81,
    status: 1,
    country: "Germany",
    os: "Windows",
    device: "desktop",
    referrer: "google.com",
    isp: "Deutsche Telekom AG",
    user_agent: "Chrome Desktop",
  },
  {
    ip: "2a02:908:15a7:c20:75de:7207:be7c:c10c",
    proxy: "no",
    risk: 24,
    status: 0,
    country: "Germany",
    os: "OS X",
    device: "desktop",
    referrer: "youtube.com",
    isp: "Vodafone GmbH",
    user_agent: "Safari Mac",
  },
  {
    ip: "145.239.86.111",
    proxy: "yes",
    risk: 74,
    status: 1,
    country: "France",
    os: "Linux",
    device: "robot",
    referrer: "doubleclick.net",
    isp: "OVH SAS",
    user_agent: "Bot Agent",
  },
  {
    ip: "205.147.17.34",
    proxy: "no",
    risk: 19,
    status: 0,
    country: "United States",
    os: "Android",
    device: "phone",
    referrer: "facebook.com",
    isp: "AT&T",
    user_agent: "Chrome Android",
  },
  {
    ip: "91.180.53.248",
    proxy: "yes",
    risk: 92,
    status: 1,
    country: "Belgium",
    os: "Windows",
    device: "desktop",
    referrer: "googleadservices.com",
    isp: "Proximus",
    user_agent: "Edge Windows",
  },
  {
    ip: "87.65.125.33",
    proxy: "yes",
    risk: 88,
    status: 1,
    country: "Belgium",
    os: "Windows",
    device: "desktop",
    referrer: "google.com",
    isp: "Telenet",
    user_agent: "Chrome Desktop",
  },
  {
    ip: "91.180.53.248",
    proxy: "yes",
    risk: 90,
    status: 1,
    country: "Belgium",
    os: "Windows",
    device: "desktop",
    referrer: "googleadservices.com",
    isp: "Proximus",
    user_agent: "Edge Windows",
  },
  {
    ip: "87.122.142.147",
    proxy: "no",
    risk: 45,
    status: 0,
    country: "Germany",
    os: "Windows",
    device: "desktop",
    referrer: "bing.com",
    isp: "Deutsche Telekom AG",
    user_agent: "Chrome Desktop",
  },
];

const normalizeText = (value, fallback = "Unknown") => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  if (!text) return fallback;
  if (text.toLowerCase() === "n/a" || text.toLowerCase() === "unknown")
    return fallback;
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
    <div className="w-full">
      <label className="block text-[11px] uppercase font-extrabold tracking-wide text-[#52607a] mb-1 text-left">
        Date Range <span className="text-red-500">*</span>
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
        className="dashboard-datepicker-input w-full text-[13px] py-2.5 px-3.5 border border-slate-200 rounded-md bg-white text-slate-700 placeholder-[#95a1b8] cursor-pointer focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
      />
    </div>
  );
};

const CampaignDropdown = ({ campId, setCampId, campaigns }) => (
  <div className="w-full">
    <label className="block text-[11px] uppercase font-extrabold tracking-wide text-[#52607a] mb-1 text-left">
      Campaign <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        id="campaign"
        value={campId || ""}
        onChange={(e) => setCampId(e.target.value)}
        className="w-full text-[13px] py-2.5 px-3.5 border border-slate-200 rounded-md bg-white text-slate-700 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
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

const Tile = ({ title, subTitle, value, accent, icon }) => (
  <div className={`rounded-md border border-slate-200/70 p-4 ${accent}`}>
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#eaf1ff] text-[#3874FF]">
        {icon}
      </span>
      <div>
        <h4 className="text-[20px] leading-[20px] text-[#121824] font-bold text-left">
          {value}
        </h4>
        <p className="text-[0.8rem] leading-none text-[#3e465b] font-normal mt-1 text-left">
          {title}
        </p>
        <p className="text-[11px] leading-none text-[#94a3b8] mt-1 text-left">
          {subTitle}
        </p>
      </div>
    </div>
  </div>
);

const Panel = ({ title, children }) => (
  <div className="bg-transparent border-0 rounded-2xl p-5 shadow-none">
    <h3 className="text-[#141824] text-[16px] uppercase tracking-[0.08em] font-extrabold mb-3">
      {title}
    </h3>
    {children}
  </div>
);

const LIST_PANEL_THEME = {
  referrer: {
    badge: "bg-[#edf4ff] text-[#3874FF]",
    pill: "bg-[#f4f8ff] text-[#3874FF]",
  },
  ip: {
    badge: "bg-[#ecf7ff] text-[#0b6ad6]",
    pill: "bg-[#f2f9ff] text-[#0b6ad6]",
  },
  os: {
    badge: "bg-[#f1f5f9] text-[#475569]",
    pill: "bg-[#f8fafc] text-[#475569]",
  },
};

const ListPanel = ({
  title,
  items,
  valueLabel = "Clicks",
  type = "referrer",
  icon,
}) => {
  const theme = LIST_PANEL_THEME[type] || LIST_PANEL_THEME.referrer;
  return (
    <div className="rounded-md border border-[#d5d9e4] bg-white p-4 shadow-none">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${theme.badge}`}
        >
          {icon}
        </span>
        <h3 className="text-[13px] uppercase tracking-[0.06em] font-extrabold text-[#141824] text-left">
          {title}
        </h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#64748b]">No data found.</p>
      ) : (
        <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 stats-card-scrollbar">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center justify-between rounded-md border border-[#d5d9e4] bg-white px-3 py-2"
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-[#f8fafc] px-1 text-[10px] font-bold text-[#475569] border border-[#d5d9e4]">
                  {index + 1}
                </span>
                <span className="text-sm text-[#334155] truncate pr-2">
                  {item.label}
                </span>
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-2 py-1 ${theme.pill}`}
              >
                {item.value} {valueLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrendChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-[#d5d9e4] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="mb-1 text-xs font-semibold text-[#475569]">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center gap-2 text-xs text-[#334155]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-semibold">{entry.name}:</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const COUNTRY_COORDINATES = {
  india: [20.5937, 78.9629],
  "united states": [37.0902, -95.7129],
  usa: [37.0902, -95.7129],
  "united kingdom": [55.3781, -3.436],
  uk: [55.3781, -3.436],
  germany: [51.1657, 10.4515],
  france: [46.2276, 2.2137],
  belgium: [50.5039, 4.4699],
  canada: [56.1304, -106.3468],
  brazil: [-14.235, -51.9253],
  australia: [-25.2744, 133.7751],
};

const getCountryLatLng = (country) => {
  const key = normalizeText(country, "Unknown").toLowerCase();
  return COUNTRY_COORDINATES[key] || null;
};

const getDateLabelFromRow = (row, index) => {
  const raw =
    row?.date ||
    row?.date_time ||
    row?.createdAt ||
    row?.created_at ||
    row?.timestamp ||
    row?.time;
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    }
  }
  return `P${index + 1}`;
};

const Statistics = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [campaigns, setCampaigns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campId, setCampId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [countryPage, setCountryPage] = useState(1);
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
          campaignControllerRef.current.signal,
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
        tableControllerRef.current.signal,
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
      sourceRows.map((item) => normalizeText(item?.ip, "Unknown")),
    ).size;
    const vpnClicks = sourceRows.filter((item) =>
      isTruthyProxy(item?.proxy),
    ).length;
    const highRiskClicks = sourceRows.filter(
      (item) => Number(item?.risk || 0) >= 70,
    ).length;

    const safeClicks = sourceRows.filter((item) => !item?.status).length;
    const moneyClicks = sourceRows.filter((item) =>
      Boolean(item?.status),
    ).length;
    const pieData = [
      { name: "Safe", value: safeClicks },
      { name: "Money", value: moneyClicks },
    ];

    const groupedTrend = new Map();
    sourceRows.forEach((item, index) => {
      const date = getDateLabelFromRow(item, index);
      if (!groupedTrend.has(date))
        groupedTrend.set(date, { date, Safe: 0, Money: 0 });
      const current = groupedTrend.get(date);
      if (item?.status) current.Money += 1;
      else current.Safe += 1;
    });
    const baseTrendData = [...groupedTrend.values()];

    const denseTrendData = [];
    const trendLabelSet = new Set();
    baseTrendData.forEach((item, index) => {
      denseTrendData.push(item);
      trendLabelSet.add(item.date);
      const next = baseTrendData[index + 1];
      if (!next) return;
      denseTrendData.push({
        date: "",
        Safe: (item.Safe + next.Safe) / 2,
        Money: (item.Money + next.Money) / 2,
      });
    });

    const riskBandData = [
      {
        label: "Low (<30)",
        value: sourceRows.filter((r) => Number(r.risk || 0) < 30).length,
      },
      {
        label: "Medium (30-69)",
        value: sourceRows.filter(
          (r) => Number(r.risk || 0) >= 30 && Number(r.risk || 0) < 70,
        ).length,
      },
      {
        label: "High (70+)",
        value: sourceRows.filter((r) => Number(r.risk || 0) >= 70).length,
      },
    ];

    const topCountries = getTopCounts(
      sourceRows,
      (item) => item?.country,
      7,
      true,
    );
    const topReferrers = getTopCounts(
      sourceRows,
      (item) => item?.referrer,
      7,
      true,
    );
    const topIps = getTopCounts(sourceRows, (item) => item?.ip, 7, true);
    const topOs = getTopCounts(sourceRows, (item) => item?.os, 7, true);

    const safePercent = totalClicks
      ? Math.round((safeClicks / totalClicks) * 100)
      : 0;
    const moneyPercent = totalClicks
      ? Math.round((moneyClicks / totalClicks) * 100)
      : 0;
    const miniBarSeries = baseTrendData.flatMap((d) => [d.Money, d.Safe]);
    const miniBarMax = Math.max(...miniBarSeries, 1);
    const countryTraffic = topCountries
      .map((item) => {
        const coords = getCountryLatLng(item.label);
        return coords
          ? {
              country: item.label,
              value: item.value,
              lat: coords[0],
              lng: coords[1],
            }
          : null;
      })
      .filter(Boolean);
    const maxTrafficValue = Math.max(...countryTraffic.map((c) => c.value), 1);

    return {
      totalClicks,
      uniqueClicks,
      vpnClicks,
      highRiskClicks,
      trendData: denseTrendData,
      trendLabelSet,
      riskBandData,
      safePercent,
      moneyPercent,
      miniBarSeries,
      miniBarMax,
      countryTraffic,
      maxTrafficValue,
      topCountries,
      topReferrers,
      topIps,
      topOs,
    };
  }, [sourceRows]);

  const COUNTRIES_PER_PAGE = 5;
  const countryTotalPages = Math.max(
    1,
    Math.ceil(derived.topCountries.length / COUNTRIES_PER_PAGE),
  );
  const countryPageSafe = Math.min(countryPage, countryTotalPages);
  const countryStart = (countryPageSafe - 1) * COUNTRIES_PER_PAGE;
  const countryEnd = Math.min(
    countryStart + COUNTRIES_PER_PAGE,
    derived.topCountries.length,
  );
  const countrySlice = derived.topCountries.slice(countryStart, countryEnd);

  return (
    <div className="min-h-screen bg-[#f4f7fc] p-4 md:p-6">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <header className="p-0">
          <h1 className="dashboard-heading text-left">Statistics Studio</h1>
          <p className="dashboard-subheading text-left">
            Fully rebuilt analytics surface with consistent alignment and
            spacing.
          </p>
        </header>

        <section className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <CampaignDropdown
              campId={campId}
              setCampId={setCampId}
              campaigns={campaigns}
            />
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              customRequired={false}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={fetchData}
              className="min-w-[120px] h-[42px] flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className={`min-w-[120px] h-[42px] flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border transition-all duration-200 ${
                isResetting
                  ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed opacity-80"
                  : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              {isResetting ? "Resetting..." : "Reset"}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-[#d5d9e4] bg-white p-6 text-[#64748b]">
            Loading stats...
          </div>
        ) : (
          <div className="space-y-6">
            {isPreviewMode && (
              <div className="rounded-xl border border-[#fcd34d] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
                Preview mode: sample data is displayed until live API data is
                available.
              </div>
            )}

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Tile
                title="Total clicks"
                subTitle="All tracked traffic hits"
                value={derived.totalClicks}
                icon={<Activity size={18} />}
                accent="bg-white"
              />
              <Tile
                title="Unique clicks"
                subTitle="Distinct IP interactions"
                value={derived.uniqueClicks}
                icon={<Fingerprint size={18} />}
                accent="bg-white"
              />
              <Tile
                title="VPN clicks"
                subTitle="Proxy or tunnel traffic"
                value={derived.vpnClicks}
                icon={<ShieldCheck size={18} />}
                accent="bg-white"
              />
              <Tile
                title="High risk clicks"
                subTitle="Risk score above threshold"
                value={derived.highRiskClicks}
                icon={<TriangleAlert size={18} />}
                accent="bg-white"
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
              <div className="bg-[#F5F7FA] rounded-3xl p-6">
                <div className="mb-4">
                  <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">
                    Traffic Clicks
                  </h3>
                  <p className="text-[#525b75] leading-[1.2] text-sm text-left">
                    Safe and money page clicks over the selected timeframe
                  </p>
                </div>
                <div
                  className="bg-[#F5F7FA]"
                  style={{ width: "100%", height: 280 }}
                >
                  <ResponsiveContainer>
                    <LineChart
                      data={derived.trendData}
                      margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#E3E6ED"
                        strokeOpacity={1}
                        strokeDasharray="0"
                        horizontal={false}
                        vertical
                      />
                      <XAxis
                        dataKey="date"
                        tick={{
                          fill: "#5f6b84",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        tickFormatter={(value) =>
                          derived.trendLabelSet.has(value) ? value : ""
                        }
                        tickLine={false}
                        axisLine={{
                          stroke: "#CBD0DD",
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          strokeDasharray: "0",
                        }}
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
                      <Tooltip content={<TrendChartTooltip />} cursor={false} />
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
                </div>
                <div className="mt-3 flex items-center gap-6 text-sm text-[#5f6b84]">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#3874FF" }}
                    />
                    <span>Safe page clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#0097EB" }}
                    />
                    <span>Money page clicks</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="bg-white border border-slate-200/70 rounded-md p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 text-left">
                        Safe share
                      </p>
                      <p className="text-xs text-slate-400">Selected period</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {derived.safePercent}%
                    </div>
                  </div>
                  <div className="mt-4 h-20 flex items-center justify-center">
                    <svg viewBox="0 0 60 60" className="h-22 w-22">
                      <circle
                        cx="30"
                        cy="30"
                        r="24"
                        stroke="#E7EDF9"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="24"
                        stroke="#3874FF"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="151"
                        strokeDashoffset={
                          151 - (151 * derived.safePercent) / 100
                        }
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                      />
                      <text
                        x="30"
                        y="34"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#2b1f57"
                        fontWeight="700"
                      >
                        {derived.safePercent}%
                      </text>
                    </svg>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Safe</span>
                    <span>of total</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/70 rounded-md p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Money share
                      </p>
                      <p className="text-xs text-slate-400">Selected period</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {derived.moneyPercent}%
                    </div>
                  </div>
                  <div className="mt-4 h-20 flex items-center justify-center">
                    <svg viewBox="0 0 60 60" className="h-22 w-22">
                      <circle
                        cx="30"
                        cy="30"
                        r="24"
                        stroke="#E7EDF9"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="24"
                        stroke="#0097EB"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="151"
                        strokeDashoffset={
                          151 - (151 * derived.moneyPercent) / 100
                        }
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                      />
                      <text
                        x="30"
                        y="34"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#2b1f57"
                        fontWeight="700"
                      >
                        {derived.moneyPercent}%
                      </text>
                    </svg>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Money</span>
                    <span>of total</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/70 rounded-md p-5 sm:col-span-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 text-left">
                        Risk bands
                      </p>
                      <p className="text-xs text-slate-400">
                        Low / Medium / High distribution
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-20 px-3">
                    {(() => {
                      const values = derived.riskBandData.flatMap((d) => [
                        d.value,
                        d.value,
                      ]);
                      const max = Math.max(...values, 1);
                      const barWidth = 4;
                      const gap = values.length > 10 ? 4 : 8;
                      const totalWidth =
                        values.length * barWidth +
                        Math.max(0, values.length - 1) * gap +
                        12;
                      return (
                        <svg
                          viewBox={`0 0 ${totalWidth} 60`}
                          className="w-full h-full"
                        >
                          <g transform="translate(6,4)">
                            {values.map((value, idx) => {
                              const x = idx * (barWidth + gap);
                              const height = Math.max(
                                8,
                                Math.round((value / max) * 50),
                              );
                              const y = 54 - height;
                              const isSafe = idx % 2 !== 0;
                              return (
                                <rect
                                  key={`risk-mini-bar-${idx}`}
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={height}
                                  rx="3"
                                  fill={isSafe ? "#3874FF" : "#0097EB"}
                                />
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
                    <span>{derived.totalClicks} clicks</span>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="bg-[#F5F7FA] overflow-hidden border-y"
              style={{
                borderColor: "var(--app-border)",
                borderLeft: "none",
                borderRight: "none",
              }}
            >
              <div className="grid gap-0 grid-cols-1 lg:grid-cols-2 items-stretch">
                <div className="px-6 py-8 min-h-[380px]">
                  <div className="mb-6">
                    <h3 className="text-[24px] font-extrabold text-slate-900 mb-1 text-left">
                      Traffic by Country
                    </h3>
                    <p className="text-[#525b75] leading-[1.2] text-sm text-left">
                      Country level distribution from current statistics API
                      data.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {countrySlice.map((row) => (
                      <div key={row.label} className="flex items-center gap-4">
                        <div className="w-28 text-xs text-slate-700">
                          {row.label}
                        </div>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#3874FF]"
                            style={{
                              width: `${Math.round(
                                (row.value /
                                  Math.max(
                                    ...derived.topCountries.map((c) => c.value),
                                    1,
                                  )) *
                                  100,
                              )}%`,
                            }}
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
                      {derived.topCountries.length === 0
                        ? "0 items"
                        : `${countryStart + 1} to ${countryEnd} items of ${derived.topCountries.length}`}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        disabled={countryPageSafe === 1}
                        onClick={() =>
                          setCountryPage((p) => Math.max(1, p - 1))
                        }
                        className={`flex items-center gap-1 ${
                          countryPageSafe === 1
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                        }`}
                      >
                        <span className="text-base leading-none">&lt;</span>
                        Previous
                      </button>
                      <button
                        disabled={countryPageSafe === countryTotalPages}
                        onClick={() =>
                          setCountryPage((p) =>
                            Math.min(countryTotalPages, p + 1),
                          )
                        }
                        className={`flex items-center gap-1 ${
                          countryPageSafe === countryTotalPages
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                        }`}
                      >
                        Next
                        <span className="text-base leading-none">&gt;</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative  border-slate-200/70 bg-[#F7F9FC] p-0 overflow-hidden h-[380px]">
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
                    {derived.countryTraffic.map((row) => {
                      const radius = Math.max(
                        6,
                        Math.round((row.value / derived.maxTrafficValue) * 16),
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
                          <LeafletTooltip
                            direction="top"
                            offset={[0, -6]}
                            opacity={1}
                          >
                            {row.country}: {row.value.toLocaleString("en-US")}
                          </LeafletTooltip>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ListPanel
                title="Top Referrers"
                items={derived.topReferrers}
                type="referrer"
                icon={<ExternalLink size={15} />}
              />
              <ListPanel
                title="Top IPs"
                items={derived.topIps}
                type="ip"
                icon={<Network size={15} />}
              />
              <ListPanel
                title="Top OS"
                items={derived.topOs}
                type="os"
                icon={<Monitor size={15} />}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
