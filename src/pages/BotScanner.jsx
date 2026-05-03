import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { apiFunction } from "../api/ApiFunction";
import { botCheckApi } from "../api/Apis";
import { showErrorToast } from "../components/toast/toast";

const FIELD_LABEL_CLASS =
  "flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2";
const INPUT_CLASS =
  "w-full bg-white border border-[#d5d9e4] text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const SELECT_CLASS =
  "w-full appearance-none bg-white border border-[#d5d9e4] rounded-md py-2.5 px-4 text-[#141824] text-sm focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const PRIMARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white disabled:bg-[#c9d8ff] disabled:cursor-not-allowed";
const SECONDARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-white border border-[#d5d9e4] text-[#344054] hover:bg-[#f9fafb] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const botOptions = [
  { label: "AdsBot Google Mobile", value: "adsbot-google-mobile" },
  { label: "AdsBot Google Android", value: "adsbot-google-android" },
  { label: "AdsBot Google Desktop", value: "adsbot-google-desktop" },
  { label: "Bingbot Mobile", value: "bingbot-mobile" },
  { label: "Bingbot Desktop", value: "bingbot-desktop" },
  { label: "Facebook Bot", value: "facebookbot" },
  { label: "Yahoo Slurp", value: "slurp" },
  { label: "Yandex", value: "yandex" },
  { label: "Googlebot", value: "googlebot" },
];

const deviceOptions = ["desktop", "mobile", "tablet"];

const getStatusBadgeClass = (statusCode) => {
  const code = Number(statusCode);
  if (code >= 200 && code < 300) return "bg-[#ecfdf3] text-[#027a48] border-[#abefc6]";
  if (code >= 300 && code < 400) return "bg-[#eff4ff] text-[#175cd3] border-[#c7d7fe]";
  if (code >= 400 && code < 600) return "bg-[#fef3f2] text-[#b42318] border-[#fecdca]";
  return "bg-[#f2f4f7] text-[#344054] border-[#d0d5dd]";
};

const getPerformanceMeta = (executionTime) => {
  const time = Number(executionTime);
  if (!Number.isFinite(time)) {
    return { label: "Unknown", cls: "bg-[#f2f4f7] text-[#344054] border-[#d0d5dd]" };
  }
  if (time <= 200) return { label: "Fast", cls: "bg-[#ecfdf3] text-[#027a48] border-[#abefc6]" };
  if (time <= 800) return { label: "Moderate", cls: "bg-[#fff8eb] text-[#b54708] border-[#fedf89]" };
  return { label: "Slow", cls: "bg-[#fef3f2] text-[#b42318] border-[#fecdca]" };
};

