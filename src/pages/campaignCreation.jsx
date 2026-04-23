

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import { Check, CircleHelp, Globe, Trash2 } from "lucide-react";
import { FaEdge } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi } from "../api/Apis";
import { BROWSER_LIST, COUNTRY_LIST, DEVICE_LIST } from "../data/dataList";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

/* ===========================
   Icon components (inline SVG)
   (kept from original parts)
   =========================== */
const ListChecks = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </svg>
);
const DollarSign = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ShieldCheck = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const GitMerge = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 1 9 9" />
  </svg>
);
const Filter = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const Bot = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
const Info = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const Play = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const Zap = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const CircleSlash = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="9" x2="15" y1="15" y2="9" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const CalendarDays = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);
const ChevronDown = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const MessageCircle = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const Plus = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
const XIcon = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/* ===========================
   Small reusable UI pieces
   (restyled to match Dark Steel theme)
   =========================== */

const CustomAlertModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">Information</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* InputField - styled */
const InputField = ({
  label,
  name,
  register,
  error,
  required,
  placeholder,
  type = "text",
  icon,
  defaultValue,
  tooltip,
  pattern,
  step,
  min,
  preventNegative = false,
}) => (
  <div>
    <label className="flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <Tooltip
          title={tooltip}
          placement="top"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "#ffffff",
                color: "#64748b",
                border: "1px solid #d5d9e4",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                fontSize: "12px",
                fontWeight: 500,
                px: 1.25,
                py: 0.75,
              },
            },
            arrow: {
              sx: {
                color: "#ffffff",
                "&:before": { border: "1px solid #d5d9e4" },
              },
            },
          }}
        >
          <span className="ml-2 cursor-pointer">
            <CircleHelp className="w-4 h-4 text-[#7f8aa3]" strokeWidth={2.2} />
          </span>
        </Tooltip>
      )}
    </label>

    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        step={step}
        min={min}
        className={`w-full bg-white border text-sm rounded-md py-2.5 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors ${icon ? "pl-10 pr-4" : "px-4"
          } ${error ? "border-red-500 shadow-[inset_0_0_0_1px_#ef4444]" : "border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"}`}
        style={
          error
            ? {
                borderColor: "#ef4444",
              }
            : undefined
        }
        {...register(name, {
          required: required ? `${label} is required.` : false,
          pattern: pattern || undefined,
          valueAsNumber: type === "number" ? true : undefined,
        })}
        onKeyDown={(e) => {
          if (preventNegative && ["-", "+", "e", "E"].includes(e.key)) {
            e.preventDefault();
          }
        }}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500 text-left">{error.message}</p>}
  </div>
);

/* SelectField - styled */
const SelectField = ({
  label,
  name,
  register,
  error,
  required,
  tooltip,
  options = [],
  visibleOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const registration = register(name, {
    required: required && `${label} is required.`,
  });

  const isScrollableList = Boolean(visibleOptions);
  const selectSize =
    isScrollableList && isExpanded ? Math.min(visibleOptions, options.length) : 1;

  return (
    <div>
      <label className="flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && (
          <Tooltip
            title={tooltip}
            placement="top"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "#ffffff",
                  color: "#64748b",
                  border: "1px solid #d5d9e4",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                  fontSize: "12px",
                  fontWeight: 500,
                  px: 1.25,
                  py: 0.75,
                },
              },
              arrow: {
                sx: {
                  color: "#ffffff",
                  "&:before": { border: "1px solid #d5d9e4" },
                },
              },
            }}
          >
            <span className="ml-2 cursor-pointer">
              <CircleHelp className="w-4 h-4 text-[#7f8aa3]" strokeWidth={2.2} />
            </span>
          </Tooltip>
        )}
      </label>
      <div className="relative">
        <select
          size={selectSize}
          className={`w-full appearance-none bg-white border rounded-md py-2.5 px-4 text-[#141824] text-sm focus:outline-none transition-colors ${
            error ? "border-red-500 shadow-[inset_0_0_0_1px_#ef4444]" : "border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
          }`}
          style={
            error
              ? {
                  borderColor: "#ef4444",
                }
              : undefined
          }
          {...registration}
          onFocus={(e) => {
            if (isScrollableList) setIsExpanded(true);
            registration.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (isScrollableList) setIsExpanded(false);
            registration.onBlur(e);
          }}
          onChange={(e) => {
            if (isScrollableList) setIsExpanded(false);
            registration.onChange(e);
          }}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {!isExpanded && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a96ad] pointer-events-none" />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 text-left">{error.message}</p>}
    </div>
  );
};

/* StatusButton - styled card button */
const StatusButton = ({ label, Icon, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 h-20 w-full cursor-pointer ${isActive
        ? "border-blue-500 bg-blue-500/10"
        : "border-slate-700 bg-slate-800 hover:bg-slate-700/50"
      }`}
  >
    <Icon
      className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`}
    />
    <span
      className={`text-sm font-medium mt-2 ${isActive ? "text-white" : "text-slate-300"
        }`}
    >
      {label}
    </span>
  </button>
);

/* Dashboard Layout wrapper */
const DashboardLayout = ({ children }) => (
  <div
    className="min-h-screen bg-[var(--app-bg)] text-slate-900 font-sans"
  >
    <div className="max-w-7xl mx-auto px-1 pt-0 pb-2">{children}</div>
    <div className="fixed bottom-6 right-6">
   
    </div>
  </div>
);

/* ===========================
   Main Combined Component
   =========================== */

