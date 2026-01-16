export default function PlanRequiredModal({ open, onLogout, onUpgrade }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0b1220] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-700 flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xl">
            💳
          </div>

          <h2 className="text-lg font-semibold text-white">
            Subscription Required
          </h2>

          <p className="text-xs text-gray-400">
            Upgrade to unlock full dashboard access
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-center">
          <h3 className="text-xl font-semibold text-white">
            Your plan is inactive
          </h3>

          <p className="text-sm text-gray-400 mt-3">
            Your subscription has expired or is missing. Choose a plan to
            continue using analytics, campaigns and tools.
          </p>

          <div className="mt-5 text-xs text-gray-500">
            🔒 No data will be lost
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-700 flex justify-between">
          <button
            onClick={onLogout}
            className="px-5 py-2.5 cursor-pointer bg-red-600 hover:bg-red-700 rounded-xl text-sm text-white"
          >
            Sign out
          </button>

          <button
            onClick={onUpgrade}
            className="px-6 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-xl text-sm text-white"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
