import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const FIELD_LABEL_CLASS =
  "flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2";
const INPUT_CLASS =
  "w-full bg-white border border-[#d5d9e4] text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const PRIMARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white disabled:bg-[#c9d8ff] disabled:cursor-not-allowed";
const SECONDARY_BTN =
  "inline-flex h-[42px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-white border border-[#d5d9e4] text-[#344054] hover:bg-[#f9fafb] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const STORAGE_TEMPLATES = "url_builder_templates_v1";
const STORAGE_HISTORY = "url_builder_history_v1";
const defaultCustomParam = { key: "", value: "" };

const presets = [
  {
    name: "Google Ads",
    icon: "/icons/bots/google.svg",
    utm: { source: "google", medium: "cpc", campaign: "search_campaign", term: "{keyword}", content: "{creative}" },
  },
  {
    name: "Meta Ads",
    icon: "/icons/bots/meta.svg",
    utm: { source: "facebook", medium: "paid_social", campaign: "meta_campaign", term: "", content: "{{ad.name}}" },
  },
  {
    name: "TikTok Ads",
    icon: "/icons/bots/tiktok.svg",
    utm: { source: "tiktok", medium: "paid_social", campaign: "tiktok_campaign", term: "", content: "{{adgroup_name}}" },
  },
];

const tryParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");