export default function CampaignBuilder() {
  // useState: UI state (needs re-render on change)
  const [step, setStep] = useState(1);
  const [moneyPages, setMoneyPages] = useState([
    { description: "", url: "", weight: 100 },
  ]);
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const [appendUrl, setAppendUrl] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [showInputs, setShowInputs] = useState({
    activateAfterX: false,
    frequencyCap: false,
    zeroRedirect: false,
    pageGuard: false,
  });
  const [editCampaignId, setEditCampaignId] = useState(null);

  const [activeStatus, setActiveStatus] = useState("Active");
  const [openCountryDropdownIndex, setOpenCountryDropdownIndex] = useState(null);
  const [countrySearchByIndex, setCountrySearchByIndex] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [allowPageLeave, setAllowPageLeave] = useState(false);



  const navigate = useNavigate();
  const location = useLocation();
  const draftStorageKey = React.useMemo(() => {
    const idPart = location?.state?.id ? `-${location.state.id}` : "";
    return `campaignCreationDraft${idPart}`;
  }, [location?.state?.id]);

  // useEffect(() => {
  //   if (location?.state?.mode === "edit") {
  //     const c = location.state.data; // jo campaign data aya wo
  //     // set form default
  //     reset({
  //       campaignName: c?.campaign_info?.campaignName,
  //       comment: c?.campaign_info?.comment,
  //       epc: c?.campaign_info?.epc,
  //       cpc: c?.campaign_info?.cpc,
  //       trafficSource: c?.campaign_info?.trafficSource,
  //       money_page: c?.campaign_info?.money_page,
  //       safe_page: c?.campaign_info?.safe_page,
  //       conditions: c?.campaign_info?.conditions,
  //       filters: c?.campaign_info?.filters,
  //       automate: c?.campaign_info?.automate,
  //       page_guard: c?.campaign_info?.page_guard,
  //       http_code: c?.campaign_info?.http_code,
  //     });

  //     // local states as well

  //     setMoneyPages(
  //       c?.money_page || [{ description: "", url: "", weight: 100 }]
  //     );
  //     setDynamicVariables(c?.dynamicVariables || []);
  //     setActiveStatus(c?.status);
  //   }
  // }, []);

  const fetchCampaignById = async (id) => {
  try {
    const res = await apiFunction("get", `${createCampaignApi}/${id}`, null, null);
   
    
    const c = res.data.data;

    

    reset({
      campaignName: c?.campaign_info?.campaignName,
      comment: c?.campaign_info?.comment,
      epc: c?.campaign_info?.epc,
      cpc: c?.campaign_info?.cpc,
      trafficSource: c?.campaign_info?.trafficSource,
      money_page: c?.money_page,
      safe_page: c?.safe_page,
      conditions: c?.conditions,
      filters: c?.filters,
      afterX:c?.afterX,
      automate: c?.automate,
      page_guard: c?.page_guard,
      http_code: c?.http_code,
    });
    setTitleInput(c?.campaign_info?.campaignName || "");
    setNotesInput(c?.campaign_info?.comment || "");

    setMoneyPages(
      c?.money_page || [
        { description: "", url: "", weight: 100 },
      ]
    );

    setDynamicVariables(c?.dynamicVariables || []);
    setActiveStatus(c?.status);
  } catch (err) {
    // console.error("Failed to fetch campaign", err);
  }
};


  // useEffect required: edit mode detection -> set id
  useEffect(() => {
    if (location?.state?.mode === "edit" && location.state.id) {
      setEditCampaignId(location.state.id);
    }
  }, [location.state]);

  // useEffect required: fetch data when id is set (side-effect)
  useEffect(() => {
    if (editCampaignId) {
      fetchCampaignById(editCampaignId);
    }
  }, [editCampaignId]);

  // options copied from parts
  // useMemo candidate: large static list
  const adPlatforms = [
    "Google Adwords",
    "Binge Ads",
    "Yahoo Gemini",
    "Taboola",
    "Facebook Adverts",
    "TikTok Ads",
    "50onRed",
    "ADAMO",
    "AdRoll",
    "AdSupply",
    "Adblade",
    "Adcash",
    "Admob",
    "Adnium",
    "Adsterra",
    "Advertise.com",
    "Airpush",
    "Amazon Ads",
    "Bidvertiser",
    "Blindclick",
    "CNET",
    "CPMOZ",
    "DNTX",
    "Dianomi",
    "DoublePimp",
    "Earnify",
    "EPOM Market",
    "Etrag.ru",
    "Exoclicks",
    "Flix Media",
    "Go2Mobi",
    "Gravity",
    "Gunggo Ads",
    "InMobi",
    "Instagram",
    "Juicy Ads",
    "Lead Impact",
    "LeadBolt",
    "LeadSense",
    "Ligatus",
    "Linkedin",
    "MGID",
    "MarketGid",
    "Media Traffic",
    "Millennial Media",
    "MoPub",
    "MobiAds",
    "NTENT",
    "Native Ads",
    "NewsCred",
    "Octobird",
    "OpenX",
    "Others",
    "Outbrain",
    "Pinterest Ads",
    "Plista",
    "Plugrush",
    "PocketMath",
    "PopAds",
    "PopCash",
    "PopMyAds",
    "Popwin",
    "Popunder.net",
    "PropelMedia",
    "Propeller Ads",
    "Qwaya Ads",
    "Rapsio",
    "RealGravity",
    "Redirect.com",
    "Recontent",
    "Revenue Hits",
    "Simple Reach",
    "Skyword",
    "SiteScout (Basis)",
    "StackAdapt",
    "StartApp",
    "SynupMedia",
    "TapSense",
    "Traffic Broker",
    "Target.my.com",
    "Traffic Factory",
    "Traffic Force",
    "Traffic Holder",
    "Traffic Junky",
    "Traffic Hunt",
    "Traflow",
    "Trellian",
    "Twitter",
    "Unity Ads",
    "Vk.com",
    "WebCollage",
    "Widget Media",
    "Yandex",
    "Zemanta",
    "ZeroPark",
    "MaxVisits",
    "Revisitors",
    "Snapchat Ads",
    "Organic Traffic",
    "Galaksion",
    "Traffic Stars",
    "Snackvideo",
  ];

  // useMemo candidate: static list
  const fixedOptions = [
    { id: 1, label: "BUSINESS" },
    { id: 2, label: "GOVERNMENT" },
    { id: 3, label: "Wireless" },
    { id: 4, label: "ASN TS" },
    { id: 5, label: "BIPS" },
    { id: 6, label: "BOT" },
    { id: 7, label: "DATA CENTER" },
    { id: 8, label: "HRIP" },
    { id: 9, label: "ISP TS" },
    { id: 10, label: "LRIP" },
    { id: 11, label: "PROXY/VPN" },
    { id: 12, label: "TIME ZONE" },
    { id: 13, label: "TSIF" },
  ];

  // useMemo candidate: static list
  const OPTIONS = [
    { value: "country", label: "Country" },
    { value: "state", label: "State" },
    { value: "zip", label: "Zip Code" },
    { value: "browser", label: "Browser" },
    { value: "Device", label: "Device" },
    { value: "ASN", label: "ASN" },
    { value: "referrer", label: "Referrer" },
    { value: "IP", label: "IP" },
    { value: "userAgent", label: "User Agent" },
    { value: "isp", label: "ISP" },
  ];

  // useMemo candidate: static list
  const steps = [
    { id: 1, name: "Campaign Details", icon: ListChecks },
    { id: 2, name: "Revenue Page", icon: DollarSign },
    { id: 3, name: "Protected Page", icon: ShieldCheck },
    { id: 4, name: "Criteria", icon: GitMerge },
    { id: 5, name: "Campaign Screening", icon: Filter },
    { id: 6, name: "Automation", icon: Bot },
  ];

  // useMemo candidate: static list
  const statusOptions = [
    { name: "Active", icon: Play },
    { name: "Allow", icon: Zap },
    { name: "Block", icon: CircleSlash },
    // { name: "Schedule", icon: CalendarDays },
  ];

  /* ---------------------------
     Form (react-hook-form)
     --------------------------- */
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    trigger,
    clearErrors,
    setError,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      campaignName: "",
      comment: "",
      epc: null,
      cpc: null,
      trafficSource: adPlatforms[0],
      money_page: [{ description: "", url: "", weight: 100 }],
      safe_page: null,
      conditions: [],
      filters: [],
       afterX: null,
      automate: {
       
        frequencyCap: { value: "" },
        zeroRedirect: { curl: false, iframe: false },
        gclid: false,
        ipCap: false,
      },
      page_guard: { key: "", url: "", second: "" },
      http_code: "301",
    },
  });

  // useMemo candidate: derived value (or keep as direct watch)
  const afterXValue = watch("afterX");

  useEffect(() => {
    if (location?.state?.mode === "edit") return;
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.formData) return;
      reset(parsed.formData);
      setStep(parsed.step || 1);
      setMoneyPages(
        parsed?.formData?.money_page || [{ description: "", url: "", weight: 100 }]
      );
      setActiveStatus(parsed?.formData?.status || "Active");
      setTitleInput(parsed?.formData?.campaignName || "");
      setNotesInput(parsed?.formData?.comment || "");
    } catch {
      // ignore corrupted draft
    }
  }, [draftStorageKey, location?.state?.mode, reset]);

  useEffect(() => {
    if (location?.state?.mode === "edit") return;
    const sub = watch((values) => {
      try {
        const payload = { step, formData: values };
        localStorage.setItem(draftStorageKey, JSON.stringify(payload));
      } catch {
        // ignore storage errors
      }
    });
    return () => sub.unsubscribe();
  }, [watch, step, draftStorageKey, location?.state?.mode]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!isDirty || allowPageLeave) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, allowPageLeave]);

  const getWordMatches = (value = "") =>
    String(value).match(/[A-Za-z0-9]+(?:['â€™-][A-Za-z0-9]+)*/g) || [];

  const wordCount = (value = "") => getWordMatches(value).length;

  const trimToWordLimit = (value = "", limit = 0) => {
    const raw = String(value);
    if (limit <= 0) return "";

    const matcher = /[A-Za-z0-9]+(?:['â€™-][A-Za-z0-9]+)*/g;
    let count = 0;
    let match;
    let lastAllowedEnd = 0;

    while ((match = matcher.exec(raw)) !== null) {
      count += 1;
      lastAllowedEnd = matcher.lastIndex;
      if (count === limit) break;
    }

    if (count < limit) return raw;
    return raw.slice(0, lastAllowedEnd).replace(/\s+$/g, "");
  };

  const titleWordsUsed = wordCount(titleInput);
  const titleWordsLeft = Math.max(0, 30 - titleWordsUsed);
  const descriptionWordsUsed = wordCount(notesInput);
  const descriptionWordsLeft = Math.max(0, 260 - descriptionWordsUsed);

  useEffect(() => {
    const clamped = trimToWordLimit(titleInput, 30);
    if (clamped !== titleInput) {
      setTitleInput(clamped);
      return;
    }
    setValue("campaignName", clamped, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [titleInput, setValue]);

  useEffect(() => {
    const clamped = trimToWordLimit(notesInput, 260);
    if (clamped !== notesInput) {
      setNotesInput(clamped);
      return;
    }
    setValue("comment", clamped, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [notesInput, setValue]);

  const canTypeAtWordLimit = (event) => {
    const k = event.key;
    return (
      k === "Backspace" ||
      k === "Delete" ||
      k === "ArrowLeft" ||
      k === "ArrowRight" ||
      k === "ArrowUp" ||
      k === "ArrowDown" ||
      k === "Tab" ||
      k === "Home" ||
      k === "End" ||
      event.ctrlKey ||
      event.metaKey
    );
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  useEffect(() => {
    register("campaignName", {
      required: "Campaign Title is required.",
      validate: (v) =>
        wordCount(v || "") <= 30 || "Maximum 30 words allowed.",
    });
    register("comment", {
      validate: (v) =>
        wordCount(v || "") <= 260 || "Maximum 260 words allowed.",
    });
  }, [register]);
  // useMemo candidate: derived from watch
  const selectedTypes = watch("conditions").map((c) => c.type);
  const selectedFiltersCount = (watch("filters") || []).length;

  // useEffect required: sync toggle from form value (side-effect on state)
  useEffect(() => {
    if (Number(afterXValue) > 0) {
      setShowInputs((p) => ({ ...p, afterX: true }));
    }
  }, [afterXValue]);


  /* ---------------------------
     helper handlers
     --------------------------- */
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const hideCustomAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const addMoneyPage = () => {
    setMoneyPages((p) => {
      const next = [...p, { description: "", url: "", weight: 100 }];
      setValue("money_page", next);
      return next;
    });
  };

  const removeMoneyPage = (index) => {
    setMoneyPages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue("money_page", next);
      return next;
    });
  };

  const addDynamicVariable = () => {
    setDynamicVariables((p) => [...p, { name: "", value: "" }]);
  };

  const removeDynamicVariable = (index) => {
    setDynamicVariables((p) => p.filter((_, i) => i !== index));
  };

  const handleAddCondition = (type) => {
    append({ type, mode: "allow", values: [] });
  };

  const getConditionOptionLabel = (item) =>
    item?.country || item?.state || item?.name || item?.browser || item?.device || "";

  const validateCriteriaValues = () => {
    const currentConditions = getValues("conditions") || [];
    clearErrors("conditions");

    let hasInvalid = false;
    currentConditions.forEach((condition, idx) => {
      const values = Array.isArray(condition?.values) ? condition.values : [];
      const normalized = values
        .map((v) => String(v || "").trim())
        .filter(Boolean);

      if (normalized.length === 0) {
        hasInvalid = true;
        setError(`conditions.${idx}.values`, {
          type: "manual",
          message: `Please add at least one ${condition?.type || "criteria"} value.`,
        });
      }
    });

    if (hasInvalid) {
      showErrorToast("Each selected criteria must have at least one value.");
      return false;
    }
    return true;
  };

  const validateFiltersSelection = () => {
    const selected = getValues("filters") || [];
    clearErrors("filters");
    if (!Array.isArray(selected) || selected.length === 0) {
      setError("filters", {
        type: "manual",
        message: "Please enable at least one filter before continuing.",
      });
      showErrorToast("At least one filter is required.");
      return false;
    }
    return true;
  };

  const getCountrySearchValue = (index) => countrySearchByIndex[index] || "";

  const getBrowserIconNode = (browserName = "") => {
    const name = browserName.toLowerCase();
    const xiaomiIcon = (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5" fill="#ff6900" />
        <text
          x="12"
          y="14.3"
          textAnchor="middle"
          fontSize="8.6"
          fontWeight="700"
          fill="#ffffff"
          fontFamily="Arial, sans-serif"
        >
          MI
        </text>
      </svg>
    );
    const ucIcon = (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#f97316" />
        <path
          d="M6.5 12.5c2.2-3.8 7.3-4.5 10.9-1.4-2.3-.4-3.8 1.5-3.3 3.5.6 2.4-1 4.2-3.8 4.7"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
    const ibIcon = (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#2563eb" />
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="1.5" />
        <path d="M12 6.5v11M6.5 12h11" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
    const iconFromUrl = (src) => (
      <img
        src={src}
        alt={`${browserName} icon`}
        className="w-4 h-4 object-contain"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );

    // Direct icon mapping for the remaining browsers
    if (name.includes("samsung")) {
      return iconFromUrl("https://img.icons8.com/color/48/samsung-internet.png");
    }
    if (name.includes("uc browser") || name === "uc") {
      return ucIcon;
    }
    if (name.includes("internt explorer") || name.includes("internet explorer")) {
      return iconFromUrl("https://img.icons8.com/color/48/internet-explorer.png");
    }
    if (name.includes("edge")) {
      return <FaEdge className="w-4 h-4 text-[#0ea5e9]" />;
    }
    if (name.includes("flock")) {
      return iconFromUrl("https://img.icons8.com/fluency/48/bird.png");
    }
    if (name.includes("ibrowser") || name.includes("i browser") || name === "ib") {
      return ibIcon;
    }
    if (name.includes("xiaomi") || name.includes("mi browser")) {
      return xiaomiIcon;
    }

    let slug = "";
    if (name.includes("nokia")) slug = "nokia";
    else if (name.includes("ubuntu")) slug = "ubuntu";
    else if (name.includes("chrome")) slug = "googlechrome";
    else if (name.includes("firefox")) slug = "firefoxbrowser";
    else if (name.includes("safari")) slug = "safari";
    else if (name.includes("opera")) slug = "opera";

    if (slug) {
      return (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={`${browserName} icon`}
          className="w-4 h-4"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied === "1") {
              e.currentTarget.style.display = "none";
              return;
            }
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = "https://cdn.simpleicons.org/googlechrome";
          }}
        />
      );
    }
    return <Globe className="w-4 h-4 text-[#64748b]" />;
  };

  const renderCriteriaOptionIcon = (type, item, label) => {
    if (type === "country" && item?.code) {
      return (
        <img
          src={`https://flagcdn.com/w40/${item.code}.png`}
          alt={`${label} flag`}
          className="w-5 h-3.5 rounded-[2px] object-cover"
          loading="lazy"
        />
      );
    }

    if (type === "Device" && item?.icon) {
      return <span className="text-[#3c79ff]">{item.icon}</span>;
    }

    if (type === "browser") {
      return getBrowserIconNode(label);
    }

    return null;
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleNext = async () => {
    // validate relevant fields before next
    if (step === 1) {
      const fieldsToValidate = ["campaignName", "trafficSource"];
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }
    if (step === 2) {
      // validate money page urls
      const moneyFields = moneyPages.map((_, i) => `money_page.${i}.url`);
      const valid = await trigger(moneyFields);
      if (!valid) return;
    }
    if(step == 3){
      const safePageField = "safe_page";
      const valid = await trigger(safePageField);
      if(!valid) return;

    }
    if (step === 4) {
      const valid = validateCriteriaValues();
      if (!valid) return;
    }
    if (step === 5) {
      const valid = validateFiltersSelection();
      if (!valid) return;
    }
    nextStep();
  };  


  const handleStepClick = async (targetStep) => {
  // ðŸ”™ Backward movement â†’ always allowed
  if (targetStep <= step) {
    setStep(targetStep);
    return;
  }

  // ðŸ‘‰ Forward movement â†’ validate CURRENT step only
  if (step === 1) {
    const fieldsToValidate = ["campaignName", "trafficSource"];
    const valid = await trigger(fieldsToValidate);
    if (!valid) return;
  }

  if (step === 2) {
    const moneyFields = moneyPages.map(
      (_, i) => `money_page.${i}.url`
    );
    const valid = await trigger(moneyFields);
    if (!valid) return;
  }

  if (step === 3) {
    const valid = await trigger("safe_page");
    if (!valid) return;
  }
  if (step === 4) {
    const valid = validateCriteriaValues();
    if (!valid) return;
  }
  if (step === 5) {
    const valid = validateFiltersSelection();
    if (!valid) return;
  }

  // âœ… validation passed â†’ go to clicked step
  setStep(targetStep);
};

  const handleSaveDraft = () => {
    try {
      const formData = getValues();
      localStorage.setItem(
        draftStorageKey,
        JSON.stringify({ step, formData })
      );
      showSuccessToast("Draft saved");
    } catch {
      showErrorToast("Unable to save draft");
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
      showSuccessToast("Draft removed");
    } catch {
      showErrorToast("Unable to remove draft");
    }
  };

  const handleOpenReview = handleSubmit((data) => {
    setReviewData(data);
    setShowReviewModal(true);
  });

  const handleFormKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const tag = e.target?.tagName?.toLowerCase();
    if (tag === "textarea") return;
    // Prevent accidental full form submit on Enter from any step/input.
    e.preventDefault();
  };


  const onSubmit = async (data) => {
    try {
      setShowReviewModal(false);
      const criteriaValid = validateCriteriaValues();
      if (!criteriaValid) return;
      const filtersValid = validateFiltersSelection();
      if (!filtersValid) return;

      // merge moneyPages from local state into data (to ensure latest)
      // data.money_page = moneyPages;
      data.status = activeStatus;
      console.log(data);
      
    

      if (location?.state?.mode === "edit") {
        const uid = location?.state?.id;
      
        const payload ={...data,campaign_info:{
          campaignName:data?.campaignName,
          trafficSource:data?.trafficSource,
          epc:data?.epc,
          cpc:data?.cpc,
          comment:data?.comment,
        }};
        console.log(payload);
        
        

        const res = await apiFunction("patch", `${createCampaignApi}/${uid}`, null, payload);
    
        
        showSuccessToast("Campaign updated successfully!");
        setAllowPageLeave(true);
        localStorage.removeItem(draftStorageKey);
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            id:uid,
            data: location.state.data,
          },
        });
      } else {
  
        
        const response = await apiFunction(
          "post",
          createCampaignApi,
          null,
          data
        );





        // use response to show success
        showSuccessToast(
          "Campaign created successfully! you are going to route to Integration page"
        );
        setAllowPageLeave(true);
        localStorage.removeItem(draftStorageKey);
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            data: response?.data?.data || response,
          },
        });
      }
    } catch (err) {
       if (err?.response?.status === 403) {
    showErrorToast("Campaign limit reached. Upgrade your plan ðŸš€");
    navigate('/Dashboard/pricing')
  } else {
    showErrorToast(
      err?.response?.data?.message || "Something went wrong"
    );
  }
     
    }
  };

  /* ===========================
     Visual: stepper and card layout
     =========================== */

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="dashboard-heading text-left">
              {location?.state?.mode === "edit" ? "Update" : "Create"} Campaign
            </h1>
            <p className="dashboard-subheading text-left max-w-xl">
              Transform your traffic into a success story â€” multi-step campaign
              builder with advanced cloaking controls.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-[12px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleClearDraft}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-[12px] border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Clear Draft
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-8 items-start">
          <div>
            <div className="xl:hidden mb-8">
              <nav aria-label="Progress" className="w-full">
                <ol role="list" className="flex w-full items-start pl-5 pr-1 ml-0">
                  {steps.map((s, idx) => {
                    const isCurrent = idx + 1 === step;
                    const isDone = idx + 1 <= step;
                    const isConnectorDone = idx + 1 < step;
                    return (
                      <li key={s.name} className="relative flex flex-1 min-w-0 flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleStepClick(idx + 1)}
                          className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-[6px] cursor-pointer transition-colors ${
                            isDone
                              ? "border-[#3c79ff] bg-[#3c79ff] text-white"
                              : "border-[#ccd1dd] bg-[#f2f5fa] text-[#525B75]"
                          }`}
                        >
                          <s.icon
                            className="h-4 w-4"
                            strokeWidth={2.6}
                            style={{ color: isDone ? "#ffffff" : "#525B75" }}
                          />
                        </button>
                        <span
                          className={`mt-2 max-w-[102px] text-center text-[12px] leading-4 ${
                            isCurrent ? "text-[#3c79ff] font-semibold" : "text-[#4f5d79]"
                          }`}
                        >
                          {s.name}
                        </span>
                        {idx < steps.length - 1 && (
                          <span
                            className={`absolute top-[18px] left-[calc(50%+18px)] h-[2px] w-[calc(100%-36px)] ${
                              isConnectorDone ? "bg-[#3c79ff]" : "bg-[#525B75]"
                            }`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* Form container */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={handleFormKeyDown}
              className="space-y-6"
            >
          {/* Step 1: Campaign Info */}
          {step === 1 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="max-w-3xl space-y-6">
                <h2 className="text-left text-[22px] font-extrabold text-[#141824]">
                  Campaign Overview
                </h2>

                <div>
                  <label className="flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2">
                    Campaign Title <span className="text-red-500 ml-1">*</span>
                    <Tooltip
                      title="Enter Desired Campaign Name to identify it"
                      placement="top"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#ffffff",
                            color: "#64748b",
                            border: "1px solid #d5d9e4",
                            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                            fontSize: "12px",
                            fontWeight: 500,
                            px: 1.25,
                            py: 0.75,
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#ffffff",
                            "&:before": { border: "1px solid #d5d9e4" },
                          },
                        },
                      }}
                    >
                      <span className="ml-2 cursor-pointer">
                        <CircleHelp className="w-4 h-4 text-[#7f8aa3]" strokeWidth={2.2} />
                      </span>
                    </Tooltip>
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => {
                      const next = trimToWordLimit(e.target.value, 30);
                      setTitleInput(next);
                      setValue("campaignName", next, {
                        shouldDirty: true,
                        shouldValidate: false,
                      });
                    }}
                    onKeyDown={(e) => {
                      if (wordCount(titleInput) >= 30 && (e.key === " " || e.key === "Enter")) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      const merged = `${titleInput || ""} ${pasted}`.trim();
                      if (wordCount(merged) > 30) {
                        e.preventDefault();
                        const next = trimToWordLimit(merged, 30);
                        setTitleInput(next);
                        setValue("campaignName", next, {
                          shouldDirty: true,
                          shouldValidate: false,
                        });
                      }
                    }}
                    placeholder="Enter a unique name"
                    className={`w-full bg-white border text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors ${
                      errors.campaignName ? "border-red-500 shadow-[inset_0_0_0_1px_#ef4444]" : "border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
                    }`}
                    style={
                      errors.campaignName
                        ? {
                            borderColor: "#ef4444",
                          }
                        : undefined
                    }
                  />
                  {errors.campaignName && (
                    <p className="mt-1 text-xs text-red-500 text-left">{errors.campaignName.message}</p>
                  )}
                  <p className="mt-1 text-xs text-[#6b7280] text-left">
                   
                  </p>
                </div>

                <div>
                  <label className="flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2">
                    Notes
                    <Tooltip
                      title="Comment for this campaign"
                      placement="top"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#ffffff",
                            color: "#64748b",
                            border: "1px solid #d5d9e4",
                            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                            fontSize: "12px",
                            fontWeight: 500,
                            px: 1.25,
                            py: 0.75,
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#ffffff",
                            "&:before": { border: "1px solid #d5d9e4" },
                          },
                        },
                      }}
                    >
                      <span className="ml-2 cursor-pointer">
                        <CircleHelp className="w-4 h-4 text-[#7f8aa3]" strokeWidth={2.2} />
                      </span>
                    </Tooltip>
                  </label>
                  <textarea
                    placeholder="Add a brief description"
                    rows={2}
                    value={notesInput}
                    onChange={(e) => {
                      const next = trimToWordLimit(e.target.value, 260);
                      setNotesInput(next);
                      setValue("comment", next, {
                        shouldDirty: true,
                        shouldValidate: false,
                      });
                    }}
                    onKeyDown={(e) => {
                      if (wordCount(notesInput) >= 260 && (e.key === " " || e.key === "Enter")) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      const merged = `${notesInput || ""} ${pasted}`.trim();
                      if (wordCount(merged) > 260) {
                        e.preventDefault();
                        const next = trimToWordLimit(merged, 260);
                        setNotesInput(next);
                        setValue("comment", next, {
                          shouldDirty: true,
                          shouldValidate: false,
                        });
                      }
                    }}
                    className={`w-full bg-white border rounded-md px-4 py-2.5 text-sm text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors resize-none ${
                      errors.comment ? "border-red-500 shadow-[inset_0_0_0_1px_#ef4444]" : "border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
                    }`}
                    style={
                      errors.comment
                        ? {
                            borderColor: "#ef4444",
                          }
                        : undefined
                    }
                  />
                  {errors.comment && (
                    <p className="mt-1 text-xs text-red-500 text-left">{errors.comment.message}</p>
                  )}
                  <p className="mt-1 text-xs text-[#6b7280] text-left">
                    
                  </p>
                </div>

                <SelectField
                  label="Traffic Channel"
                  name="trafficSource"
                  register={register}
                  error={errors.trafficSource}
                  required
                  tooltip="Traffic Source like Google Ads"
                  options={adPlatforms}
                  visibleOptions={7}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Revenue Per Click (RPC)"
                    name="epc"
                    register={(name, rules = {}) =>
                      register(name, {
                        ...rules,
                        min: { value: 0, message: "RPC cannot be negative" },
                      })
                    }
                    error={errors.epc}
                    placeholder="0.00"
                    type="number"
                    min={0}
                    preventNegative
                    icon={<span className="text-sm">$</span>}
                    tooltip="Revenue Per Click"
                  />
                  <InputField
                    label="Spend Per Click (SPC)"
                    name="cpc"
                    register={(name, rules = {}) =>
                      register(name, {
                        ...rules,
                        min: { value: 0, message: "CPC cannot be negative" },
                      })
                    }
                    error={errors.cpc}
                    placeholder="0.00"
                    type="number"
                    min={0}
                    preventNegative
                    icon={<span className="text-sm">$</span>}
                    tooltip="Spend Per Click"
                    step="0.1"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide">
                    Campaign State <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {statusOptions.map((opt) => {
                      const isOn = activeStatus === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setActiveStatus(opt.name)}
                          className="flex items-center justify-between rounded-md border border-[#d5d9e4] bg-white px-3 py-2 cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-[#2f3a52]">{opt.name}</span>
                          <span
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isOn ? "bg-[#3c79ff]" : "bg-[#d1d5db]"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                isOn ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="max-w-3xl flex justify-end items-center gap-3 mt-6">
                {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleOpenReview}
                      className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                    >
                      <svg class="svg-inline--fa fa-floppy-disk me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"></path></svg>
                      <span>
                        Save Changes
                      </span>
                    </button>
                  ) : null}
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                >
                  Proceed <span className="ml-2">&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Money Pages */}
          {step === 2 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="space-y-6">
                <div className="flex items-center">
                  <h2 className="text-left text-[22px] font-extrabold text-[#141824]">
                    Where do we send legit visitors (revenue pages)?
                  </h2>
                </div>

                <div className="space-y-4">
                  {Array.isArray(moneyPages) && moneyPages.length > 0 ? (
                    moneyPages.map((page, index) => (
                      <div
                        key={index}
                        className="space-y-4"
                      >
                        <InputField
                          label="Page Description"
                          name={`money_page.${index}.description`}
                          register={register}
                          placeholder="Enter description"
                          defaultValue={page.description || ""}
                          tooltip="Brief label shown in reports"
                        />

                        <InputField
                          label="Revenue Page Url"
                          name={`money_page.${index}.url`}
                          register={register}
                          error={errors.money_page?.[index]?.url}
                          required
                          placeholder="https://www.example.com"
                          pattern={{
                            value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                            message: "Enter a valid URL",
                          }}
                          tooltip="Destination URL for valid visitors"
                        />

                        <InputField
                          label="Traffic Weight"
                          name={`money_page.${index}.weight`}
                          register={register}
                          error={errors.money_page?.[index]?.weight}
                          placeholder="100"
                          type="number"
                          tooltip="Distribution priority for revenue pages"
                        />

                        <div className="flex items-center gap-2 pt-1">
                          {moneyPages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMoneyPage(index)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {index === moneyPages.length - 1 && (
                            <button
                              type="button"
                              onClick={addMoneyPage}
                              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                            >
                              <Plus className="w-4 h-4" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <p className="text-gray-400 text-sm">
                        No money pages added yet.
                      </p>
                      <button
                        type="button"
                        onClick={addMoneyPage}
                        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                  >
                    ‹ Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleOpenReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
                    >
                      <svg class="svg-inline--fa fa-floppy-disk me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"></path></svg>
                      <span>
                        Save Changes
                      </span>
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff]  hover:bg-[#356ee6] cursor-pointer !text-white"
                    >
                      Next ›
                    </button>

                  </div>
                </div>
              </div>
              {showAlert && (
                <CustomAlertModal
                  message={alertMessage}
                  onClose={hideCustomAlert}
                />
              )}
            </div>
          )}

          {/* Step 3: Safe Page */}
          {step === 3 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="space-y-6">
                <h2 className="text-left text-[22px] font-extrabold text-[#141824]">Protected Page</h2>
                <div>
                  <InputField
                    label="Protected Page Url"
                    name="safe_page"
                    register={register}
                    error={errors.safe_page}
                    required
                    placeholder="https://www.example.com"
                    defaultValue="https://www.youtube.com"
                    pattern={{
                      value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                      message: "Enter a valid URL",
                    }}
                    tooltip="Protected page where bots/reviewers go"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                  >
                    ‹ Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleOpenReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
                    >
                      <svg class="svg-inline--fa fa-floppy-disk me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"></path></svg>
                      <span>
                        Save Changes
                      </span>
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                    >
                      Next ›
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Conditions */}
          {step === 4 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="space-y-6">
                {/* ADD CONDITION DROPDOWN */}
                <div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddCondition(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-56 text-left bg-white text-[#141824] text-sm px-3 py-2.5 rounded-md border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors cursor-pointer"
                  >
                    <option value="">+ Add Criteria</option>

                    {OPTIONS.filter(
                      (o) => !selectedTypes.includes(o.value)
                    ).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CONDITIONS LIST */}
                <div className="space-y-5">
                  {fields.map((fieldItem, idx) => {
                    const currentType = fieldItem.type;

                    /** DATA SOURCE BASED ON TYPE */
                    let dataList = [];
                    if (currentType === "country") dataList = COUNTRY_LIST;

                    if (currentType === "browser") dataList = BROWSER_LIST;
                    if (currentType === "Device") dataList = DEVICE_LIST;

                    const isDropdown = [
                      "country",
                      "browser",
                      "Device",
                    ].includes(currentType);

                    return (
                      <div
                        key={fieldItem.id}
                        className="bg-white border border-[#d5d9e4] rounded-sm p-4"
                      >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#1f2a44]">
                            {currentType.toUpperCase()}
                          </h4>
                          <Tooltip
                            title="Delete"
                            placement="top"
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#ffffff",
                                  color: "#64748b",
                                  border: "1px solid #d5d9e4",
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                                },
                              },
                              arrow: {
                                sx: {
                                  color: "#ffffff",
                                  "&::before": { border: "1px solid #d5d9e4" },
                                },
                              },
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="inline-flex items-center justify-center p-1 text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>

                        {/* MODE RADIO */}
                        <Controller
                          control={control}
                          name={`conditions.${idx}.mode`}
                          render={({ field }) => (
                            <div className="flex gap-5 mb-3">
                              {["allow", "block"].map((mode) => {
                                const isChecked = (field.value || "allow") === mode;
                                return (
                                  <label
                                    key={mode}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#334155] cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`conditions-mode-${idx}`}
                                      value={mode}
                                      checked={isChecked}
                                      onChange={() => field.onChange(mode)}
                                      className="h-4 w-4 cursor-pointer accent-[#3c79ff]"
                                    />
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        />

                        {/* MULTI VALUES FIELD */}
                        <Controller
                          control={control}
                          name={`conditions.${idx}.values`}
                          render={({ field }) => (
                            <div>
                              {/* CHIPS */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {field.value?.map((val, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center bg-slate-700  px-2.5 py-1 text-xs rounded-full border border-slate-600"
                                  >
                                    {(() => {
                                      const listSource =
                                        currentType === "country"
                                          ? COUNTRY_LIST
                                          : currentType === "browser"
                                          ? BROWSER_LIST
                                          : currentType === "Device"
                                          ? DEVICE_LIST
                                          : [];
                                      const itemMeta = listSource.find(
                                        (entry) => getConditionOptionLabel(entry) === val
                                      );
                                      const iconNode = renderCriteriaOptionIcon(
                                        currentType,
                                        itemMeta,
                                        val
                                      );
                                      if (!iconNode) return null;
                                      return <span className="mr-1.5 inline-flex">{iconNode}</span>;
                                    })()}
                                    {val}
                                    <Tooltip
                                      title="Remove"
                                      placement="top"
                                      arrow
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            bgcolor: "#ffffff",
                                            color: "#64748b",
                                            border: "1px solid #d5d9e4",
                                            fontSize: "12px",
                                            fontWeight: 400,
                                            boxShadow:
                                              "0 8px 24px rgba(15,23,42,0.08)",
                                          },
                                        },
                                        arrow: {
                                          sx: {
                                            color: "#ffffff",
                                            "&::before": {
                                              border: "1px solid #d5d9e4",
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          field.onChange(
                                            field.value.filter((_, id) => id !== i)
                                          )
                                        }
                                        className="ml-1 text-slate-600 hover:text-slate-800 cursor-pointer inline-flex items-center justify-center"
                                      >
                                        <XIcon className="w-3.5 h-3.5" />
                                      </button>
                                    </Tooltip>
                                  </span>
                                ))}
                              </div>

                              {/* DROPDOWN OR TEXT INPUT */}
                              {isDropdown ? (
                                <div
                                  className="relative"
                                  tabIndex={0}
                                  onBlur={(e) => {
                                    if (!e.currentTarget.contains(e.relatedTarget)) {
                                      setOpenCountryDropdownIndex(null);
                                      setCountrySearchByIndex((prev) => ({
                                        ...prev,
                                        [idx]: "",
                                      }));
                                    }
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenCountryDropdownIndex((prev) =>
                                        prev === idx ? null : idx
                                      )
                                    }
                                    className="w-full flex items-center justify-between bg-white text-[#141824] text-sm px-3 py-2.5 rounded-sm border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] cursor-pointer transition-colors"
                                  >
                                    <span>Select {currentType === "Device" ? "device" : currentType}</span>
                                    <ChevronDown className="w-4 h-4 text-[#667085]" />
                                  </button>

                                  {openCountryDropdownIndex === idx ? (
                                    <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-sm border border-[#d5d9e4] bg-white shadow-md">
                                      <div className="sticky top-0 z-10 bg-white border-b border-[#e2e8f0] p-2">
                                        <input
                                          type="text"
                                          value={getCountrySearchValue(idx)}
                                          onChange={(e) =>
                                            setCountrySearchByIndex((prev) => ({
                                              ...prev,
                                              [idx]: e.target.value,
                                            }))
                                          }
                                          placeholder={`Search ${currentType === "Device" ? "device" : currentType}...`}
                                          className="w-full bg-white text-[#141824] text-sm px-2.5 py-2 rounded-sm border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
                                        />
                                      </div>

                                      {dataList.filter((item) => {
                                        const optionLabel = getConditionOptionLabel(item);
                                        const query = getCountrySearchValue(idx).trim().toLowerCase();
                                        const codeMatch =
                                          currentType === "country"
                                            ? String(item.code || "")
                                                .toLowerCase()
                                                .includes(query)
                                            : false;
                                        if (!query) return true;
                                        return optionLabel.toLowerCase().includes(query) || codeMatch;
                                      }).length === 0 ? (
                                        <div className="px-3 py-2 text-xs text-[#64748b]">
                                          No {currentType === "Device" ? "device" : currentType} found
                                        </div>
                                      ) : null}

                                      {dataList.map((item) => {
                                        const optionLabel = getConditionOptionLabel(item);
                                        const alreadyAdded = field.value.includes(optionLabel);
                                        const query = getCountrySearchValue(idx).trim().toLowerCase();
                                        const codeMatch =
                                          currentType === "country"
                                            ? String(item.code || "")
                                                .toLowerCase()
                                                .includes(query)
                                            : false;
                                        if (
                                          query &&
                                          !optionLabel.toLowerCase().includes(query) &&
                                          !codeMatch
                                        ) {
                                          return null;
                                        }

                                        const iconNode = renderCriteriaOptionIcon(
                                          currentType,
                                          item,
                                          optionLabel
                                        );

                                        return (
                                          <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                              if (!alreadyAdded) {
                                                field.onChange([...field.value, optionLabel]);
                                              }
                                              setOpenCountryDropdownIndex(null);
                                              setCountrySearchByIndex((prev) => ({
                                                ...prev,
                                                [idx]: "",
                                              }));
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-[#1f2a44] hover:bg-[#f4f7ff] cursor-pointer disabled:opacity-50"
                                            disabled={alreadyAdded}
                                          >
                                            {iconNode ? iconNode : null}
                                            <span className="truncate flex-1">{optionLabel}</span>
                                            {alreadyAdded ? (
                                              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#e8efff] text-[#2f6bff]">
                                                Added
                                              </span>
                                            ) : null}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  placeholder={`Enter ${currentType}...`}
                                  className="w-full text-sm bg-white text-[#141824] px-3 py-2.5 rounded-sm border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors cursor-pointer"
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                      field.onChange([
                                        ...field.value,
                                        e.target.value.trim(),
                                      ]);
                                      e.target.value = "";
                                    }
                                  }}
                                />
                              )}
                              {errors?.conditions?.[idx]?.values?.message ? (
                                <p className="mt-1 text-xs text-red-500 text-left">
                                  {errors.conditions[idx].values.message}
                                </p>
                              ) : null}
                            </div>
                          )}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* STEP BUTTONS */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                  >
                    ‹ Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleOpenReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
                    >
                      <svg class="svg-inline--fa fa-floppy-disk me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"></path></svg>
                      <span>
                        Save Changes
                      </span>
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    {fields.length > 0 && (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                      >
                        Next ›
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Filters */}
          {step === 5 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none w-full"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Controller
                    name="filters"
                    control={control}
                    render={({ field }) => {
                      const [availableOptions, setAvailableOptions] = useState(
                        fixedOptions.filter(
                          (opt) =>
                            !(field.value || []).some(
                              (sel) => sel.id === opt.id
                            )
                        )
                      );
                      const [selectedOptions, setSelectedOptions] = useState(
                        field.value || []
                      );
                      const [selectedLeft, setSelectedLeft] = useState([]);
                      const [selectedRight, setSelectedRight] = useState([]);
                      const [searchLeft, setSearchLeft] = useState("");
                      const [searchRight, setSearchRight] = useState("");
                      const [activePane, setActivePane] = useState("left");

                      const moveRightByIds = (ids) => {
                        const moved = availableOptions.filter((o) =>
                          ids.includes(o.id.toString())
                        );
                        if (!moved.length) return;
                        const updatedSelected = [...selectedOptions, ...moved];
                        setSelectedOptions(updatedSelected);
                        setAvailableOptions(
                          availableOptions.filter(
                            (o) => !ids.includes(o.id.toString())
                          )
                        );
                        setSelectedLeft([]);
                        setValue("filters", updatedSelected);
                        clearErrors("filters");
                      };
                      const moveRight = () => moveRightByIds(selectedLeft);
                      const moveLeft = () => {
                        const moved = selectedOptions.filter((o) =>
                          selectedRight.includes(o.id.toString())
                        );
                        const updatedAvailable = [
                          ...availableOptions,
                          ...moved,
                        ];
                        const updatedSelected = selectedOptions.filter(
                          (o) => !selectedRight.includes(o.id.toString())
                        );
                        setAvailableOptions(updatedAvailable);
                        setSelectedOptions(updatedSelected);
                        setSelectedRight([]);
                        setValue("filters", updatedSelected);
                        if (updatedSelected.length > 0) {
                          clearErrors("filters");
                        }
                      };
                      const moveAllRight = () => {
                        const updatedSelected = [
                          ...selectedOptions,
                          ...availableOptions,
                        ];
                        setSelectedOptions(updatedSelected);
                        setAvailableOptions([]);
                        setSelectedLeft([]);
                        setValue("filters", updatedSelected);
                        clearErrors("filters");
                      };
                      const moveAllLeft = () => {
                        const updatedAvailable = [
                          ...availableOptions,
                          ...selectedOptions,
                        ];
                        setAvailableOptions(updatedAvailable);
                        setSelectedOptions([]);
                        setSelectedRight([]);
                        setValue("filters", []);
                      };

                      const filteredAvailable = availableOptions.filter((item) =>
                        item.label.toLowerCase().includes(searchLeft.toLowerCase())
                      );
                      const filteredSelected = selectedOptions.filter((item) =>
                        item.label.toLowerCase().includes(searchRight.toLowerCase())
                      );

                      const toggleLeft = (id) => {
                        const value = String(id);
                        setSelectedLeft((prev) =>
                          prev.includes(value)
                            ? prev.filter((x) => x !== value)
                            : [...prev, value]
                        );
                      };

                      const toggleRight = (id) => {
                        const value = String(id);
                        setSelectedRight((prev) =>
                          prev.includes(value)
                            ? prev.filter((x) => x !== value)
                            : [...prev, value]
                        );
                      };

                      const handleTransferKeyDown = (e) => {
                        const tag = e.target?.tagName?.toLowerCase();
                        if (tag === "input" || tag === "textarea") return;

                        if (e.key === "Enter" && activePane === "left") {
                          e.preventDefault();
                          const focusedLeftId =
                            e.target?.dataset?.transferSide === "left"
                              ? String(e.target.dataset.transferId)
                              : null;
                          const idsToMove =
                            selectedLeft.length > 0
                              ? selectedLeft
                              : focusedLeftId
                              ? [focusedLeftId]
                              : [];
                          moveRightByIds(idsToMove);
                        }
                        if (
                          (e.key === "Backspace" || e.key === "Delete") &&
                          activePane === "right"
                        ) {
                          e.preventDefault();
                          moveLeft();
                        }
                      };

                      return (
                        <div
                          className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start"
                          onKeyDown={handleTransferKeyDown}
                        >
                          <div
                            className="rounded-md border border-[#d5d9e4] bg-white p-3 transition-all duration-150"
                            onFocusCapture={() => setActivePane("left")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[13px] font-semibold text-[#2f3a55]">
                                Available Filters
                              </label>
                              <span className="text-[11px] text-[#64748b]">
                                {availableOptions.length} total
                              </span>
                            </div>
                            <input
                              type="text"
                              value={searchLeft}
                              onChange={(e) => setSearchLeft(e.target.value)}
                              placeholder="Search filters..."
                              className="w-full mb-2 bg-white text-[#141824] text-sm px-3 py-2 rounded-sm border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
                            />
                            <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
                              {filteredAvailable.length === 0 ? (
                                <p className="text-xs text-[#64748b] px-2 py-3 text-left">
                                  No filters found
                                </p>
                              ) : (
                                filteredAvailable.map((item) => {
                                  const isSelected = selectedLeft.includes(String(item.id));
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => toggleLeft(item.id)}
                                      data-transfer-side="left"
                                      data-transfer-id={item.id}
                                      className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors cursor-pointer text-[12px] ${
                                        isSelected
                                          ? "bg-[#eef4ff] border-[#3c79ff] text-[#1d4ed8]"
                                          : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]"
                                      }`}
                                    >
                                      <span className="inline-flex items-center gap-2">
                                        {isSelected ? (
                                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#3c79ff] text-white">
                                            <Check className="w-2.5 h-2.5" />
                                          </span>
                                        ) : (
                                          <span className="inline-flex h-4 w-4 rounded-full border border-[#cbd5e1]" />
                                        )}
                                        <span>{item.label}</span>
                                        {["business", "government", "wireless"].includes(
                                          String(item.label).toLowerCase()
                                        ) ? (
                                          <span className="ml-1 rounded-full border border-[#f5cfa1] bg-[#fff7ed] px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-[#b45309]">
                                            Not Recommended
                                          </span>
                                        ) : null}
                                      </span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          <div className="flex lg:flex-col items-center justify-center gap-2 lg:gap-3 py-1 lg:self-center">
                            <button
                              type="button"
                              onClick={moveRight}
                              className="w-8 h-8 rounded-md border border-[#d5d9e4] bg-white text-[#3c79ff] hover:bg-[#f4f7ff] cursor-pointer font-semibold transition-all duration-150"
                              title="Move selected right"
                            >
                              &gt;
                            </button>
                            <button
                              type="button"
                              onClick={moveLeft}
                              className="w-8 h-8 rounded-md border border-[#d5d9e4] bg-white text-[#3c79ff] hover:bg-[#f4f7ff] cursor-pointer font-semibold transition-all duration-150"
                              title="Move selected left"
                            >
                              &lt;
                            </button>
                            <button
                              type="button"
                              onClick={moveAllRight}
                              className="w-8 h-8 rounded-md border border-[#d5d9e4] bg-white text-[#3c79ff] hover:bg-[#f4f7ff] cursor-pointer font-semibold transition-all duration-150"
                              title="Move all right"
                            >
                              {" >> "}
                            </button>
                            <button
                              type="button"
                              onClick={moveAllLeft}
                              className="w-8 h-8 rounded-md border border-[#d5d9e4] bg-white text-[#3c79ff] hover:bg-[#f4f7ff] cursor-pointer font-semibold transition-all duration-150"
                              title="Move all left"
                            >
                              {" << "}
                            </button>
                          </div>

                          <div
                            className="rounded-md border border-[#d5d9e4] bg-white p-3 transition-all duration-150"
                            onFocusCapture={() => setActivePane("right")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[13px] font-semibold text-[#2f3a55]">
                                Enabled Filters
                              </label>
                              <span className="text-[11px] text-[#64748b]">
                                {selectedOptions.length} selected
                              </span>
                            </div>
                            <input
                              type="text"
                              value={searchRight}
                              onChange={(e) => setSearchRight(e.target.value)}
                              placeholder="Search enabled..."
                              className="w-full mb-2 bg-white text-[#141824] text-sm px-3 py-2 rounded-sm border border-[#d5d9e4] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
                            />
                            <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
                              {filteredSelected.length === 0 ? (
                                <p className="text-xs text-[#64748b] px-2 py-3 text-left">
                                  No enabled filters
                                </p>
                              ) : (
                                filteredSelected.map((item) => {
                                  const isSelected = selectedRight.includes(String(item.id));
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => toggleRight(item.id)}
                                      data-transfer-side="right"
                                      data-transfer-id={item.id}
                                      className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors cursor-pointer text-[12px] ${
                                        isSelected
                                          ? "bg-[#eef4ff] border-[#3c79ff] text-[#1d4ed8]"
                                          : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]"
                                      }`}
                                    >
                                      <span className="inline-flex items-center gap-2">
                                        {isSelected ? (
                                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#3c79ff] text-white">
                                            <Check className="w-2.5 h-2.5" />
                                          </span>
                                        ) : (
                                          <span className="inline-flex h-4 w-4 rounded-full border border-[#cbd5e1]" />
                                        )}
                                        <span>{item.label}</span>
                                        {["business", "government", "wireless"].includes(
                                          String(item.label).toLowerCase()
                                        ) ? (
                                          <span className="ml-1 rounded-full border border-[#f5cfa1] bg-[#fff7ed] px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-[#b45309]">
                                            Not Recommended
                                          </span>
                                        ) : null}
                                      </span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
                <div className="rounded-sm border border-[#d5d9e4] bg-[#f8fbff] px-3 py-2 text-[12px] text-[#475569] flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#2f3a55]">Live Summary:</span>
                  <span>Enabled: {selectedFiltersCount}</span>
                  <span className="text-[#94a3b8]">|</span>
                  <span>Available: {Math.max(0, fixedOptions.length - selectedFiltersCount)}</span>
                  <span className="text-[#94a3b8]">|</span>
                  <span className="text-[#64748b]">Tip: Use Enter to move right, Backspace/Delete to move left.</span>
                </div>
                {errors?.filters?.message ? (
                  <p className="mt-1 text-xs text-red-500 text-left">{errors.filters.message}</p>
                ) : null}
                {/* =========BUTTONS LOWER */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                  >
                    ‹ Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleOpenReview}
                      className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                    >
                      <svg class="svg-inline--fa fa-floppy-disk me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"></path></svg>
                      <span>
                        Save Changes
                      </span>
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                    >
                      Next ›
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Automate */}
          {step === 6 && (
            <div
              className="bg-transparent rounded-none p-0 shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="space-y-6">
                <div className="rounded-md border border-[#d5d9e4] bg-gradient-to-b from-white to-[#f9fbff] px-5 py-4 text-left">
                  <h3 className="text-[22px] leading-tight font-extrabold text-[#141824]">Automation Command Center</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748b]">
                    Configure launch-time behavior, response mode, and runtime protection.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[15px] font-semibold text-[#1e293b]">Activate After Unique Real Visitors</p>
                            <p className="text-[12px] leading-relaxed text-[#64748b] mt-1.5">
                              Trigger rule only after minimum real visits.
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={Boolean(showInputs.afterX)}
                              onChange={() =>
                                setShowInputs((p) => ({
                                  ...p,
                                  afterX: !p.afterX,
                                }))
                              }
                              className="peer sr-only"
                            />
                            <span className="h-6 w-11 rounded-full bg-[#d5d9e4] transition peer-checked:bg-[#3c79ff]" />
                            <span className="absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                          </label>
                        </div>

                        {showInputs.afterX && (
                          <div className="mt-4">
                            <InputField
                              label="Unique Visitor Count"
                              name="afterX"
                              register={register}
                              type="number"
                              placeholder="Enter number of visitors"
                            />
                          </div>
                        )}
                      </div>

                      <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[15px] font-semibold text-[#1e293b]">Frequency Cap</p>
                            <p className="text-[12px] leading-relaxed text-[#64748b] mt-1.5">
                              Control how often the same user is redirected.
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={showInputs.frequencyCap}
                              onChange={() =>
                                setShowInputs((p) => ({
                                  ...p,
                                  frequencyCap: !p.frequencyCap,
                                }))
                              }
                              className="peer sr-only"
                            />
                            <span className="h-6 w-11 rounded-full bg-[#d5d9e4] transition peer-checked:bg-[#3c79ff]" />
                            <span className="absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                          </label>
                        </div>

                        {showInputs.frequencyCap && (
                          <div className="mt-4">
                            <InputField
                              label="Cap Value"
                              name="automate.frequencyCap.value"
                              register={register}
                              type="number"
                              placeholder="Enter frequency value"
                            />
                          </div>
                        )}
                      </div>

                      <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[15px] font-semibold text-[#1e293b]">Zero Redirect Cloaking</p>
                            <p className="text-[12px] leading-relaxed text-[#64748b] mt-1.5">
                              Choose one delivery method at a time.
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={showInputs.zeroRedirect}
                              onChange={() =>
                                setShowInputs((p) => ({
                                  ...p,
                                  zeroRedirect: !p.zeroRedirect,
                                }))
                              }
                              className="peer sr-only"
                            />
                            <span className="h-6 w-11 rounded-full bg-[#d5d9e4] transition peer-checked:bg-[#3c79ff]" />
                            <span className="absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                          </label>
                        </div>

                        {showInputs.zeroRedirect && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <label className="flex items-center gap-2 rounded-md border border-[#d5d9e4] bg-[#f8fafc] px-3.5 py-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={watch("automate.zeroRedirect.curl")}
                                onChange={(e) => {
                                  setValue("automate.zeroRedirect.curl", e.target.checked);
                                  if (e.target.checked) setValue("automate.zeroRedirect.iframe", false);
                                }}
                              />
                              <span className="text-[13px] font-semibold text-[#334155]">CURL</span>
                            </label>
                            <label className="flex items-center gap-2 rounded-md border border-[#d5d9e4] bg-[#f8fafc] px-3.5 py-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={watch("automate.zeroRedirect.iframe")}
                                onChange={(e) => {
                                  setValue("automate.zeroRedirect.iframe", e.target.checked);
                                  if (e.target.checked) setValue("automate.zeroRedirect.curl", false);
                                }}
                              />
                              <span className="text-[13px] font-semibold text-[#334155]">IFRAME</span>
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                        <p className="text-[15px] font-semibold text-[#1e293b]">Tracking Controls</p>
                        <p className="text-[12px] leading-relaxed text-[#64748b] mt-1.5">Enable/disable support identifiers.</p>
                        <div className="mt-4 space-y-2.5">
                          <label className="flex items-center justify-between rounded-md border border-[#d5d9e4] bg-[#f8fafc] px-3.5 py-2.5 cursor-pointer">
                            <span className="text-[13px] font-semibold text-[#334155]">GCLID (Google Click ID)</span>
                            <input type="checkbox" {...register("automate.gclid")} className="h-4 w-4 accent-[#3c79ff]" />
                          </label>
                          <label className="flex items-center justify-between rounded-md border border-[#d5d9e4] bg-[#f8fafc] px-3.5 py-2.5 cursor-pointer">
                            <span className="text-[13px] font-semibold text-[#334155]">IP Cap</span>
                            <input type="checkbox" {...register("automate.ipCap")} className="h-4 w-4 accent-[#3c79ff]" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[15px] font-semibold text-[#1e293b]">Page Guard Key</p>
                          <p className="text-[12px] leading-relaxed text-[#64748b] mt-1.5">
                            Configure secret key, URL, and wait duration.
                          </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={showInputs.pageGuard}
                            onChange={() =>
                              setShowInputs((p) => ({
                                ...p,
                                pageGuard: !p.pageGuard,
                              }))
                            }
                            className="peer sr-only"
                          />
                          <span className="h-6 w-11 rounded-full bg-[#d5d9e4] transition peer-checked:bg-[#3c79ff]" />
                          <span className="absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </label>
                      </div>

                      {showInputs.pageGuard && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <InputField
                            label="Key"
                            name="page_guard.key"
                            register={register}
                            placeholder="Enter key"
                          />
                          <InputField
                            label="URL"
                            name="page_guard.url"
                            register={register}
                            error={errors.page_guard?.url}
                            placeholder="Enter URL"
                            pattern={{
                              value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                              message: "Enter a valid URL ",
                            }}
                          />
                          <InputField
                            label="Second"
                            name="page_guard.second"
                            register={register}
                            placeholder="Enter second field"
                          />
                        </div>
                      )}
                    </div>

                    <div className="rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                      <p className="text-[15px] font-semibold text-[#1e293b]">HTTP Redirect Code</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 rounded-md border border-[#d5d9e4] px-3.5 py-2.5 bg-[#f8fafc] cursor-pointer">
                          <input type="radio" value="301" {...register("http_code")} className="accent-[#3c79ff]" />
                          <span className="text-[13px] font-semibold text-[#334155]">301</span>
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-md border border-[#d5d9e4] px-3.5 py-2.5 bg-[#f8fafc] cursor-pointer">
                          <input type="radio" value="302" {...register("http_code")} className="accent-[#3c79ff]" />
                          <span className="text-[13px] font-semibold text-[#334155]">302</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1">
                    <div className="xl:sticky xl:top-24 rounded-md border border-[#d5d9e4] bg-white p-5 text-left">
                      <h4 className="text-[18px] font-extrabold text-[#141824]">Launch Readiness</h4>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[#64748b]">Quick snapshot before you submit.</p>
                      <div className="mt-4 space-y-2.5">
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">Campaign Name</span>
                          <span className="text-[12px] font-semibold text-[#1e293b] truncate max-w-[150px]">
                            {watch("campaignName") || "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">Revenue Pages</span>
                          <span className="text-[12px] font-semibold text-[#1e293b]">{(watch("money_page") || []).length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">Criteria Rules</span>
                          <span className="text-[12px] font-semibold text-[#1e293b]">{(watch("conditions") || []).length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">Filters Enabled</span>
                          <span className="text-[12px] font-semibold text-[#1e293b]">{(watch("filters") || []).length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">HTTP Code</span>
                          <span className="text-[12px] font-semibold text-[#1e293b]">{watch("http_code") || "301"}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-sm border border-[#e2e8f0] px-3.5 py-2.5">
                          <span className="text-[12px] text-[#64748b]">Campaign Status</span>
                          <span className="text-[12px] font-semibold text-[#1e293b]">{activeStatus || "-"}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-2.5">
                        <button
                          type="button"
                          onClick={handleOpenReview}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                        >
                          {location?.state?.mode === "edit" ? "Update" : "Create"} Campaign
                        </button>
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[13px] border border-[#d5d9e4] text-[#475569] bg-white hover:bg-[#f8fafc] cursor-pointer"
                        >
                          ‹ Previous
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        </div>

          <aside className="hidden xl:block sticky top-24">
            <nav aria-label="Progress">
              <ol role="list" className="relative pl-0 space-y-6">
                {steps.map((s, idx) => {
                  const isCurrent = idx + 1 === step;
                  const isDone = idx + 1 <= step;
                  const isConnectorDone = idx + 1 < step;
                  return (
                    <li key={s.name} className="relative flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleStepClick(idx + 1)}
                        className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-[6px] cursor-pointer transition-colors ${
                          isDone
                            ? "border-[#3c79ff] bg-[#3c79ff] text-white"
                            : "border-[#ccd1dd] bg-[#f2f5fa] text-[#525B75]"
                        }`}
                      >
                        <s.icon
                          className="h-4 w-4"
                          strokeWidth={2.6}
                          style={{ color: isDone ? "#ffffff" : "#525B75" }}
                        />
                      </button>
                      <span
                        className={`text-[15px] leading-none ${
                          isCurrent ? "text-[#3c79ff] font-semibold" : "text-[#4f5d79]"
                        }`}
                      >
                        {s.name}
                      </span>
                      {idx < steps.length - 1 && (
                        <span
                          className={`absolute left-[17px] top-[36px] h-6 w-[2px] ${
                            isConnectorDone ? "bg-[#3c79ff]" : "bg-[#525B75]"
                          }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>
        </div>

        {showAlert && (
          <CustomAlertModal message={alertMessage} onClose={hideCustomAlert} />
        )}
        {showReviewModal && (
          <div className="fixed inset-0 z-[1200] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl rounded-lg border border-[#d5d9e4] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#141824] text-left">Review Campaign</h3>
              <p className="text-sm text-[#64748b] text-left mt-1">
                Please verify the key values before final submit.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Campaign</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {reviewData?.campaignName || "-"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Traffic Source</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {reviewData?.trafficSource || "-"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Revenue Pages</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {(reviewData?.money_page || []).length}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Filters Enabled</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {(reviewData?.filters || []).length}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Safe Page</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1 break-all">
                    {reviewData?.safe_page || "-"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">HTTP Code</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {reviewData?.http_code || "301"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Status</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {reviewData?.status || activeStatus || "-"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">EPC / CPC</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {reviewData?.epc ?? "-"} / {reviewData?.cpc ?? "-"}
                  </p>
                </div>
                <div className="rounded-sm border border-[#e2e8f0] p-3 text-left">
                  <p className="text-[11px] uppercase tracking-wide text-[#64748b]">Conditions</p>
                  <p className="text-sm font-semibold text-[#1e293b] mt-1">
                    {(reviewData?.conditions || []).length}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                >
                  ‹ Back to Edit
                </button>
                <button
                  type="button"
                  onClick={() => onSubmit(reviewData || getValues())}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
                >
                  Confirm & Submit ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}





