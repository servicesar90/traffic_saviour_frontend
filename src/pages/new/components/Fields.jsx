import React from "react";
import Tooltip from "@mui/material/Tooltip";

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

const ChevronDown = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CustomAlertModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Information</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export const InputField = ({
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
}) => (
  <div>
    <label className="flex items-center text-[11px] font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <Tooltip title={tooltip} placement="top">
          <span className="ml-2 cursor-pointer">
            <Info className="w-4 h-4 text-slate-500" />
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
        className={`w-full bg-white border text-sm rounded-2xl py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-colors ${
          icon ? "pl-10" : "px-4"
        } ${error ? "border-rose-500" : "border-slate-200"}`}
        {...register(name, {
          required: required ? `${label} is required.` : false,
          pattern: pattern || undefined,
          valueAsNumber: type === "number" ? true : undefined,
        })}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
  </div>
);

export const SelectField = ({
  label,
  name,
  register,
  error,
  required,
  tooltip,
  options = [],
}) => (
  <div>
    <label className="flex items-center text-[11px] font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <Tooltip title={tooltip}>
          <span className="ml-2 cursor-pointer">
            <Info className="w-4 h-4 text-slate-500" />
          </span>
        </Tooltip>
      )}
    </label>
    <div className="relative">
      <select
        className={`w-full appearance-none bg-white border rounded-2xl py-3 px-4 text-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-colors ${
          error ? "border-rose-500" : "border-slate-200"
        }`}
        {...register(name, { required: required && `${label} is required.` })}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
  </div>
);

export const StatusButton = ({ label, Icon, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-20 w-full cursor-pointer ${
      isActive
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-200 bg-white hover:bg-slate-50"
    }`}
  >
    <Icon
      className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`}
    />
    <span
      className={`text-sm font-medium mt-2 ${
        isActive ? "text-white" : "text-slate-700"
      }`}
    >
      {label}
    </span>
  </button>
);

export const DashboardLayout = ({ children }) => (
  <div className="campaign-new min-h-screen bg-slate-50 text-slate-900 font-sans">
    <div className="max-w-7xl mx-auto p-6">{children}</div>
    <div className="fixed bottom-6 right-6" />
  </div>
);