export default function UrlBuilderTool() {
  const [baseUrl, setBaseUrl] = useState("");
  const [encodeParams, setEncodeParams] = useState(true);
  const [utm, setUtm] = useState({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });
  const [customParams, setCustomParams] = useState([defaultCustomParam]);
  const [copied, setCopied] = useState("");
  const [shortAlias, setShortAlias] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState(() => tryParse(localStorage.getItem(STORAGE_TEMPLATES), []));
  const [history, setHistory] = useState(() => tryParse(localStorage.getItem(STORAGE_HISTORY), []));

  const normalizedBaseUrl = useMemo(() => {
    const trimmed = baseUrl.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }, [baseUrl]);

  const allParamEntries = useMemo(() => {
    const entries = [];
    if (utm.source.trim()) entries.push(["utm_source", utm.source.trim()]);
    if (utm.medium.trim()) entries.push(["utm_medium", utm.medium.trim()]);
    if (utm.campaign.trim()) entries.push(["utm_campaign", utm.campaign.trim()]);
    if (utm.term.trim()) entries.push(["utm_term", utm.term.trim()]);
    if (utm.content.trim()) entries.push(["utm_content", utm.content.trim()]);
    customParams.forEach((p) => {
      const k = p.key.trim();
      const v = p.value.trim();
      if (k && v) entries.push([k, v]);
    });
    return entries;
  }, [utm, customParams]);

  const duplicateKeys = useMemo(() => {
    const count = {};
    allParamEntries.forEach(([k]) => {
      count[k] = (count[k] || 0) + 1;
    });
    return Object.keys(count).filter((k) => count[k] > 1);
  }, [allParamEntries]);

  const builtUrl = useMemo(() => {
    if (!normalizedBaseUrl) return "";
    try {
      const urlObj = new URL(normalizedBaseUrl);
      const urlRaw = normalizedBaseUrl.split("?")[0];

      if (encodeParams) {
        const param = new URLSearchParams();
        allParamEntries.forEach(([k, v]) => param.append(k, v));
        const q = param.toString();
        return q ? `${urlRaw}?${q}` : urlRaw;
      }

      const q = allParamEntries.map(([k, v]) => `${k}=${v}`).join("&");
      return q ? `${urlRaw}?${q}` : urlRaw;
    } catch {
      return "";
    }
  }, [normalizedBaseUrl, allParamEntries, encodeParams]);

  const queryString = useMemo(() => {
    if (!builtUrl.includes("?")) return "";
    return builtUrl.split("?")[1];
  }, [builtUrl]);

  const urlLength = builtUrl.length;

  const validationError = useMemo(() => {
    if (!baseUrl.trim()) return "";
    try {
      new URL(normalizedBaseUrl);
      return "";
    } catch {
      return "Please enter a valid base URL.";
    }
  }, [baseUrl, normalizedBaseUrl]);

  const generatedShortUrl = useMemo(() => {
    if (!builtUrl || !shortAlias.trim()) return "";
    const alias = slugify(shortAlias);
    return alias ? `https://go.local/${alias}` : "";
  }, [builtUrl, shortAlias]);

  const persistTemplates = (next) => {
    setTemplates(next);
    localStorage.setItem(STORAGE_TEMPLATES, JSON.stringify(next));
  };

  const persistHistory = (next) => {
    setHistory(next);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
  };

  const copyText = async (text, type) => {
    if (!text) {
      showErrorToast("Nothing to copy.");
      return;
    }
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
    showSuccessToast("Copied");
  };

  const handleReset = () => {
    setBaseUrl("");
    setUtm({ source: "", medium: "", campaign: "", term: "", content: "" });
    setCustomParams([defaultCustomParam]);
    setEncodeParams(true);
    setShortAlias("");
  };

  const applyPreset = (preset) => {
    setUtm(preset.utm);
    showSuccessToast(`${preset.name} preset applied`);
  };

  const saveTemplate = () => {
    const name = templateName.trim();
    if (!name) {
      showErrorToast("Template name is required.");
      return;
    }
    const tpl = {
      id: Date.now().toString(),
      name,
      baseUrl,
      encodeParams,
      utm,
      customParams,
    };
    persistTemplates([tpl, ...templates].slice(0, 20));
    setTemplateName("");
    showSuccessToast("Template saved");
  };

  const loadTemplate = (tpl) => {
    setBaseUrl(tpl.baseUrl || "");
    setEncodeParams(Boolean(tpl.encodeParams));
    setUtm(tpl.utm || { source: "", medium: "", campaign: "", term: "", content: "" });
    setCustomParams(Array.isArray(tpl.customParams) && tpl.customParams.length ? tpl.customParams : [defaultCustomParam]);
  };

  const deleteTemplate = (id) => {
    persistTemplates(templates.filter((t) => t.id !== id));
  };

  const addHistory = () => {
    if (!builtUrl) return;
    const item = { id: Date.now().toString(), url: builtUrl, createdAt: new Date().toISOString() };
    persistHistory([item, ...history].slice(0, 30));
  };

  const importFromQuery = () => {
    if (!baseUrl.includes("?")) {
      showErrorToast("No query string found in base URL.");
      return;
    }
    try {
      const urlObj = new URL(normalizedBaseUrl);
      const nextUtm = { source: "", medium: "", campaign: "", term: "", content: "" };
      const nextCustom = [];
      urlObj.searchParams.forEach((value, key) => {
        if (key === "utm_source") nextUtm.source = value;
        else if (key === "utm_medium") nextUtm.medium = value;
        else if (key === "utm_campaign") nextUtm.campaign = value;
        else if (key === "utm_term") nextUtm.term = value;
        else if (key === "utm_content") nextUtm.content = value;
        else nextCustom.push({ key, value });
      });
      setBaseUrl(`${urlObj.origin}${urlObj.pathname}`);
      setUtm(nextUtm);
      setCustomParams(nextCustom.length ? nextCustom : [defaultCustomParam]);
      showSuccessToast("Params imported from URL");
    } catch {
      showErrorToast("Invalid URL for import.");
    }
  };

  const addCustomParam = () => setCustomParams((prev) => [...prev, defaultCustomParam]);
  const removeCustomParam = (idx) =>
    setCustomParams((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  const setCustomParamField = (idx, field, value) =>
    setCustomParams((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));

  return (
    <div className="px-2 py-2">
      <h1 className="text-left text-[28px] leading-[30px] font-extrabold text-[#141824]">URL Builder</h1>
      <p className="mt-1 text-left text-[16px] leading-[22px] font-semibold text-[#52607a]">
        Build clean campaign URLs instantly from your browser.
      </p>

      <div className="mt-7 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
          <div>
            <label className={FIELD_LABEL_CLASS}>
              BASE URL <span className="text-[#f04438] ml-1">*</span>
              <span className="relative inline-flex items-center group ml-1.5">
                <Info className="w-3.5 h-3.5 text-[#98a2b3] cursor-help" />
                <span className="pointer-events-none absolute left-1/2 top-[130%] z-20 w-64 -translate-x-1/2 rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  Enter landing page URL, e.g. https://example.com/offer
                </span>
              </span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className={INPUT_CLASS}
            />
            {validationError ? <p className="mt-1 text-[12px] text-[#b42318]">{validationError}</p> : null}
          </div>
          <button type="button" className={SECONDARY_BTN} onClick={importFromQuery}>
            Import Query
          </button>
          <button type="button" className={SECONDARY_BTN} onClick={handleReset}>
            Reset
          </button>
          <button type="button" className={PRIMARY_BTN} onClick={addHistory} disabled={!builtUrl}>
            Save History
          </button>
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white p-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((p) => (
              <button key={p.name} type="button" className={SECONDARY_BTN} onClick={() => applyPreset(p)}>
                <img
                  src={p.icon}
                  alt={p.name}
                  className="w-4 h-4 rounded-sm object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <Input
              label="UTM Source"
              tooltip="Traffic source, like google, facebook, or newsletter."
              value={utm.source}
              onChange={(v) => setUtm((x) => ({ ...x, source: v }))}
            />
            <Input
              label="UTM Medium"
              tooltip="Marketing medium, like cpc, email, social, or banner."
              value={utm.medium}
              onChange={(v) => setUtm((x) => ({ ...x, medium: v }))}
            />
            <Input
              label="UTM Campaign"
              tooltip="Campaign name for reporting, for example summer_sale_2026."
              value={utm.campaign}
              onChange={(v) => setUtm((x) => ({ ...x, campaign: v }))}
              onBlur={() => setUtm((x) => ({ ...x, campaign: slugify(x.campaign) }))}
            />
            <Input
              label="UTM Term"
              tooltip="Keyword term, usually used for paid search targeting."
              value={utm.term}
              onChange={(v) => setUtm((x) => ({ ...x, term: v }))}
            />
            <Input
              label="UTM Content"
              tooltip="Ad or creative identifier to compare multiple creatives."
              value={utm.content}
              onChange={(v) => setUtm((x) => ({ ...x, content: v }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="encode-toggle"
              type="checkbox"
              checked={encodeParams}
              onChange={(e) => setEncodeParams(e.target.checked)}
              className="accent-[#3c79ff]"
            />
            <label htmlFor="encode-toggle" className="text-[13px] font-semibold text-[#475467]">
              URL encode params
            </label>
          </div>
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#1f2a44]">Custom Parameters</h3>
            <button type="button" onClick={addCustomParam} className={SECONDARY_BTN}>
              Add Param
            </button>
          </div>
          {customParams.map((param, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <Input label={`Key ${idx + 1}`} value={param.key} onChange={(v) => setCustomParamField(idx, "key", v)} />
              <Input label={`Value ${idx + 1}`} value={param.value} onChange={(v) => setCustomParamField(idx, "value", v)} />
              <button type="button" onClick={() => removeCustomParam(idx)} className={SECONDARY_BTN}>
                Remove
              </button>
            </div>
          ))}
          {duplicateKeys.length > 0 ? (
            <p className="text-[12px] text-[#b42318]">
              Duplicate keys found: {duplicateKeys.join(", ")}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-[#d5d9e4] bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#e4e7ec] bg-gradient-to-r from-[#f8fbff] to-[#f2f7ff] flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-[15px] font-semibold text-[#1f2a44]">Final URL Preview</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" className={SECONDARY_BTN} onClick={() => copyText(builtUrl, "url")} disabled={!builtUrl}>
                {copied === "url" ? "Copied" : "Copy URL"}
              </button>
              <button type="button" className={SECONDARY_BTN} onClick={() => copyText(queryString, "query")} disabled={!queryString}>
                {copied === "query" ? "Copied" : "Copy Query"}
              </button>
              <button
                type="button"
                className={SECONDARY_BTN}
                onClick={() => copyText(`[Visit Link](${builtUrl})`, "md")}
                disabled={!builtUrl}
              >
                {copied === "md" ? "Copied" : "Copy Markdown"}
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg border border-[#d6e4ff] bg-[#f5f9ff] p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#496085] mb-2">Generated Link</p>
              <p className="text-[13px] leading-6 text-[#1d2939] break-all">
                {builtUrl || "Build your URL by entering base URL and parameters."}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className={`text-[12px] font-semibold ${urlLength > 2000 ? "text-[#b42318]" : "text-[#667085]"}`}>
                URL Length: {urlLength} {urlLength > 2000 ? "(Too long for some browsers/ad platforms)" : ""}
              </p>
              {builtUrl ? (
                <span className="inline-flex items-center rounded-full border border-[#c7d7fe] bg-[#eff4ff] px-2.5 py-1 text-[11px] font-bold text-[#175cd3]">
                  Ready to Use
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3">
          <h3 className="text-[14px] font-semibold text-[#1f2a44]">Short Link Mock + QR</h3>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
            <Input label="Alias" value={shortAlias} onChange={setShortAlias} placeholder="summer-sale-1" />
            <button type="button" className={SECONDARY_BTN} onClick={() => setShortAlias(slugify(shortAlias))}>
              Normalize Alias
            </button>
          </div>
          <p className="text-[13px] text-[#1d2939] break-all">
            {generatedShortUrl || "Enter alias to generate mock short link"}
          </p>
          {builtUrl ? (
            <div className="w-full flex justify-center">
              <div className="w-fit border border-[#d5d9e4] rounded-md p-2 bg-white">
              <img
                alt="QR Preview"
                className="w-[140px] h-[140px]"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(builtUrl)}`}
              />
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-[14px] font-semibold text-[#1f2a44]">Saved Templates</h3>
            <div className="flex items-center gap-2">
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="h-[42px] px-3 text-[12px] border border-[#d5d9e4] rounded-md"
              />
              <button type="button" className={SECONDARY_BTN} onClick={saveTemplate}>
                Save Template
              </button>
            </div>
          </div>
          <div className="max-h-[220px] overflow-auto">
            {templates.length === 0 ? (
              <p className="text-[12px] text-[#667085]">No templates saved yet.</p>
            ) : (
              <table className="w-full text-left min-w-[640px]">
                <thead className="bg-[#fbfcff] sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Name</th>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Base URL</th>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t.id} className="border-t border-[#eef2f6]">
                      <td className="px-3 py-2 text-[13px] font-semibold text-[#1d2939]">{t.name}</td>
                      <td className="px-3 py-2 text-[12px] text-[#475467] break-all">{t.baseUrl || "-"}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button type="button" className={SECONDARY_BTN} onClick={() => loadTemplate(t)}>
                          Load
                        </button>
                        <button type="button" className={SECONDARY_BTN} onClick={() => deleteTemplate(t.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white p-4 space-y-3">
          <h3 className="text-[14px] font-semibold text-[#1f2a44]">Generated URL History</h3>
          <div className="max-h-[220px] overflow-auto">
            {history.length === 0 ? (
              <p className="text-[12px] text-[#667085]">No history yet. Click Save History after generating URL.</p>
            ) : (
              <table className="w-full text-left min-w-[640px]">
                <thead className="bg-[#fbfcff] sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">URL</th>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Created</th>
                    <th className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#667085]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-t border-[#eef2f6]">
                      <td className="px-3 py-2 text-[12px] text-[#1d2939] break-all">{h.url}</td>
                      <td className="px-3 py-2 text-[12px] text-[#667085]">{new Date(h.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <button type="button" className={SECONDARY_BTN} onClick={() => copyText(h.url, "hist")}>
                          {copied === "hist" ? "Copied" : "Copy"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, tooltip = "", value, onChange, placeholder = "", onBlur }) {
  return (
    <div>
      <label className={FIELD_LABEL_CLASS}>
        {label}
        {tooltip ? (
          <span className="relative inline-flex items-center group ml-1.5">
            <Info className="w-3.5 h-3.5 text-[#98a2b3] cursor-help" />
            <span className="pointer-events-none absolute left-1/2 top-[130%] z-20 w-64 -translate-x-1/2 rounded-md bg-[#111827] px-2.5 py-1.5 text-[11px] font-medium normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              {tooltip}
            </span>
          </span>
        ) : null}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}
