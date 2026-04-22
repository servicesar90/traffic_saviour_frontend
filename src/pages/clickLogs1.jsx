import { useEffect, useState, useRef } from "react";
import { apiFunction } from "../api/ApiFunction";
import { clicksbycampaign, getAllCampNames } from "../api/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DEVICE_LIST } from "../data/dataList";
import { showErrorToast } from "../components/toast/toast";

const dropdownStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2352607a'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1em 1em",
};

const getDeviceIcon = (deviceName) => {
  const match = DEVICE_LIST.find((d) => d.device === deviceName);
  return match?.icon || null;
};

const DateRangePicker = ({ dateRange, setDateRange, customRequired }) => {
  const [startDate, endDate] = dateRange;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full">
      <label className="block text-[11px] uppercase font-extrabold tracking-wide text-[#52607a] mb-1 text-left">
        DATE RANGE {customRequired && <span className="text-red-500">*</span>}
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

const CampaignDropdown = ({ campId, setCampId, campaigns }) => {
  return (
    <div className="w-full">
      <label className="block text-[11px] uppercase font-extrabold tracking-wide text-[#52607a] mb-1 text-left">
        CAMPAIGN <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          id="campaign"
          value={campId || ""} // controlled component
          onChange={(e) => setCampId(e.target.value)} // update parent
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
};

const Clicklogs = () => {
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
        const res = await apiFunction("get", getAllCampNames, null, null,campaignControllerRef.current.signal );
        setCampaigns(res?.data?.data || []); // store campaigns
      } catch (err) {
          if (err.name !== "CanceledError") {
        // console.error("Error fetching campaigns:", err);
      }
      }
    };

    fetchCampaigns();
     return () => {
    campaignControllerRef.current.abort(); // 🔥 unmount par cancel
  };
  }, []);

  //   FETCHING TABLE CONTENT
  const fetchData = async () => {
    const [start, end] = dateRange;

    if (!start || !end) {
      showErrorToast("Please select a date range first.");
      return;
    }

    // Validate campaign dropdown
    if (!campId) {
      showErrorToast("Please select a campaign.");
      return;
    }

    if (tableControllerRef.current) {
    tableControllerRef.current.abort();
  }

  tableControllerRef.current = new AbortController();

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    setLoading(true);

    try {
      const payload = {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      };

      //   https://app.clockerly.io/api/v2/campaign/clicksbycamp?startdate=2025-11-01&enddate=2025-11-21&campId=14
      const res = await apiFunction(
        "get",
        `${clicksbycampaign}?startdate=${startDate}&enddate=${endDate}&campId=${campId}`,
        null,
        null,
        tableControllerRef.current.signal
      );

      setTableData(res?.data?.data || []);
    } catch (err) {
       if (err.name !== "CanceledError") {
      // console.error("Error fetching data:", err);
    }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  return () => {
    if (tableControllerRef.current) {
      tableControllerRef.current.abort();
    }
  };
}, []);

  const handleReset = () => {
    setIsResetting(true);

    // thoda sa delay taaki animation dikhe
    setTimeout(() => {
      setDateRange([null, null]);
      setCampId(null);
      setTableData([]);
      setIsResetting(false);
    }, 600); // 600ms smooth lagta hai
  };

  const getOutcomeMeta = (status) =>
    status
      ? {
          label: "Revenue Page",
          cls: "bg-[#ecfdf3] text-[#027a48] border border-[#abefc6]",
        }
      : {
          label: "Protected Page",
          cls: "bg-[#eef4ff] text-[#1d4ed8] border border-[#bfdbfe]",
        };

  const getRiskPercent = (risk) => {
    const value = Number(risk);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
  };

  return (
    <>
      <div className="min-h-screen bg-[#f4f7fc] p-4 md:p-6">
        <div className="mx-auto max-w-[1320px] space-y-6">
          <header className="p-0">
            <h1 className="dashboard-heading text-left">Traffic Logbook</h1>
            <p className="dashboard-subheading text-left">
              Monitor campaign click records and event-level details.
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

              <button
                onClick={() => {
                  if (!tableData || tableData.length === 0) {
                    showErrorToast("No data available to export.");
                    return;
                  }

                  const csvRows = [];
                  const headers = Object.keys(tableData[0]);
                  csvRows.push(headers.join(","));

                  tableData.forEach((row) => {
                    csvRows.push(
                      headers
                        .map(
                          (h) =>
                            `"${(row[h] || "").toString().replace(/"/g, '""')}"`
                        )
                        .join(",")
                    );
                  });

                  const blob = new Blob([csvRows.join("\n")], {
                    type: "text/csv",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `clicklogs_${new Date().toISOString()}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                disabled={!tableData || tableData.length === 0}
                className={`min-w-[120px] h-[42px] flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border transition-all duration-200 ${
                  tableData && tableData.length > 0
                    ? "bg-white text-[#3c79ff] border-[#d5d9e4] hover:bg-[#eef4ff] cursor-pointer"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
              >
                Export CSV
              </button>
            </div>
          </section>

          <div>
            <div className="traffic-log-scrollbar mt-4 overflow-x-auto rounded-md  border bg-white shadow-none">
              {/* Outer container with flex to separate header and body */}
              <div className="flex flex-col">
                {/* Sticky Table Header */}

                {/* Scrollable Table Body Container */}
                <div className="traffic-log-scrollbar overflow-y-auto" style={{ maxHeight: "400px" }}>
                  <table className="min-w-full table-fixed">
                    <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-[#d5d9e4]">
                      <tr>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide w-16">
                          Sr. # <span className="text-red-500">*</span>
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide w-100">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide">
                          Outcome
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide w-35">
                          Visitor Signals
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide w-24">
                          City Name
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide min-w-30">
                          Risk Score
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide">
                          Proxy
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide ">
                          ISP Name
                        </th>
                        <th className="px-6 py-3 text-center text-[12px] font-extrabold text-[#334155] uppercase tracking-wide ">
                          ASN ID
                        </th>
                        <th className="px-6 py-3 text-left text-[12px] font-extrabold text-[#334155] uppercase tracking-wide min-w-48">
                          Referral Source
                        </th>
                        <th className="px-6 py-3 text-left text-[12px] font-extrabold text-[#334155] uppercase tracking-wide min-w-48">
                          User Agent
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="py-8 text-center text-[#64748b]"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : tableData.length === 0 ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="py-8 text-center text-[#64748b]"
                          >
                            No data found
                          </td>
                        </tr>
                      ) : (
                        tableData.map((item, index) => (
                          <tr key={item.tid} className="border-b border-[#e8edf5] hover:bg-[#f8fbff] transition-colors">
                            {/* S.No */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#141824] font-semibold w-16">
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3c79ff]" />
                                {index + 1}
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155] min-w-40">
                              {item.created_at ? (
                                <div className="text-left">
                                  <p className="font-semibold text-[#1f2a44]">
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </p>
                                  <p className="text-[11px] text-[#64748b] mt-0.5">
                                    {new Date(item.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-[#94a3b8]">Unknown</span>
                              )}
                            </td>

                            {/* Result Icon – if missing show Unknown */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#334155]">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${getOutcomeMeta(item.status).cls}`}
                              >
                                {getOutcomeMeta(item.status).label}
                              </span>
                            </td>

                            {/* Country + Browser + OS + Device icons */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155] w-32">
                              <div className="flex items-center gap-2">
                              {/* COUNTRY FLAG */}
                              {item?.isocode ? (
                                <img
                                  title={item?.country}
                                  data-tooltip-id={`tooltip-${item?.isocode?.toLowerCase()}`}
                                  data-tooltip-content={item?.country}
                                  src={`https://flagcdn.com/w40/${
                                    item?.isocode?.toLowerCase() || "in"
                                  }.png`}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "2px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <img
                                  className="size-4"
                                  alt={item?.os}
                                  data-tooltip-id={`tooltip-${item.os}`}
                                  data-tooltip-content={item.os}
                                  src={`/icons/fallback-que.jpg`}
                                />
                              )}

                              {/* BROWSER ICON */}
                              {item?.browser ? (
                                <img
                                  className="size-4"
                                  alt={item?.browser}
                                  data-tooltip-id={`tooltip-${item.browser}`}
                                  data-tooltip-content={item?.browser}
                                  src={`/icons/browsers/${item?.browser}.png`}
                                />
                              ) : (
                                <img
                                  className="size-4"
                                  alt={item?.os}
                                  data-tooltip-id={`tooltip-${item.os}`}
                                  data-tooltip-content={item.os}
                                  src={`/icons/fallback-que.jpg`}
                                />
                              )}

                              {/* OS ICON */}
                              {item?.os ? (
                                <img
                                  className="size-4"
                                  alt={item?.os}
                                  data-tooltip-id={`tooltip-${item.os}`}
                                  data-tooltip-content={item.os}
                                  src={`/icons/os/${item.os}.png`}
                                />
                              ) : (
                                <img
                                  className="size-4"
                                  alt={item?.os}
                                  data-tooltip-id={`tooltip-${item.os}`}
                                  data-tooltip-content={item.os}
                                  src={`/icons/fallback-que.jpg`}
                                />
                              )}

                              {/* DEVICE ICON */}
                              {/* DEVICE ICON */}
                              {item?.device ? (
                                <div
                                  className="w-6 h-6 " // parent controls size
                                  data-tooltip-id={`tooltip-${item.device}`}
                                  data-tooltip-content={item.device}
                                >
                                  {getDeviceIcon(item.device)}
                                </div>
                              ) : (
                                <img
                                  className="w-6 h-6"
                                  alt={item?.device || "Unknown Device"}
                                  data-tooltip-id={`tooltip-${item.device}`}
                                  data-tooltip-content={
                                    item.device || "Unknown Device"
                                  }
                                  src={`/icons/fallback-que.jpg`}
                                />
                              )}
                              </div>
                            </td>

                            {/* City */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                              {item.city || (
                                <span className="text-[#94a3b8]">N/A</span>
                              )}
                            </td>

                            {/* IP */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                              {item.ip || (
                                <span className="text-[#94a3b8]">Unknown</span>
                              )}
                            </td>

                            {/* IP Score */}
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334155]">
                              {item.risk !== undefined && item.risk !== null ? (
                                <div className="min-w-[120px] mx-auto text-left">
                                  <p className="text-[12px] font-semibold text-[#334155]">
                                    {item.risk}
                                  </p>
                                  <div className="mt-1 h-[4px] w-full rounded-full bg-[#e2e8f0]">
                                    <div
                                      className="h-[4px] rounded-full bg-[#16a34a]"
                                      style={{ width: `${getRiskPercent(item.risk)}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#94a3b8]">N/A</span>
                              )}
                            </td>

                            {/* Proxy */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                              {item.proxy || (
                                <span className="text-[#94a3b8]">N/A</span>
                              )}
                            </td>

                            {/* ISP */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                              {item.isp || (
                                <span className="text-[#94a3b8]">Unknown</span>
                              )}
                            </td>

                            {/* ASN */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                              {item.asn || (
                                <span className="text-[#94a3b8]">Unknown</span>
                              )}
                            </td>

                            {/* REFERRER */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-[#334155] min-w-48">
                              {item.referrer || (
                                <span className="text-[#94a3b8]">
                                  No Referrer
                                </span>
                              )}
                            </td>

                            {/* USER AGENT */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-[#334155] min-w-48">
                              {item.user_agent || (
                                <span className="text-[#94a3b8]">
                                  No User Agent
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination (Unchanged) */}
              <div className="flex items-center justify-center pt-4 pb-4 bg-white border-t border-[#e6eaf2] rounded-b-md">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clicklogs;
