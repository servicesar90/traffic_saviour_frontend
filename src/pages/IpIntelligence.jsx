import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { apiFunction } from "../api/ApiFunction";
import { blacklistIpApi, ipInfoApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const FIELD_LABEL_CLASS =
  "flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2";
const INPUT_CLASS =
  "w-full bg-white border border-[#d5d9e4] text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const PRIMARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white disabled:bg-[#c9d8ff] disabled:cursor-not-allowed";
const SECONDARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-white border border-[#d5d9e4] text-[#344054] hover:bg-[#f9fafb] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const isPrivateIp = (ip) =>
  /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);

const getRelativeTime = (isoDate) => {
  if (!isoDate) return "-";
  const diff = Date.now() - new Date(isoDate).getTime();
  const sec = Math.max(1, Math.floor(diff / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

export default function IpIntelligence() {
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);

  const normalizeIp = (value) => value.trim();

  const isValidIpFormat = (value) => {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/;
    return ipv4.test(value) || ipv6.test(value);
  };

  const handleLookup = async () => {
    const ip = normalizeIp(ipAddress);
    if (!ip || loading) return;

    if (!isValidIpFormat(ip)) {
      showErrorToast("Please enter a valid IP address (example: 8.8.8.8)");
      return;
    }

    if (isPrivateIp(ip)) {
      showErrorToast("This looks like a private/local IP. Public intelligence may not be available.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFunction("get", ipInfoApi, ip, null);
      const responseData = res?.data || null;
      setApiResponse(responseData);
      setResultVisible(true);

      const item = {
        ip,
        country: responseData?.data?.data?.location?.country_name || "-",
        provider: responseData?.data?.data?.network?.provider || "-",
        risk: Number(responseData?.data?.data?.detections?.risk ?? 0),
        status: responseData?.data?.status || "-",
        scannedAt: new Date().toISOString(),
      };
      setHistory((prev) => [item, ...prev].slice(0, 30));
    } catch (error) {
      if (error?.code === "ECONNABORTED") {
        showErrorToast("Request timed out. Please try again.");
      } else if (error?.response?.status >= 500) {
        showErrorToast("Server error while fetching IP details.");
      } else {
        showErrorToast(error?.response?.data?.message || "Unable to fetch IP information right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResults = async () => {
    if (!apiResponse) return;
    try {
      setCopying(true);
      setCopied(false);
      await navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showErrorToast("Could not copy results to clipboard.");
    } finally {
      setCopying(false);
    }
  };

  const handleExportJson = () => {
    if (!apiResponse) return;
    const blob = new Blob([JSON.stringify(apiResponse, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ip-intelligence-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleClearResults = () => {
    setResultVisible(false);
    setApiResponse(null);
  };

  const handleIpAction = async (isBlacklisted) => {
    const ip = apiResponse?.data?.data?.ip;
    if (!ip || actionLoading) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id;
    if (!userId) {
      showErrorToast("User not found. Please login again.");
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        userId,
        IPAddress: [ip],
        name: isBlacklisted ? "IP Intelligence Block" : "IP Intelligence Allow",
        description: "Added from IP Intelligence tool",
        isActive: true,
        isBlacklisted,
      };
      await apiFunction("post", blacklistIpApi, null, payload);
      showSuccessToast(isBlacklisted ? "IP added to blacklist" : "IP added to whitelist");
    } catch (e) {
      showErrorToast(e?.response?.data?.message || "IP action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const ipData = apiResponse?.data?.data || {};
  const network = ipData?.network || {};
  const location = ipData?.location || {};
  const currency = location?.currency || {};
  const detections = ipData?.detections || {};
  const deviceEstimate = ipData?.device_estimate || {};
  const risk = Number(detections?.risk ?? 0);

  const suspiciousSignals = [
    detections?.proxy ? "Proxy detected" : null,
    detections?.vpn ? "VPN detected" : null,
    detections?.scraper ? "Scraper pattern" : null,
    detections?.tor ? "Tor exit node" : null,
    detections?.hosting ? "Hosting environment" : null,
    detections?.anonymous ? "Anonymous source" : null,
  ].filter(Boolean);

  const historyView = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    return history.filter((h) => {
      const queryMatch = !q || h.ip.toLowerCase().includes(q) || h.provider.toLowerCase().includes(q);
      const filterMatch =
        historyFilter === "all" ||
        (historyFilter === "high" && h.risk >= 60) ||
        (historyFilter === "medium" && h.risk >= 30 && h.risk < 60) ||
        (historyFilter === "low" && h.risk < 30);
      return queryMatch && filterMatch;
    });
  }, [history, historyQuery, historyFilter]);

  const flagUrl = location?.country_code ? `https://flagcdn.com/24x18/${String(location.country_code).toLowerCase()}.png` : null;
  const providerInitials = (network?.provider || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  return (
    <div className="px-2 py-2">
      <h1 className="text-left text-[28px] leading-[30px] font-extrabold text-[#141824]">IP Intelligence</h1>
      <p className="mt-1 text-left text-[16px] leading-[22px] font-semibold text-[#52607a]">
        Fetch intelligence data for a public IP address.
      </p>

      <div className="mt-7 p-0 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className={FIELD_LABEL_CLASS}>
              IP ADDRESS <span className="text-[#f04438] ml-1">*</span>
              <span className="relative inline-flex items-center group ml-1.5">
                <Info className="w-3.5 h-3.5 text-[#98a2b3] cursor-help" />
                <span className="pointer-events-none absolute left-1/2 top-[130%] z-20 w-64 -translate-x-1/2 rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  Enter a valid IP address like 8.8.8.8 to lookup details.
                </span>
              </span>
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLookup();
                }
              }}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className={INPUT_CLASS}
            />
          </div>

          <button type="button" onClick={handleLookup} disabled={!ipAddress.trim() || loading} className={PRIMARY_BTN}>
            {loading ? "Looking up..." : "Lookup IP"}
          </button>
        </div>

        <p className="mt-1 text-[12px] text-[#667085]">
          Tip: Use this tool to quickly verify suspicious clicks or unknown visitor IPs.
        </p>
      </div>

      {loading ? (
        <div className="mt-5 rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3 animate-pulse">
          <div className="h-4 w-40 bg-[#e5e7eb] rounded" />
          <div className="h-36 bg-[#f3f4f6] rounded-md" />
        </div>
      ) : resultVisible ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-md border border-[#d5d9e4] bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e7ec] bg-[#f8fbff] flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-[15px] font-semibold text-[#1f2a44]">IP Lookup Response</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button type="button" onClick={handleCopyResults} disabled={copying} className={SECONDARY_BTN}>
                  {copying ? "Copying..." : copied ? "Copied" : "Copy Results"}
                </button>
                <button type="button" onClick={handleExportJson} className={SECONDARY_BTN}>Export JSON</button>
                <button type="button" onClick={handleExportPdf} className={SECONDARY_BTN}>Export PDF</button>
                <button type="button" onClick={handleClearResults} className={SECONDARY_BTN}>Clear Results</button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <DataCard label="IP" value={ipData?.ip} />
                <DataCard label="Status" value={apiResponse?.data?.status} />
                <DataCard label="Lookup Left" value={ipData?.lookup_left} />
                <DataCard label="Updated" value={getRelativeTime(ipData?.last_updated)} />
              </div>

              <div className="rounded-md border border-[#eaecf0] bg-[#f9fafb] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Risk Score</p>
                  <span className="text-[12px] font-bold text-[#141824]">{risk}/100</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#e5e7eb] overflow-hidden">
                  <div
                    className={`h-full ${risk >= 60 ? "bg-[#ef4444]" : risk >= 30 ? "bg-[#f59e0b]" : "bg-[#22c55e]"}`}
                    style={{ width: `${Math.max(0, Math.min(100, risk))}%` }}
                  />
                </div>
              </div>

              <div className="rounded-md border border-[#eaecf0] bg-white p-3">
                <div className="flex items-center gap-3">
                  {flagUrl ? <img src={flagUrl} alt="country flag" className="w-6 h-5 rounded-sm border border-[#d5d9e4]" /> : null}
                  <div className="w-8 h-8 rounded-full bg-[#e8eefc] text-[#2f63d6] flex items-center justify-center text-[11px] font-extrabold">
                    {providerInitials || "--"}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1f2a44]">{network?.provider || "-"}</p>
                    <p className="text-[12px] text-[#667085]">{location?.country_name || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-[#eaecf0] bg-white p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#667085] mb-2">Suspicious Indicators</p>
                {suspiciousSignals.length ? (
                  <div className="flex flex-wrap gap-2">
                    {suspiciousSignals.map((s) => (
                      <span key={s} className="inline-flex items-center rounded-full border border-[#fecdca] bg-[#fef3f2] px-2 py-0.5 text-[11px] font-bold text-[#b42318]">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#abefc6] bg-[#ecfdf3] px-2 py-0.5 text-[11px] font-bold text-[#027a48]">
                    No suspicious signals detected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DataCard label="ASN" value={network?.asn} />
                <DataCard label="Range" value={network?.range} />
                <DataCard label="Hostname" value={network?.hostname} />
                <DataCard label="Timezone" value={location?.timezone} />
                <DataCard label="Coordinates" value={`${location?.latitude ?? "-"}, ${location?.longitude ?? "-"}`} />
                <DataCard label="Currency" value={`${currency?.code || "-"} ${currency?.symbol || ""}`.trim()} />
                <DataCard label="Device Address" value={deviceEstimate?.address} />
                <DataCard label="Device Subnet" value={deviceEstimate?.subnet} />
              </div>

              {location?.latitude != null && location?.longitude != null && (
                <div className="rounded-md border border-[#eaecf0] bg-white overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#eaecf0] bg-[#fcfdff] flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-[#1f2a44]">Map Preview</p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=10/${location.latitude}/${location.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-semibold text-[#2f63d6]"
                    >
                      Open Map
                    </a>
                  </div>
                  <iframe
                    title="ip-map"
                    className="w-full h-[260px]"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.2}%2C${location.latitude - 0.2}%2C${location.longitude + 0.2}%2C${location.latitude + 0.2}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <button type="button" onClick={() => handleIpAction(true)} disabled={actionLoading} className={PRIMARY_BTN}>
                  {actionLoading ? "Saving..." : "Add To Blacklist"}
                </button>
                <button type="button" onClick={() => handleIpAction(false)} disabled={actionLoading} className={SECONDARY_BTN}>
                  Add To Whitelist
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#d5d9e4] bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e7ec] bg-[#f8fbff] flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-[14px] font-semibold text-[#1f2a44]">Lookup History</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                  placeholder="Search IP/provider"
                  className="h-[36px] px-3 text-[12px] border border-[#d5d9e4] rounded-md"
                />
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="h-[36px] px-3 text-[12px] border border-[#d5d9e4] rounded-md"
                >
                  <option value="all">All Risk</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="max-h-[280px] overflow-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#fbfcff] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">IP</th>
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Provider</th>
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Country</th>
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Risk</th>
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">When</th>
                  </tr>
                </thead>
                <tbody>
                  {historyView.map((h, i) => (
                    <tr key={`${h.scannedAt}-${i}`} className="border-t border-[#eef2f6]">
                      <td className="px-4 py-3 text-[13px] text-[#1d2939]">{h.ip}</td>
                      <td className="px-4 py-3 text-[13px] text-[#344054]">{h.provider}</td>
                      <td className="px-4 py-3 text-[13px] text-[#344054]">{h.country}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#344054]">{h.risk}</td>
                      <td className="px-4 py-3 text-[13px] text-[#475467]">{getRelativeTime(h.scannedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-[#d5d9e4] bg-white px-5 py-8 text-center">
          <p className="text-[14px] font-semibold text-[#344054]">Run an IP lookup to inspect response data.</p>
          <p className="mt-1 text-[12px] text-[#667085]">You can export reports, map location, and take blacklist/whitelist actions from results.</p>
        </div>
      )}
    </div>
  );
}

function DataCard({ label, value }) {
  return (
    <div className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-3 py-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#667085]">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-[#141824] break-words">{value ?? "-"}</p>
    </div>
  );
}
