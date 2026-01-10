import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingActions() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex">
      {/* ================= LEFT PANEL ================= */}
      <div className="flex-1 bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <h1 className="text-[28px] font-bold text-slate-900 mb-1">
            {user ? "Welcome back" : "Sign In"}
          </h1>

          <p className="text-slate-500 text-sm mb-6">
            {user
              ? "Continue to your dashboard"
              : "Enter your email and password to access your dashboard."}
          </p>

          {!user && (
            <>
                <div className="flex justify-center items-center gap-4 mb-6">
                        <button
                          type="button"
                          className="flex items-center justify-center w-1/2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => showErrorToast("Google login is not yet implemented.")}
                        >
                          <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5 mr-2"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            Sign in with Google
                          </span>
                        </button>
                      </div> 

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">OR</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {user ? (
            <>
              <PrimaryButton
                label="Go to Dashboard"
                onClick={() => navigate("/dashboard/allStats")}
              />

              <button
                onClick={handleLogout}
                className="w-full mt-4 py-3 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <PrimaryButton
                label="Sign In"
                onClick={() => navigate("/signin")}
              />

              <p className="text-center text-sm text-slate-600 mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      {/* <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_top,#3a1c71_0%,#0b1024_65%,#050814_100%)]">
     
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[380px] h-[380px] rounded-full blur-xl bg-[radial-gradient(circle,rgba(99,102,241,0.45),transparent_65%)]"
        />

       
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-[84px] h-[84px] rounded-2xl bg-gradient-to-br from-[#1b1f3b] to-[#0f1226] flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.8)] z-10"
        >
          <svg width="24" height="26">
            <path
              fill="white"
              d="M10.55 15.91H.442L14.153.826 12.856 9.91h10.107L9.253 24.991l1.297-9.082Z"
            />
          </svg>
        </motion.div>

       
        <div className="absolute bottom-[28%] text-center px-4">
          <h2 className="text-white text-[22px] font-bold mb-1">
            Click Stopper
          </h2>

          <p className="text-white/75 text-sm max-w-[320px] mx-auto leading-relaxed">
            Shield your campaigns. Boost performance.
            <br />
            Smart ad cloaking & traffic protection.
          </p>
        </div>
      </div> */}

       <div className="hidden xl:flex w-1/2 bg-[#0B0E2A] text-white items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:40px_40px]" />
        <div className="relative text-center px-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-500 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <h2 className="ml-3 text-2xl font-semibold">CloakShield</h2>
          </div>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            Shield your campaigns. Boost your performance. Experience smart
            traffic cloaking — secure, optimized, and effortless.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= BUTTON ================= */
function PrimaryButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-[14px] rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
    >
      {label}
    </button>
  );
}
