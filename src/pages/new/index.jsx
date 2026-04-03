

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { BROWSER_LIST, COUNTRY_LIST, DEVICE_LIST } from "../../data/dataList";
import { showErrorToast, showSuccessToast } from "../../components/toast/toast";
import { adPlatforms, fixedOptions, OPTIONS } from "./constants";
import { defaultValues } from "./defaultValues";
import {
  CustomAlertModal,
  InputField,
  SelectField,
  StatusButton,
  DashboardLayout,
} from "./components/Fields";
import {
  useCampaignQuery,
  useCreateCampaign,
  useUpdateCampaign,
} from "./hooks/useCampaignApi";

/* ===========================
   Icon components (inline SVG)
   (kept from original parts)
   =========================== */
const ListChecks = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </svg>
);
const DollarSign = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ShieldCheck = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const GitMerge = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 1 9 9" />
  </svg>
);
const Filter = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const Bot = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
const Info = ({ className }) => (
  <svg
    className={className}
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
const Play = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const Zap = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const CircleSlash = ({ className }) => (
  <svg
    className={className}
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
const CalendarDays = ({ className }) => (
  <svg
    className={className}
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
const MessageCircle = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const Plus = ({ className }) => (
  <svg
    className={className}
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
const XIcon = ({ className }) => (
  <svg
    className={className}
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
   Main Combined Component
   =========================== */

const queryClient = new QueryClient();

function CampaignBuilderInner() {
  // useState: UI state (needs re-render on change)
  const [step, setStep] = useState(1);
  const [moneyPages, setMoneyPages] = useState([
    { description: "", url: "", weight: 100 },
  ]);
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const [appendUrl, setAppendUrl] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showInputs, setShowInputs] = useState({
    activateAfterX: false,
    frequencyCap: false,
    zeroRedirect: false,
    pageGuard: false,
  });
  const [editCampaignId, setEditCampaignId] = useState(null);

  const [activeStatus, setActiveStatus] = useState("Active");

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
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();



  const navigate = useNavigate();
  const location = useLocation();

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

  const { data: campaignData } = useCampaignQuery(editCampaignId);


  // useEffect required: edit mode detection -> set id
  useEffect(() => {
    if (location?.state?.mode === "edit" && location.state.id) {
      setEditCampaignId(location.state.id);
    }
  }, [location.state]);

  // useEffect required: fetch data when id is set (side-effect)
  useEffect(() => {
    if (!campaignData) return;
    const c = campaignData;

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
      afterX: c?.afterX,
      automate: c?.automate,
      page_guard: c?.page_guard,
      http_code: c?.http_code,
    });

    setMoneyPages(
      c?.money_page || [{ description: "", url: "", weight: 100 }]
    );
    setDynamicVariables(c?.dynamicVariables || []);
    setActiveStatus(c?.status);
  }, [campaignData, reset]);




  // options copied from parts
  // useMemo candidate: large static list
  // useMemo candidate: static list
  // useMemo candidate: static list
  // useMemo candidate: static list
  const steps = [
    { id: 1, name: "Campaign info", icon: ListChecks },
    { id: 2, name: "Money Pages", icon: DollarSign },
    { id: 3, name: "Safe Page", icon: ShieldCheck },
    { id: 4, name: "Conditions", icon: GitMerge },
    { id: 5, name: "Campaign Filters", icon: Filter },
    { id: 6, name: "Automate", icon: Bot },
  ];

  // useMemo candidate: static list
  const statusOptions = [
    { name: "Active", icon: Play },
    { name: "Allow", icon: Zap },
    { name: "Block", icon: CircleSlash },
    // { name: "Schedule", icon: CalendarDays },
  ];

  // useMemo candidate: derived value (or keep as direct watch)
  const afterXValue = watch("afterX");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });
  // useMemo candidate: derived from watch
  const selectedTypes = watch("conditions").map((c) => c.type);

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
    nextStep();
  };  


  const handleStepClick = async (targetStep) => {
  //  Backward movement  always allowed
  if (targetStep <= step) {
    setStep(targetStep);
    return;
  }

  //  Forward movement  validate CURRENT step only
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

  //  validation passed  go to clicked step
  setStep(targetStep);
};


  const onSubmit = async (data) => {
    try {
      // merge moneyPages from local state into data (to ensure latest)
      // data.money_page = moneyPages;
      data.status = activeStatus;
   

      if (location?.state?.mode === "edit") {
        const uid = location?.state?.id;
      
        const payload ={...data,campaign_info:{
          campaignName:data?.campaignName,
          trafficSource:data?.trafficSource,
          epc:data?.epc,
          cpc:data?.cpc,
          comment:data?.comment,
        }};
        

        await updateMutation.mutateAsync({ id: uid, payload });
    
        
        showSuccessToast("Campaign updated successfully!");
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            id:uid,
            data: location.state.data,
          },
        });
      } else {
  
        
        const response = await createMutation.mutateAsync(data);





        // use response to show success
        showSuccessToast(
          "Campaign created successfully! you are going to route to Integration page"
        );
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            data: response?.data?.data || response,
          },
        });
      }
    } catch (err) {
       if (err?.response?.status === 403) {
    showErrorToast("Campaign limit reached. Upgrade your plan ");
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

  const summaryCampaignName = watch("campaignName");
  const summaryTrafficSource = watch("trafficSource");
  const summarySafePage = watch("safe_page");
  const summaryMoneyPages = watch("money_page") || [];
  const summaryConditions = watch("conditions") || [];
  const summaryFilters = watch("filters") || [];
  const errorCount = Object.keys(errors || {}).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Campaign Builder</div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {location?.state?.mode === "edit" ? "Update" : "Create"} Campaign
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Build a cloaking-safe flow with smart routing, filters, and automation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500">
                Save Draft
              </button>
              <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-xs text-white">
                Validate
              </button>
            </div>
          </div>
        </div>

        {/* Summary + Validation */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Live Summary</div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Campaign Snapshot</h3>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-900 truncate max-w-[220px]">
                  {summaryCampaignName || "Untitled"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source</span>
                <span className="font-medium text-slate-900">{summaryTrafficSource || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                  {activeStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Money Pages</span>
                <span className="font-medium text-slate-900">{summaryMoneyPages.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Safe Page</span>
                <span className="font-medium text-slate-900 truncate max-w-[220px]">
                  {summarySafePage || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Conditions</span>
                <span className="font-medium text-slate-900">{summaryConditions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Filters</span>
                <span className="font-medium text-slate-900">{summaryFilters.length}</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Validation</div>
              <div className={`rounded-full px-3 py-1 text-xs ${errorCount ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                {errorCount ? `${errorCount} issues` : "All good"}
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              {errorCount ? "Resolve the highlighted fields before final submit." : "You can proceed safely."}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Campaign Info */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  1
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 1</div>
                  <div className="text-lg font-semibold text-slate-900">Campaign Info</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 1 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 1 && (
              <div className="border-t border-slate-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Campaign Details
                  </h2>
                  <InputField
                    label="Campaign Name"
                    name="campaignName"
                    register={register}
                    error={errors.campaignName}
                    required
                    placeholder="Enter a unique name"
                    tooltip="Enter Desired Campaign Name to identify it"
                  />
                  <InputField
                    label="Comment"
                    name="comment"
                    register={register}
                    error={errors.comment}
                    placeholder="Add a brief description"
                    tooltip="Comment for this campaign"
                  />
                  <SelectField
                    label="Traffic Source"
                    name="trafficSource"
                    register={register}
                    error={errors.trafficSource}
                    required
                    tooltip="Traffic Source like Google Ads"
                    options={adPlatforms}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Financials & Status
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="EPC (Earnings Per Click)"
                      name="epc"
                      register={register}
                      error={errors.epc}
                      placeholder="0.00"
                      type="number"
                      icon={<span className="text-sm">$</span>}
                      tooltip="Earnings Per Click"
                    />
                    <InputField
                      label="CPC (Cost Per Click)"
                      name="cpc"
                      register={(name) =>
                        register(name, {
                          min: { value: 0, message: "CPC cannot be negative" },
                        })
                      }
                      error={errors.cpc}
                      placeholder="0.00"
                      type="number"
                      icon={<span className="text-sm">$</span>}
                      tooltip="Cost Per Click"
                      step="0.1"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center text-sm font-medium text-slate-600 mb-3">
                      Campaign Status{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statusOptions.map((opt) => (
                        <StatusButton
                          key={opt.name}
                          label={opt.name}
                          Icon={opt.icon}
                          isActive={activeStatus === opt.name}
                          onClick={() => setActiveStatus(opt.name)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div></div>
                {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-1 rounded-md cursor-pointer"
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
                  className="bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold py-2 px-4 rounded-lg shadow transition cursor-pointer"
                >
                  Proceed <span className="ml-2">&rarr;</span>
                </button>
              </div>
              </div>
            )}
          </div>

          {/* Step 2: Money Pages */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  2
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 2</div>
                  <div className="text-lg font-semibold text-slate-900">Money Pages</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 2 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 2 && (
              <div className="border-t border-slate-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Where do we send legit visitors (money pages)?
                  </h2>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-600">
                      <span className="text-sm">Append URL</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded bg-slate-100"
                        checked={appendUrl}
                        onChange={() => setAppendUrl((v) => !v)}
                      />
                    </label>
                  </div>
                </div>

                {appendUrl && (
                  <InputField
                    label="APPEND URL VALUE"
                    name="append_url"
                    register={register}
                    placeholder="Enter URL to append"
                    tooltip="Add the parameters in moneypage URL"
                  />
                )}

                <div className="space-y-4">
                  {Array.isArray(moneyPages) && moneyPages.length > 0 ? (
                    moneyPages.map((page, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 border border-slate-200 p-4 rounded-lg"
                      >
                        <InputField
                          label="Description"
                          name={`money_page.${index}.description`}
                          register={register}
                          placeholder="Enter description"
                          defaultValue={page.description || ""}
                          tooltip="Short name visible in reports"
                        />

                        <InputField
                          label="Money Page Url"
                          name={`money_page.${index}.url`}
                          register={register}
                          error={errors.money_page?.[index]?.url}
                          required
                          placeholder="https://www.example.com"
                          pattern={{
                            value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                            message: "Enter a valid URL",
                          }}
                          tooltip="Money page for legit visitors"
                        />

                        <InputField
                          label="WEIGHT"
                          name={`money_page.${index}.weight`}
                          register={register}
                          error={errors.money_page?.[index]?.weight}
                          placeholder="100"
                          type="number"
                          tooltip="Priority weight for money pages"
                        />

                        <div className="flex items-center gap-2 justify-end">
                          {moneyPages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMoneyPage(index)}
                              className="bg-red-600 hover:bg-red-700 text-slate-900 p-2 rounded-md transition"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                          {index === moneyPages.length - 1 && (
                            <button
                              type="button"
                              onClick={addMoneyPage}
                              className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-3 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
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
                        className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-3 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-md font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    Dynamic variables
                    <Tooltip title="Dynamic variables are used to track custom parameters of money page">
                      <span className="text-slate-400">
                        <Info className="w-4 h-4" />
                      </span>
                    </Tooltip>
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Define variables and use [[name]] in money pages.
                  </p>

                  {dynamicVariables.map((variable, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end"
                    >
                      <InputField
                        label="VARIABLE NAME"
                        name={`money_variable.${idx}.name`}
                        register={register}
                        placeholder="Enter variable name"
                        defaultValue={variable.name}
                      />
                      <InputField
                        label="VARIABLE VALUE"
                        name={`money_variable.${idx}.value`}
                        register={register}
                        placeholder="Enter variable value"
                        defaultValue={variable.value}
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeDynamicVariable(idx)}
                          className="bg-red-600 hover:bg-red-700 text-slate-900 px-3 py-2 rounded-md cursor-pointer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDynamicVariable}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-slate-900 px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add variable
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md cursor-pointer"
                  >
                    &lt; Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-1 rounded-md cursor-pointer"
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
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
                    >
                      Next &gt;
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
          </div>

          {/* Step 3: Safe Page */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 3 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  3
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 3</div>
                  <div className="text-lg font-semibold text-slate-900">Safe Page</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 3 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 3 && (
              <div className="border-t border-slate-200 p-6">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Safe Page</h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <InputField
                    label="Safe Page Url"
                    name="safe_page"
                    register={register}
                    error={errors.safe_page}
                    required
                    placeholder="https://www.youtube.com"
                    defaultValue="https://www.youtube.com"
                    pattern={{
                      value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                      message: "Enter a valid URL",
                    }}
                    tooltip="Safe page where bots/reviewers go"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-md font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    Dynamic variables for Safe Page{" "}
                    <Tooltip title="Dynamic variables are used to track custom parameters of safe page">
                      <span className="text-slate-400">
                        <Info className="w-4 h-4" />
                      </span>
                    </Tooltip>
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Define variables for safe page use.
                  </p>

                  {dynamicVariables.map((variable, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end"
                    >
                      <InputField
                        label="VARIABLE NAME"
                        name={`safe_page_variable.${idx}.name`}
                        register={register}
                        placeholder="Enter variable name"
                        defaultValue={variable.name}
                      />
                      <InputField
                        label="VARIABLE VALUE"
                        name={`safe_page_variable.${idx}.value`}
                        register={register}
                        placeholder="Enter variable value"
                        defaultValue={variable.value}
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeDynamicVariable(idx)}
                          className="bg-red-600 hover:bg-red-700 text-slate-900 px-3 py-2 rounded-md cursor-pointer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDynamicVariable}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-slate-900 px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add variable
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md cursor-pointer"
                  >
                    &lt; Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-1 rounded-md cursor-pointer"
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
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
                    >
                      Next &gt;
                    </button>
                    
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Step 4: Conditions */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 4 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  4
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 4</div>
                  <div className="text-lg font-semibold text-slate-900">Conditions</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 4 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 4 && (
              <div className="border-t border-slate-200 p-6">
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
                    className="w-56 bg-slate-50 text-slate-900 text-sm px-3 py-2 rounded-md border border-slate-200"
                  >
                    <option value="">+ Add condition</option>

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
                        className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                      >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {currentType.toUpperCase()}
                          </h4>
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-sm text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        {/* MODE BUTTONS */}
                        <Controller
                          control={control}
                          name={`conditions.${idx}.mode`}
                          render={({ field }) => (
                            <div className="flex gap-2 mb-3">
                              {["allow", "block"].map((mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => field.onChange(mode)}
                                  className={`px-3 py-1.5 text-sm rounded-md border cursor-pointer ${field.value === mode
                                      ? mode === "allow"
                                        ? "bg-blue-600 text-slate-900 border-blue-600"
                                        : "bg-red-600 text-slate-900 border-red-600"
                                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100/50"
                                    }`}
                                >
                                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                              ))}
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
                                    className="inline-flex items-center bg-slate-100 text-slate-700 px-2.5 py-1 text-xs rounded-full border border-slate-200"
                                  >
                                    {val}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        field.onChange(
                                          field.value.filter(
                                            (_, id) => id !== i
                                          )
                                        )
                                      }
                                      className="ml-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      
                                    </button>
                                  </span>
                                ))}
                              </div>

                              {/* DROPDOWN OR TEXT INPUT */}
                              {isDropdown ? (
                                <select
                                  className="w-full bg-slate-50 text-slate-900 text-sm px-3 py-2 rounded-md border border-slate-200"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && !field.value.includes(val)) {
                                      field.onChange([...field.value, val]);
                                    }
                                    e.target.value = "";
                                  }}
                                >
                                  <option value="">Select {currentType}</option>

                                  {dataList.map((item) => (
                                    <option
                                      key={item.id}
                                      value={
                                        item.country ||
                                        item.state ||
                                        item.name ||
                                        item.browser ||
                                        item.device
                                      }
                                    >
                                      {item.country ||
                                        item.state ||
                                        item.name ||
                                        item.browser ||
                                        item.device}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  placeholder={`Enter ${currentType}...`}
                                  className="w-full text-sm bg-slate-50 text-slate-900 px-3 py-2 rounded-md border border-slate-200"
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
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md cursor-pointer"
                  >
                    &lt; Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-1 rounded-md cursor-pointer"
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
                        onClick={nextStep}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-slate-900 px-4 py-2 rounded-md"
                      >
                        Next &gt;
                      </button>
                    )}
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Step 5: Filters */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] w-full">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 5 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  5
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 5</div>
                  <div className="text-lg font-semibold text-slate-900">Filters</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 5 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 5 && (
              <div className="border-t border-slate-200 p-6">
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

                      const moveRight = () => {
                        const moved = availableOptions.filter((o) =>
                          selectedLeft.includes(o.id.toString())
                        );
                        const updatedSelected = [...selectedOptions, ...moved];
                        setSelectedOptions(updatedSelected);
                        setAvailableOptions(
                          availableOptions.filter(
                            (o) => !selectedLeft.includes(o.id.toString())
                          )
                        );
                        setSelectedLeft([]);
                        setValue("filters", updatedSelected);
                      };
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

                      return (
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-10"
                        >
                          {/* LEFT COLUMN */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label className="text-slate-900 font-semibold mb-2">
                              Available Filters
                            </label>

                            <select
                              className="w-72 md:w-80"
                              multiple
                              size="8"
                              style={{
                                border: "2px solid #272d3e",
                                borderRadius: "6px",
                                padding: "4px",
                                background: "#0f172a", // optional dark background
                                color: "white",
                              }}
                              value={selectedLeft}
                              onChange={(e) =>
                                setSelectedLeft(
                                  Array.from(
                                    e.target.selectedOptions,
                                    (opt) => opt.value
                                  )
                                )
                              }
                            >
                              {availableOptions.map((item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  style={{ color: "#6c788b" }}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* CENTER BUTTONS */}
                          <div
                            className="
    flex flex-row md:flex-col 
    items-center justify-center 
    gap-3 
    mt-4 md:mt-10
  "
                          >
                            <button
                              type="button"
                              onClick={moveRight}
                              className="
      w-7     h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-200 
      bg-white hover:bg-slate-50 border border-slate-200 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-600 cursor-pointer
    "
                              title="Move selected to right"
                            >
                              &gt;
                            </button>

                            <button
                              type="button"
                              onClick={moveLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-200 
      bg-white hover:bg-slate-50 border border-slate-200 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-600 cursor-pointer
    "
                              title="Move selected to left"
                            >
                              &lt;
                            </button>

                            <button
                              type="button"
                              onClick={moveAllRight}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-200 
      bg-white hover:bg-slate-50 border border-slate-200 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-600 cursor-pointer
    "
                              title="Move all right"
                            >
                              &gt;&gt;
                            </button>

                            <button
                              type="button"
                              onClick={moveAllLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-200 
      bg-white hover:bg-slate-50 border border-slate-200 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-600 cursor-pointer
    "
                              title="Move all left"
                            >
                              &lt;&lt;
                            </button>
                          </div>


                          {/* RIGHT COLUMN */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label className="text-slate-900 font-semibold mb-2">
                              Enabled Filters
                            </label>

                            <select
                              multiple
                              size="8"
                              className="w-72 md:w-80"
                              style={{
                                border: "2px solid  #272d3e",
                                borderRadius: "6px",
                                padding: "4px",
                                background: "#0f172a",
                                color: "white",
                              }}
                              value={selectedRight}
                              onChange={(e) =>
                                setSelectedRight(
                                  Array.from(
                                    e.target.selectedOptions,
                                    (opt) => opt.value
                                  )
                                )
                              }
                            >
                              {selectedOptions.map((item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  style={{ color: "#6c788b" }}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
                {/* =========BUTTONS LOWER */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md cursor-pointer "
                  >
                    &lt; Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-1 rounded-md  cursor-pointer"
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
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
                    >
                      Next &gt;
                    </button>
                    
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Step 6: Automate */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setStep(6)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${step === 6 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  6
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Step 6</div>
                  <div className="text-lg font-semibold text-slate-900">Automate</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{step === 6 ? "Expanded" : "Click to edit"}</div>
            </button>
            {step === 6 && (
              <div className="border-t border-slate-200 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={showInputs.afterX>0 ? true:false}
      onChange={() =>
        setShowInputs((p) => ({
          ...p,
          afterX: !p.afterX,
        }))
      }
    />
    <span className="text-slate-900">
      Activate after X unique real visitors
    </span>
  </label>

  {showInputs.afterX && (
    <InputField
      label="Enter value"
      name="afterX"
      register={register}
      type="number"
      placeholder="Enter number of visitors"
    />
  )}
</div>


                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showInputs.frequencyCap}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            frequencyCap: !p.frequencyCap,
                          }))
                        }
                      />
                      <span className="text-slate-900">Frequency Cap</span>
                    </label>
                    {showInputs.frequencyCap && (
                      <InputField
                        label="Enter value"
                        name="automate.frequencyCap.value"
                        register={register}
                        type="number"
                        placeholder="Enter frequency value"
                      />
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showInputs.zeroRedirect}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            zeroRedirect: !p.zeroRedirect,
                          }))
                        }
                      />
                      <span className="text-slate-900">Zero Redirect Cloaking</span>
                    </label>
                    {showInputs.zeroRedirect && (
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 text-slate-600">
                          <input
                            type="checkbox"
                            checked={watch("automate.zeroRedirect.curl")}
                            onChange={(e) => {
                              setValue(
                                "automate.zeroRedirect.curl",
                                e.target.checked
                              );
                              if (e.target.checked)
                                setValue("automate.zeroRedirect.iframe", false);
                            }}
                          />{" "}
                          CURL
                        </label>
                        <label className="flex items-center gap-2 text-slate-600">
                          <input
                            type="checkbox"
                            checked={watch("automate.zeroRedirect.iframe")}
                            onChange={(e) => {
                              setValue(
                                "automate.zeroRedirect.iframe",
                                e.target.checked
                              );
                              if (e.target.checked)
                                setValue("automate.zeroRedirect.curl", false);
                            }}
                          />{" "}
                          IFRAME
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...register("automate.gclid")} />
                      <span className="text-slate-900">
                        GCLID (Google Click ID)
                      </span>
                    </label>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...register("automate.ipCap")} />
                      <span className="text-slate-900">IP Cap</span>
                    </label>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showInputs.pageGuard}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            pageGuard: !p.pageGuard,
                          }))
                        }
                      />
                      <span className="text-slate-900">Page Guard Key</span>
                    </label>
                    {showInputs.pageGuard && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
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
                </div>

                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                  <label className="flex items-center gap-4">
                    <input
                      type="radio"
                      value="301"
                      {...register("http_code")}
                    />
                    <span className="text-slate-900">301</span>
                    <input
                      type="radio"
                      value="302"
                      {...register("http_code")}
                    />
                    <span className="text-slate-900">302</span>
                  </label>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md cursor-pointer"
                  >
                    &lt; Previous
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-50 text-white px-5 py-2 rounded-md shadow cursor-pointer"
                  >
                    {location?.state?.mode === "edit" ? "Update" : "Create"}{" "}
                    Campaign
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>
        </form>

        {/* small footer note */}
        <div className="text-xs text-slate-500">
          Pro-tip: Use the Preview or validation to verify money pages &
          conditions before creating.
        </div>

        {showAlert && (
          <CustomAlertModal message={alertMessage} onClose={hideCustomAlert} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function CampaignBuilderNew() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampaignBuilderInner />
    </QueryClientProvider>
  );
}











