import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { createApiFunction } from "../api/ApiFunction";
import { googleLoginApi, logInApi } from "../api/Apis";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.email.trim() || !formData.password.trim()) {
      showErrorToast("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createApiFunction("post", logInApi, null, formData);

      if (response && response.data?.token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("plan");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("plan", JSON.stringify(response.data.plan));

        showSuccessToast("Signin successful!");

        await new Promise((res) => setTimeout(res, 400));
        navigate("/Dashboard/allStats");
      } else {
        showErrorToast("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        "Invalid credentials or server error. Please try again.";
      showErrorToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await createApiFunction("post", googleLoginApi, null, {
        token: googleToken,
      });

      if (response && response.data?.token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("plan");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("plan", JSON.stringify(response.data.plan));
        showSuccessToast("Signin successful!");

        await new Promise((res) => setTimeout(res, 400));
        navigate("/Dashboard/allStats");
      } else {
        showErrorToast("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      const msg =
        err.response?.data?.message ||
        "Google login failed. Please try again.";
      showErrorToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] w-full font-['Manrope'] bg-white flex flex-col md:flex-row overflow-hidden relative">
      {/* Left Panel */}
      <div className="absolute inset-0 w-full min-h-[100svh] md:static md:w-2/5 md:min-h-screen rounded-none md:rounded-tr-[40px] md:overflow-hidden relative auth-left">
        <div className="absolute inset-0 auth-pattern" />
<div className="absolute bottom-8 left-8 rounded-full bg-white/15 px-4 py-2 text-[12px] uppercase tracking-[0.34em] text-white/85 backdrop-blur">
          TrafficSaviour
        </div>


      </div>

      {/* Right Panel */}
      <div className="absolute inset-0 z-10 w-full md:w-3/5 md:static bg-transparent md:bg-white flex items-center justify-center px-6 py-8 md:py-0 min-h-[100svh]">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-100/80 px-6 sm:px-9 py-8 sm:py-10 relative">
          <div className="absolute left-6 right-6 top-0 h-[3px] bg-gradient-to-r from-[#0066FF] via-[#60a5fa] to-[#22c55e] rounded-b-full overflow-hidden">
            <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-white/70 blur-[1px] animate-[shine_2.8s_linear_infinite]" />
          </div>
          <div className="mb-5">
            <div className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-slate-500 shadow-sm">TrafficSaviour</div>
            <h1 className="mt-1.5 text-[27px] md:text-[32px] font-semibold tracking-[-0.02em] text-slate-900">Sign in to your account</h1>
            <p className="text-[14px] text-slate-500/90 mt-1.5 leading-6">Secure access to your TrafficSaviour workspace.</p>
          </div>

          {/* Social */}
          <div className="mb-5">
            <div
              className={`flex items-center justify-center w-full cursor-pointer ${
                isSubmitting ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={isSubmitting}
            >
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

          <div className="flex items-center mb-5 sm:mb-5">
            <hr className="flex-grow border-slate-100" />
            <span className="px-3 text-slate-300 text-xs uppercase tracking-widest">
              Or
            </span>
            <hr className="flex-grow border-slate-100" />
          </div>

          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="space-y-5"
          >
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path fill="currentColor" d="M12 2.2l8.3 3.3v6.1c0 5-3.7 8.9-8.3 10.6-4.6-1.7-8.3-5.6-8.3-10.6V5.5L12 2.2z" />
                <path fill="currentColor" opacity="0.25" d="M12 5.3l5.3 2.1v4.2c0 3.3-2.2 6-5.3 7.2-3.1-1.2-5.3-3.9-5.3-7.2V7.4L12 5.3z" />
              </svg>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  title="Enter a valid email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200/80 rounded-xl bg-slate-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path fill="currentColor" d="M12 2.2l8.3 3.3v6.1c0 5-3.7 8.9-8.3 10.6-4.6-1.7-8.3-5.6-8.3-10.6V5.5L12 2.2z" />
                <path fill="currentColor" opacity="0.25" d="M12 5.3l5.3 2.1v4.2c0 3.3-2.2 6-5.3 7.2-3.1-1.2-5.3-3.9-5.3-7.2V7.4L12 5.3z" />
              </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-200/80 rounded-xl bg-slate-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:ring-offset-2"
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                />
                Keep me logged in
              </label>
              <Link
                to="/reset-password"
                className="text-[#0066FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="scale-[0.95] sm:scale-100 origin-top">
                <Turnstile
                  siteKey="0x4AAAAAACMpjTD163cCGaKh"
                  onSuccess={(token) => setToken(token)}
                  onExpire={() => setToken(null)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,102,255,0.25)]
                ${
                  isSubmitting
                    ? "bg-[#0066FF]/70 text-white cursor-not-allowed"
                    : "bg-[#0066FF] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
                        <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-slate-700 font-semibold">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-900/10 text-slate-800">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path fill="currentColor" d="M12 2.2l8.3 3.3v6.1c0 5-3.7 8.9-8.3 10.6-4.6-1.7-8.3-5.6-8.3-10.6V5.5L12 2.2z" />
                <path fill="currentColor" opacity="0.25" d="M12 5.3l5.3 2.1v4.2c0 3.3-2.2 6-5.3 7.2-3.1-1.2-5.3-3.9-5.3-7.2V7.4L12 5.3z" />
              </svg>
              </span>
              <span className="tracking-wide">SOC 2 • GDPR • End-to-end encryption</span>
            </div>
            <p className="text-sm text-slate-500 text-center pt-3">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0066FF] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}






























































