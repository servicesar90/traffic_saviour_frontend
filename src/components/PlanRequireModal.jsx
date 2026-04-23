import { ShieldCheck, CreditCard, LockKeyhole, Gift } from "lucide-react";


export default function PlanRequiredModal({
  open,
  onLogout,
  onUpgrade,
  showFreeClaimView = false,
  onClaimFree,
  isClaimingFree = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-xl border border-[#d5d9e4] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.25)] overflow-hidden">
        <div className="px-6 py-6 border-b border-[#e2e8f0]">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#eef4ff] text-[#3c79ff] flex items-center justify-center shrink-0">
              {showFreeClaimView ? <Gift size={18} /> : <CreditCard size={18} />}
            </div>
            <div className="text-left">
              <h2 className="dashboard-heading text-left">
                {showFreeClaimView ? "Claim Your Free Plan" : "Active Plan Needed"}
              </h2>
              <p className="dashboard-subheading text-left mt-1">
                {showFreeClaimView
                  ? "Start instantly with 1 campaign and 500 clicks."
                  : "Upgrade your subscription to unlock full dashboard access."}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-md border border-[#d5d9e4] bg-[#f8fbff] px-4 py-3 text-left">
            {showFreeClaimView ? (
              <>
                <p className="text-sm font-semibold text-[#1f2937]">
                  New account detected. You can unlock a one-time free starter plan.
                </p>
                <p className="text-sm text-[#64748b] mt-1">
                  This gives you access to 1 campaign with 500 clicks so you can start immediately.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#1f2937]">Your subscription is currently inactive.</p>
                <p className="text-sm text-[#64748b] mt-1">
                  Choose a plan to continue using campaigns, analytics, and traffic protection tools.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#3c79ff]" />
              Your saved data remains secure
            </span>
            <span className="inline-flex items-center gap-2">
              <LockKeyhole size={14} className="text-[#3c79ff]" />
              {showFreeClaimView ? "Claim once and start instantly" : "Resume instantly after plan activation"}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border border-[#fecaca] bg-[#fff1f2] text-[#b91c1c] hover:bg-[#ffe4e6] cursor-pointer"
          >
            Sign out
          </button>

          <button
            onClick={onUpgrade}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
          >
            View plans
          </button>

          {showFreeClaimView && (
            <button
              onClick={onClaimFree}
              disabled={isClaimingFree}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#0f172a] text-white hover:bg-[#111827] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer !text-white"
            >
              {isClaimingFree ? "Claiming..." : "Claim free plan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