export default function BotScanner() {
  const [url, setUrl] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastScanMeta, setLastScanMeta] = useState(null);

  const isValidHttpUrl = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const safeText = (value) => {
    const str = String(value ?? "").trim();
    return str ? str : "Not available";
  };

  const handleScan = async () => {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl || !selectedBot || !selectedDevice || loading) return;
    if (!isValidHttpUrl(normalizedUrl)) {
      showErrorToast("Please enter a valid URL (example: https://example.com)");
      return;
    }

    try {
      setLoading(true);
      const payload = { url: normalizedUrl, bot: selectedBot, device: selectedDevice };

      const res = await apiFunction("post", botCheckApi, null, payload);
      const responseData = res?.data || null;

      if (!responseData?.success) {
        showErrorToast(responseData?.message || "Bot scan request failed.");
        return;
      }

      setApiResponse(responseData);
      setResultVisible(true);

      const historyItem = {
        url: normalizedUrl,
        bot: selectedBot,
        device: selectedDevice,
        statusCode: responseData?.data?.statusCode,
        executionTime: responseData?.data?.executionTime,
        scannedAt: new Date().toISOString(),
      };

      setLastScanMeta(historyItem);
      setHistory((prev) => [historyItem, ...prev].slice(0, 5));
    } catch (error) {
      console.error("Bot scan failed:", error);
      if (error?.code === "ECONNABORTED") {
        showErrorToast("Request timed out. Please try again.");
      } else if (error?.response?.status >= 500) {
        showErrorToast("Server error while scanning. Please try again shortly.");
      } else {
        showErrorToast(error?.response?.data?.message || "Unable to scan this URL right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanFromHistory = async (item) => {
    if (!item || loading) return;
    setUrl(item.url || "");
    setSelectedBot(item.bot || "");
    setSelectedDevice(item.device || "");

    try {
      setLoading(true);
      const payload = { url: item.url, bot: item.bot, device: item.device };
      const res = await apiFunction("post", botCheckApi, null, payload);
      const responseData = res?.data || null;

      if (!responseData?.success) {
        showErrorToast(responseData?.message || "Bot scan request failed.");
        return;
      }

      setApiResponse(responseData);
      setResultVisible(true);
      setLastScanMeta({
        ...item,
        statusCode: responseData?.data?.statusCode,
        executionTime: responseData?.data?.executionTime,
        scannedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error?.code === "ECONNABORTED") {
        showErrorToast("Request timed out. Please try again.");
      } else if (error?.response?.status >= 500) {
        showErrorToast("Server error while scanning. Please try again shortly.");
      } else {
        showErrorToast(error?.response?.data?.message || "Unable to scan this URL right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgain = () => {
    if (!lastScanMeta) return;
    setUrl(lastScanMeta.url);
    setSelectedBot(lastScanMeta.bot);
    setSelectedDevice(lastScanMeta.device);
    setResultVisible(false);
  };

  const handleCopyResults = async () => {
    if (!apiResponse?.data) return;
    try {
      setCopying(true);
      setCopied(false);
      const text = [
        `Title: ${safeText(apiResponse?.data?.title)}`,
        `Description: ${safeText(apiResponse?.data?.description)}`,
        `Keywords: ${safeText(apiResponse?.data?.keywords)}`,
        `Status Code: ${apiResponse?.data?.statusCode ?? "-"}`,
        `Execution Time (ms): ${apiResponse?.data?.executionTime ?? "-"}`,
      ].join("\n");

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showErrorToast("Could not copy results to clipboard.");
    } finally {
      setCopying(false);
    }
  };

  const performanceMeta = useMemo(
    () => getPerformanceMeta(apiResponse?.data?.executionTime),
    [apiResponse?.data?.executionTime]
  );

  const selectedBotLabel = botOptions.find((b) => b.value === selectedBot)?.label || selectedBot;

  return (
    <div className="px-2 py-2">
      <h1 className="text-left text-[28px] leading-[30px] font-extrabold text-[#141824]">Bot Scanner</h1>
      <p className="mt-1 text-left text-[16px] leading-[22px] font-semibold text-[#52607a]">
        Scan how your URL responds to major ad and crawler bots across supported devices.
      </p>

      <div className="mt-7 p-0 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_auto_auto] gap-3 items-end">
          <div>
            <label className={FIELD_LABEL_CLASS}>
              DESTINATION URL <span className="text-[#f04438] ml-1">*</span>
              <span className="relative inline-flex items-center group ml-1.5">
                <Info className="w-3.5 h-3.5 text-[#98a2b3] cursor-help" />
                <span className="pointer-events-none absolute left-1/2 top-[130%] z-20 w-64 -translate-x-1/2 rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  Enter full URL including https:// to run bot level checks.
                </span>
              </span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter destination URL"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={FIELD_LABEL_CLASS}>BOT PROFILE <span className="text-[#f04438] ml-1">*</span></label>
            <select value={selectedBot} onChange={(e) => setSelectedBot(e.target.value)} className={SELECT_CLASS}>
              <option value="">Select bot profile</option>
              {botOptions.map((bot) => (
                <option key={bot.value} value={bot.value}>{bot.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL_CLASS}>DEVICE <span className="text-[#f04438] ml-1">*</span></label>
            <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className={SELECT_CLASS}>
              <option value="">Select device</option>
              {deviceOptions.map((device) => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleScan}
            disabled={!url.trim() || !selectedBot || !selectedDevice || loading}
            className={PRIMARY_BTN}
          >
            {loading ? "Scanning..." : "Scan Bots"}
          </button>

          <button
            type="button"
            onClick={handleRunAgain}
            disabled={!lastScanMeta || loading}
            className={SECONDARY_BTN}
          >
            Run Again
          </button>
        </div>

        <p className="mt-1 text-[12px] text-[#667085]">
          Tip: Test your landing URL first, then compare cloaked URLs with the same bot and device.
        </p>
      </div>

      {loading ? (
        <div className="mt-5 rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3 animate-pulse">
          <div className="h-4 w-40 bg-[#e5e7eb] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="h-20 bg-[#f3f4f6] rounded-md" />
            <div className="h-20 bg-[#f3f4f6] rounded-md" />
            <div className="h-20 bg-[#f3f4f6] rounded-md" />
            <div className="h-20 bg-[#f3f4f6] rounded-md" />
          </div>
        </div>
      ) : resultVisible ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-md border border-[#d5d9e4] bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e7ec] bg-[#f8fbff] flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-[#1f2a44]">Scan Result</h2>
              <button type="button" onClick={handleCopyResults} disabled={copying} className={SECONDARY_BTN}>
                {copying ? "Copying..." : copied ? "Copied" : "Copy Results"}
              </button>
            </div>

            <div className="p-4 space-y-3 bg-[#fcfcfd] border-b border-[#eaecf0]">
              <MetaRow label="Scanned URL" value={lastScanMeta?.url || "-"} />
              <MetaRow label="Bot" value={botOptions.find((b) => b.value === (lastScanMeta?.bot || selectedBot))?.label || "-"} />
              <MetaRow label="Device" value={(lastScanMeta?.device || selectedDevice || "-").toUpperCase()} />
              <MetaRow label="Scanned At" value={lastScanMeta?.scannedAt ? new Date(lastScanMeta.scannedAt).toLocaleString() : "-"} />
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <ResultRow label="Title" value={safeText(apiResponse?.data?.title)} />
              <div className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#667085]">Status Code</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] font-bold ${getStatusBadgeClass(apiResponse?.data?.statusCode)}`}>
                    {apiResponse?.data?.statusCode ?? "-"}
                  </span>
                </div>
              </div>
              <ResultRow label="Description" value={safeText(apiResponse?.data?.description)} />
              <div className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-4 py-3 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#667085]">Execution Time</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <p className="text-[14px] font-semibold text-[#141824]">
                    {apiResponse?.data?.executionTime ?? "-"} ms
                  </p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${performanceMeta.cls}`}>
                    {performanceMeta.label}
                  </span>
                </div>
              </div>
              <ResultRow label="Keywords" value={safeText(apiResponse?.data?.keywords)} full />
            </div>
          </div>

          {history.length > 0 && (
            <div className="rounded-md border border-[#d5d9e4] bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e4e7ec] bg-[#f8fbff]">
                <h3 className="text-[14px] font-semibold text-[#1f2a44]">Recent Scans</h3>
              </div>
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-[#fbfcff]">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">URL</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Bot</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Device</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Status</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Time</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Scanned At</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={`${item.scannedAt}-${idx}`} className="border-t border-[#eef2f6]">
                        <td className="px-4 py-3 text-[13px] text-[#1d2939] break-all">{item.url}</td>
                        <td className="px-4 py-3 text-[13px] text-[#344054]">{botOptions.find((b) => b.value === item.bot)?.label || item.bot}</td>
                        <td className="px-4 py-3 text-[13px] text-[#344054]">{item.device.toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${getStatusBadgeClass(item.statusCode)}`}>
                            {item.statusCode ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#344054]">{item.executionTime ?? "-"} ms</td>
                        <td className="px-4 py-3 text-[13px] text-[#475467]">{new Date(item.scannedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleScanFromHistory(item)}
                            className="inline-flex items-center justify-center rounded-md border border-[#d5d9e4] px-3 py-1.5 text-[12px] font-semibold text-[#344054] hover:bg-[#f9fafb]"
                            disabled={loading}
                          >
                            Re-scan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-[#d5d9e4] bg-white px-5 py-8 text-center">
          <p className="text-[14px] font-semibold text-[#344054]">Run bot scan to inspect response data.</p>
          <p className="mt-1 text-[12px] text-[#667085]">
            Results will appear here after scanning, so you can quickly check how bots are treated on this URL.
          </p>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#667085] min-w-[110px]">{label}</p>
      <p className="text-[13px] text-[#1d2939] break-all">{value}</p>
    </div>
  );
}

function ResultRow({ label, value, full = false }) {
  return (
    <div className={`rounded-md border border-[#eaecf0] bg-[#f9fafb] px-4 py-3 ${full ? "md:col-span-2" : ""}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#667085]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#141824] break-words">{value}</p>
    </div>
  );
}
