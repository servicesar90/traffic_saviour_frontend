import { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { clicksbycampaign, getAllCampNames } from "../api/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DEVICE_LIST } from "../data/dataList";
import { showErrorToast } from "../components/toast/toast";

const dropdownStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
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

  return (
    <div className="flex-grow max-w-xs min-w-s">
      <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
        DATE RANGE {customRequired && <span className="text-red-500">*</span>}
      </label>

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          const normalize = (d) =>
            d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12) : null;

          setDateRange([normalize(update?.[0]), normalize(update?.[1])]);
        }}
        isClearable
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/yyyy to dd/MM/yyyy"
        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded cursor-pointer"
      />
    </div>
  );
};

const CampaignDropdown = ({ campId, setCampId, campaigns }) => {
  return (
    <div className="flex-grow max-w-xs">
      <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
        CAMPAIGN <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          id="campaign"
          value={campId || ""} // controlled component
          onChange={(e) => setCampId(e.target.value)} // update parent
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
};

const Clicklogs = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [campaigns, setCampaigns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campId, setCampId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await apiFunction("get", getAllCampNames, null, null);
        setCampaigns(res?.data?.data || []); // store campaigns
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
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
        null
      );

      setTableData(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
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

  return (
    <>
      <div className="bg-[ ] min-h-screen">
        <header className="flex items-center justify-between pt-5 mb-6  ml-4 mr-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              Click Logs
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Campaign click logs and details
            </p>
          </div>

          {/* action button area */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className={`px-3 py-2 text-sm flex items-center justify-center gap-2
    text-gray-300 border border-gray-700 rounded-md
    transition-all duration-200 cursor-pointer
    ${
      isResetting
        ? "bg-gray-700 cursor-not-allowed"
        : "bg-gray-800 hover:bg-gray-700"
    }
  `}
            >
              {isResetting && (
                <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              )}
              Reset
            </button>

            <button
              onClick={() => {
                if (!tableData || tableData.length === 0) {
                  showErrorToast("No data available to export.");
                  return;
                }

                // simple CSV export logic
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
              className={`px-3 py-2 text-sm rounded-md shadow-sm 
    ${
      tableData && tableData.length > 0
        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        : "bg-gray-700 text-gray-500 cursor-not-allowed"
    }`}
            >
              Export CSV
            </button>
          </div>
        </header>
        <div className="flex flex-col border  border-gray-700 rounded-xl p-5 m-5">
          <div className="flex flex-row p-5">
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              customRequired={false}
            />

            <CampaignDropdown
              campId={campId}
              setCampId={setCampId}
              campaigns={campaigns}
            />

            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-1  ml-4 rounded h-[40px] mt-5 cursor-pointer"
            >
              Search
            </button>
          </div>

          <div className="p-5">
            <div className="mt-4 overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
              {/* Outer container with flex to separate header and body */}
              <div className="flex flex-col">
                {/* Sticky Table Header */}

                {/* Scrollable Table Body Container */}
                <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                  <table className="min-w-full divide-y divide-gray-700 table-fixed">
                    <thead className="bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                          S No. <span className="text-red-500">*</span>
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-100">
                          Date&Time
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Result
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-35">
                          Log
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                          City
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          IP
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider min-w-30">
                          IP Score
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          PROXY
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider ">
                          ISP
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider ">
                          ASN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-48">
                          REFERRER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-48">
                          USER-AGENT
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="py-8 text-center text-gray-400"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : tableData.length === 0 ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="py-8 text-center text-gray-400"
                          >
                            No data found
                          </td>
                        </tr>
                      ) : (
                        tableData.map((item, index) => (
                          <tr key={item.tid}>
                            {/* S.No */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-16">
                              {index + 1}
                            </td>

                            {/* Date & Time */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 min-w-40">
                              {item.created_at ? (
                                new Date(item.created_at).toLocaleString()
                              ) : (
                                <span className="text-gray-500">Unknown</span>
                              )}
                            </td>

                            {/* Result Icon – if missing show Unknown */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                              {item.status ? (
                                <span className="text-gray-500">
                                  Money Page
                                </span>
                              ) : (
                                <span className="text-gray-500">Save Page</span>
                              )}
                            </td>

                            {/* Country + Browser + OS + Device icons */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-32 flex items-center gap-2">
                              {/* COUNTRY FLAG */}
                              {item?.isocode ? (
                                <img
                                  title={item?.country}
                                  data-tooltip-id={`tooltip-${item?.isocode?.toLowerCase()}`}
                                  data-tooltip-content={item?.country}
                                  src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${
                                    item?.isocode?.toLowerCase() || "in"
                                  }.svg`}
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
                            </td>

                            {/* City */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {item.city || (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>

                            {/* IP */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {item.ip || (
                                <span className="text-gray-500">Unknown</span>
                              )}
                            </td>

                            {/* IP Score */}
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                              {item.risk !== undefined && item.risk !== null ? (
                                item.risk
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>

                            {/* Proxy */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {item.proxy || (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>

                            {/* ISP */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {item.isp || (
                                <span className="text-gray-500">Unknown</span>
                              )}
                            </td>

                            {/* ASN */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {item.asn || (
                                <span className="text-gray-500">Unknown</span>
                              )}
                            </td>

                            {/* REFERRER */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-300 min-w-48">
                              {item.referrer || (
                                <span className="text-gray-500">
                                  No Referrer
                                </span>
                              )}
                            </td>

                            {/* USER AGENT */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-300 min-w-48">
                              {item.user_agent || (
                                <span className="text-gray-500">
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
              <div className="flex items-center justify-center pt-4 pb-4 bg-gray-800 rounded-b-lg">
                <button className="h-8 w-8 text-gray-600 hover:text-white">
                  &lt;
                </button>
                <button className="h-8 w-8 mx-1 bg-blue-600 text-white rounded-full text-sm">
                  1
                </button>
                <button className="h-8 w-8 mx-1 text-gray-400 hover:text-white text-sm">
                  2
                </button>
                <button className="h-8 w-8 text-gray-600 hover:text-white">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clicklogs;
