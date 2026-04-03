import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { showErrorToast, showSuccessToast } from "../../components/toast/toast";
import { googleLoginApi } from "../../api/Apis";
import { createApiFunction } from "../../api/ApiFunction";

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

  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await createApiFunction("post", googleLoginApi, null, {
        token: googleToken,
      });

      if (response && response.data?.token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("plan", JSON.stringify(response?.data?.plan));
        showSuccessToast("Signin successful!");

        await new Promise((res) => setTimeout(res, 400));
        navigate("/Dashboard/allStats");
      } else {
        showErrorToast("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Google login failed. Please try again.";
      showErrorToast(msg);
    }
  };

  return (
    <div className="min-h-[100svh] w-full font-['Manrope'] bg-white flex flex-col md:flex-row overflow-hidden relative">
      {/* Left Panel */}
      <div
        className="absolute inset-0 w-full min-h-[100svh] md:static md:w-2/5 md:min-h-screen rounded-none md:rounded-tr-[40px] md:overflow-hidden relative"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(11,26,74,0.9), rgba(11,26,74,0.8), rgba(11,26,74,0.6)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-8 left-8 rounded-full bg-white/15 px-4 py-2 text-[12px] uppercase tracking-[0.34em] text-white/85 backdrop-blur">
          TrafficSaviour
        </div>
      </div>

      {/* Right Panel */}
      <div className="absolute inset-0 z-10 w-full md:w-3/5 md:static bg-transparent md:bg-white flex items-center justify-center px-6 py-8 md:py-0 min-h-[100svh]">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-100/80 px-6 sm:px-9 py-8 sm:py-10 relative">
          <div className="absolute left-6 right-6 top-0 h-[3px] bg-gradient-to-r from-[#0066FF] via-[#60a5fa] to-[#22c55e] rounded-b-full overflow-hidden">
            <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-white/70 blur-[1px] animate-[shine_1.4s_ease-in-out_infinite]" />
          </div>

          <div className="mb-5">
            <div className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-slate-500 shadow-sm">
              TrafficSaviour
            </div>
            <h1 className="mt-1.5 text-[27px] md:text-[32px] font-semibold tracking-[-0.02em] text-slate-900">
              {user ? "Welcome back" : "Sign in to your account"}
            </h1>
            <p className="text-[14px] text-slate-500/90 mt-1.5 leading-6">
              {user
                ? "Continue to your dashboard."
                : "Enter your email and password to access your dashboard."}
            </p>
          </div>

          {!user && (
            <>
              <div className="mb-5">
                <div className="flex items-center justify-center w-full">
                  <GoogleOAuthProvider clientId="841461646285-9dimu89k2vjo4cbdj69ound7s0j7jm2s.apps.googleusercontent.com">
                    <div className="w-full max-w-[320px] mx-auto md:hidden">
                      <GoogleLogin
                        theme="filled_blue"
                        size="large"
                        shape="rectangular"
                        text="signin_with"
                        width="280"
                        onSuccess={(credentialResponse) => {
                          loginWithGoogle(credentialResponse.credential);
                        }}
                        onError={() => console.log("Login Failed")}
                      />
                    </div>
                    <div className="hidden md:block w-full max-w-[380px] mx-auto">
                      <GoogleLogin
                        theme="filled_blue"
                        size="large"
                        shape="rectangular"
                        text="signin_with"
                        width="380"
                        onSuccess={(credentialResponse) => {
                          loginWithGoogle(credentialResponse.credential);
                        }}
                        onError={() => console.log("Login Failed")}
                      />
                    </div>
                  </GoogleOAuthProvider>
                </div>
              </div>

              <div className="flex items-center mb-5">
                <hr className="flex-grow border-slate-100" />
                <span className="px-3 text-slate-300 text-xs uppercase tracking-widest">
                  Or
                </span>
                <hr className="flex-grow border-slate-100" />
              </div>
            </>
          )}

          {user ? (
            <>
              <PrimaryButton
                label="Go to Dashboard"
                onClick={() => navigate("/Dashboard/allStats")}
              />
              <button
                onClick={handleLogout}
                className="w-full mt-4 py-2.5 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <PrimaryButton label="Sign In" onClick={() => navigate("/signin")} />

              <p className="text-center text-sm text-slate-600 mt-4">
                Donâ€™t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-[#0066FF] font-semibold cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-lg bg-[#0066FF] text-white font-semibold hover:brightness-95 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
    >
      {label}
    </button>
  );
}


