import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { apiFunction } from "../api/ApiFunction";
import { redirectCheckApi } from "../api/Apis";
import { showErrorToast } from "../components/toast/toast";

const FIELD_LABEL_CLASS =
  "flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2";
const INPUT_CLASS =
  "w-full bg-white border border-[#d5d9e4] text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const PRIMARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white disabled:bg-[#c9d8ff] disabled:cursor-not-allowed";

const STATUS_STYLES = {
  "200": "bg-[#ecfdf3] text-[#027a48] border border-[#abefc6]",
  "301": "bg-[#eff4ff] text-[#175cd3] border border-[#c7d7fe]",
  "302": "bg-[#eff4ff] text-[#175cd3] border border-[#c7d7fe]",
  "307": "bg-[#fff8eb] text-[#b54708] border border-[#fedf89]",
  "308": "bg-[#fff8eb] text-[#b54708] border border-[#fedf89]",
  "404": "bg-[#fef3f2] text-[#b42318] border border-[#fecdca]",
};

const SAMPLE_HOPS = [
  {
    step: 1,
    url: "https://example.com/offer",
    status: "301",
    type: "Permanent Redirect",
    destination: "https://example.com/offer/",
    latency: "84 ms",
  },
  {
    step: 2,
    url: "https://example.com/offer/",
    status: "302",
    type: "Temporary Redirect",
    destination: "https://m.example.com/offer/",
    latency: "71 ms",
  },
  {
    step: 3,
    url: "https://m.example.com/offer/",
    status: "200",
    type: "Final Response",
    destination: "Reached Final URL",
    latency: "96 ms",
  },
];

function StatusBadge({ code }) {
  const cls = STATUS_STYLES[code] || "bg-[#f2f4f7] text-[#344054] border border-[#d0d5dd]";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>
      {code}
    </span>
  );
}



export default function RedirectInspector() {
  const [targetUrl, setTargetUrl] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hops, setHops] = useState(SAMPLE_HOPS);

  const summary = useMemo(() => {
    const redirectCount = hops.filter((h) => !h.final && String(h.status) !== "200").length;
    const finalHop = hops.find((h) => h.final) || hops[hops.length - 1] || { status: "-", url: "-" };
    return {
      totalHops: hops.length,
      redirectCount,
      finalStatus: finalHop.status,
      finalUrl: finalHop.url,
    };
  }, [hops]);

  const handleAnalyze = async () => {
    if (!targetUrl.trim() || loading) return;

    try {
      setLoading(true);
      const payload = { url: targetUrl.trim() };
      const res = await apiFunction("post", redirectCheckApi, null, payload);
      console.log(res);
      

      const apiHops = res?.data?.chain || [];

      if (Array.isArray(apiHops) && apiHops.length > 0) {
        const normalizedHops = apiHops.map((hop, idx) => ({
          step: idx + 1,
          url: hop?.from || "-",
          status: String(hop?.status ?? "-"),
          type: hop?.final ? "Final Response" : "Redirect",
          destination: hop?.to || "Reached Final URL",
          latency: "-",
          final: Boolean(hop?.final),
        }));
        setHops(normalizedHops);
      } else {
        setHops([]);
      }

      setResultVisible(true);
    } catch (error) {
      console.error("Redirect check failed:", error);
      showErrorToast(error?.response?.data?.message || "Failed to analyze redirects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-2">
      <h1 className="text-left text-[28px] leading-[30px] font-extrabold text-[#141824]">
        Redirect Analyzer
      </h1>
      <p className="mt-1 text-left text-[16px] leading-[22px] font-semibold text-[#52607a]">
        Inspect redirect chains, status codes, and final destination behavior for any URL.
      </p>

      <div className="mt-7 p-0 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label className={FIELD_LABEL_CLASS}>
                DESTINATION URL <span className="text-[#f04438] ml-1">*</span>
                <span className="relative inline-flex items-center group ml-1.5">
                  <Info className="w-3.5 h-3.5 text-[#98a2b3] cursor-help" />
                  <span className="pointer-events-none absolute left-1/2 top-[130%] z-20 w-64 -translate-x-1/2 rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    Enter the full URL you want to inspect, including https://
                  </span>
                </span>
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter destination URL"
                className={INPUT_CLASS}
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!targetUrl.trim() || loading}
              className={PRIMARY_BTN}
            >
              {loading ? "Analyzing..." : "Analyze Redirects"}
            </button>
          </div>

          <p className="mt-3 text-[12px] text-[#667085]">
            Tip: Use this before campaign launch to verify safe page and money page flow.
          </p>
        </div>

      {resultVisible ? (
        <div className="mt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <SummaryCard label="Total Hops" value={String(summary.totalHops)} />
              <SummaryCard label="Redirect Steps" value={String(summary.redirectCount)} />
              <SummaryCard label="Final Status" value={summary.finalStatus} badge />
              <SummaryCard label="Final URL" value={summary.finalUrl} mono />
            </div>

            <div className="rounded-md border-l border-r bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e4e7ec] bg-[#f8fbff]">
                <h2 className="text-[15px] font-semibold text-[#1f2a44]">Redirect Chain Details</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead className="bg-[#fbfcff]">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Step</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">URL</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Status</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Type</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hops.map((hop) => (
                      <tr key={hop.step} className="border-t border-[#eef2f6]">
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#344054]">{hop.step}</td>
                        <td className="px-4 py-3 text-[13px] text-[#1d2939] break-all">{hop.url}</td>
                        <td className="px-4 py-3"><StatusBadge code={hop.status} /></td>
                        <td className="px-4 py-3 text-[13px] text-[#475467]">{hop.type}</td>
                        <td className="px-4 py-3 text-[13px] text-[#475467] break-all">{hop.destination}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-[#d5d9e4] bg-white px-5 py-8 text-center">
          <p className="text-[14px] font-semibold text-[#344054]">Run a redirect analysis to see chain details.</p>
          <p className="mt-1 text-[12px] text-[#667085]">Your results will appear here with hop-by-hop status and destination flow.</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, badge = false, mono = false }) {
  return (
    <div className="rounded-md border border-[#d5d9e4] bg-white px-4 py-3">
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#667085]">{label}</p>
      <div className="mt-2">
        {badge ? (
          <StatusBadge code={value} />
        ) : (
          <p className={`text-[16px] font-bold text-[#141824] ${mono ? "font-mono text-[12px] break-all" : ""}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

