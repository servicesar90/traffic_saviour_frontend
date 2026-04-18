

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import { CircleHelp } from "lucide-react";
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
        className={`w-full bg-white border text-sm rounded-md py-2.5 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:ring-2 focus:ring-[#3c79ff] transition-colors ${icon ? "pl-10 pr-4" : "px-4"
          } ${error ? "border-red-500" : "border-[#d5d9e4]"}`}
        style={
          error
            ? {
                borderWidth: "1px",
                borderStyle: "solid",
                borderImage: "linear-gradient(90deg, #ef4444, #fb7185) 1",
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
          className={`w-full appearance-none bg-white border rounded-md py-2.5 px-4 text-[#141824] text-sm focus:outline-none focus:ring-2 focus:ring-[#3c79ff] transition-colors ${
            error ? "border-red-500" : "border-[#d5d9e4]"
          }`}
          style={
            error
              ? {
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderImage: "linear-gradient(90deg, #ef4444, #fb7185) 1",
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
                      const next = e.target.value;
                      setNotesInput(next);
                      setValue("comment", next, {
                        shouldDirty: true,
                        shouldValidate: false,
                      });
                    }}
                    className={`w-full bg-white border rounded-md px-4 py-3 text-sm text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:ring-2 focus:ring-[#3c79ff] transition-colors resize-none ${
                      errors.comment ? "border-red-500" : "border-[#d5d9e4]"
                    }`}
                    style={
                      errors.comment
                        ? {
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderImage: "linear-gradient(90deg, #ef4444, #fb7185) 1",
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
                      onClick={handleSubmit(onSubmit)}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Where do we send legit visitors (money pages)?
                  </h2>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-300">
                      <span className="text-sm">Append URL</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded bg-slate-700"
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
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-800 border border-slate-700 p-4 rounded-lg"
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
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                          {index === moneyPages.length - 1 && (
                            <button
                              type="button"
                              onClick={addMoneyPage}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
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
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDynamicVariable}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add variable
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer"
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
                      onClick={handleSubmit(onSubmit)}
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
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
                <h2 className="text-lg font-semibold text-white">Safe Page</h2>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
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

                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
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
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDynamicVariable}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add variable
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer"
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
                      onClick={handleSubmit(onSubmit)}
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
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
                    className="w-56 bg-slate-800 text-white text-sm px-3 py-2 rounded-md border border-slate-700"
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
                        className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                      >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-white">
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
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-red-600 text-white border-red-600"
                                      : "bg-slate-700 text-slate-300 border-slate-700 hover:bg-slate-700/50"
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
                                    className="inline-flex items-center bg-slate-700 text-slate-100 px-2.5 py-1 text-xs rounded-full border border-slate-600"
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
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>

                              {/* DROPDOWN OR TEXT INPUT */}
                              {isDropdown ? (
                                <select
                                  className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-md border border-slate-700"
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
                                  className="w-full text-sm bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700"
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
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer"
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
                      onClick={handleSubmit(onSubmit)}
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
                        onClick={nextStep}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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
                            <label className="text-white font-semibold mb-2">
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
      rounded-md border border-slate-600 
      bg-slate-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move selected to right"
                            >
                              ›
                            </button>

                            <button
                              type="button"
                              onClick={moveLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-slate-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move selected to left"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={moveAllRight}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-slate-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move all right"
                            >
                              »
                            </button>

                            <button
                              type="button"
                              onClick={moveAllLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-slate-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move all left"
                            >
                              «
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
                            <label className="text-white font-semibold mb-2">
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
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer "
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
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md  cursor-pointer"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
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
    <span className="text-white">
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


                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
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
                      <span className="text-white">Frequency Cap</span>
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

                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
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
                      <span className="text-white">Zero Redirect Cloaking</span>
                    </label>
                    {showInputs.zeroRedirect && (
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 text-slate-300">
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
                        <label className="flex items-center gap-2 text-slate-300">
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

                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...register("automate.gclid")} />
                      <span className="text-white">
                        GCLID (Google Click ID)
                      </span>
                    </label>
                  </div>

                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...register("automate.ipCap")} />
                      <span className="text-white">IP Cap</span>
                    </label>
                  </div>

                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
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
                      <span className="text-white">Page Guard Key</span>
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

                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                  <label className="flex items-center gap-4">
                    <input
                      type="radio"
                      value="301"
                      {...register("http_code")}
                    />
                    <span className="text-white">301</span>
                    <input
                      type="radio"
                      value="302"
                      {...register("http_code")}
                    />
                    <span className="text-white">302</span>
                  </label>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer"
                  >
                    ‹ Previous
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md shadow cursor-pointer"
                  >
                    {location?.state?.mode === "edit" ? "Update" : "Create"}{" "}
                    Campaign
                  </button>
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
      </div>
    </DashboardLayout>
  );
}
