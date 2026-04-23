import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Keyboard, ArrowLeft } from "lucide-react";

export default function DevToolsBlocked() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-[#d5d9e4] bg-white shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#eef4ff] text-[#3c79ff] flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <div className="text-left">
              <h1 className="dashboard-heading text-left">Security Access Restricted</h1>
              <p className="dashboard-subheading text-left mt-1">
                To protect sensitive traffic systems, developer tools are disabled on this workspace.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-md border border-[#d5d9e4] bg-[#f8fbff] px-4 py-3">
              <p className="text-sm font-semibold text-[#1f2937] text-left">
                Inspection mode is blocked for active monitoring pages.
              </p>
            </div>
            <div className="rounded-md border border-[#d5d9e4] bg-[#f8fbff] px-4 py-3 flex items-start gap-2">
              <Keyboard size={16} className="text-[#3c79ff] mt-0.5 shrink-0" />
              <p className="text-sm text-[#475569] text-left">
                Keyboard shortcuts for source inspection are currently disabled.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              <ArrowLeft size={14} />
              Return To Dashboard
            </button>
            <p className="text-xs text-[#64748b] text-left">
              If this is unexpected, please reconnect and try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
