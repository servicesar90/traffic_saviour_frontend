import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { updatePassword } from "../api/Apis";
import { createApiFunction } from "../api/ApiFunction";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!email) {
      showErrorToast("Session expired. Please try again.");
      navigate("/reset-password");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      showErrorToast("OTP is required");
      return;
    }

    if (formData.otp.length !== 6) {
      showErrorToast("OTP must be 6 digits");
      return;
    }

    if (!formData.otp.trim()) {
      showErrorToast("OTP is required");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      showErrorToast("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showErrorToast("Passwords do not match!");
      return;
    }

    if (!strongPasswordRegex.test(formData.newPassword)) {
      showErrorToast(
        "Password must be at least 8 chars, include 1 uppercase letter, 1 number & 1 special character.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await createApiFunction("post", updatePassword, null, {
        email: email,
        otp: formData.otp,
        password: formData.newPassword,
      });

      showSuccessToast(res?.data?.message || "Password updated successfully!");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/signin");
      }, 800);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Something went wrong!");
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
            <h1 className="mt-1.5 text-[27px] md:text-[32px] font-semibold tracking-[-0.02em] text-slate-900">Set a new password</h1>
            <p className="text-[14px] text-slate-500/90 mt-1.5 leading-6">Set a new password to secure your workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setFormData({ ...formData, otp: value });
                  }
                }}
                required
                maxLength={6}
                className="w-full border border-slate-200/80 rounded-xl bg-slate-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
              />
              <p className="text-xs text-slate-500 mt-1.5">OTP must be numeric.</p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200/80 rounded-xl bg-slate-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:ring-offset-2"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200/80 rounded-xl bg-slate-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:ring-offset-2"
                  onClick={() => setShowConfirm(!showConfirm)}
                  role="button"
                  tabIndex={0}
                >
                  {showConfirm ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-5">
              Password must include:
              <br />? One uppercase letter
              <br />? One number
              <br />? One special character (@, $, !, %, *, ?, &)
              <br />? Minimum 8 characters
            </div>

            <button
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              type="submit"
              className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,102,255,0.25)] ${
                isSubmitting
                  ? "bg-[#0066FF]/70 text-white cursor-not-allowed opacity-90"
                  : "bg-[#0066FF] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
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
              Go back to login —{" "}
              <Link
                to="/signin"
                className="text-[#0066FF] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
























































