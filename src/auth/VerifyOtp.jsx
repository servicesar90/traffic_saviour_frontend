import React, { useState, useEffect, use } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { verifyOtpApi, resendOtpApi, signupApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { set } from "react-hook-form";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const signupData = JSON.parse(localStorage.getItem("signup_data"));
  const email = signupData?.email;

  useEffect(() => {
    if (!signupData) navigate("/signup");
  }, [signupData, navigate]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 0) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) newOtp.push("");

    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      showErrorToast("Please enter complete OTP");
      return;
    }

    const payload = {
      name: signupData?.name,
      email,
      password: signupData?.password,
      otp: finalOtp,
    };

    setLoading(true);
    try {
      const res = await createApiFunction("post", verifyOtpApi, null, payload);

      if (res?.status === 201) {
        showSuccessToast("Account created successfully ??");
        localStorage.removeItem("signup_data");
        navigate("/signin");
      } else {
        showErrorToast(res?.message || "Invalid OTP");
      }
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    const payload = {
      name: signupData?.name,
      email,
      password: signupData?.password,
    };
    try {
      const response = await createApiFunction("post", signupApi, null, payload);

      setOtp(["", "", "", "", "", ""]);

      if (response?.data?.success) {
        showSuccessToast("OTP resent successfully!");
      }
    } catch {
      showErrorToast("Failed to resend OTP");
    } finally {
      setResending(false);
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
            <h1 className="mt-1.5 text-[27px] md:text-[32px] font-semibold tracking-[-0.02em] text-slate-900">Verify your email</h1>
            <p className="text-[14px] text-slate-500/90 mt-1.5 leading-6">Enter the secure code we sent to <span className="font-medium text-slate-700"> {email}</span></p>
          </div>

          <div onPaste={handlePaste} className="flex flex-wrap justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 rounded-lg border border-slate-200 text-center text-lg font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:border-[#0066FF] transition"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            aria-disabled={loading}
            className={`w-full mt-6 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,102,255,0.25)] ${
              loading
                ? "bg-[#0066FF]/70 text-white cursor-not-allowed opacity-90"
                : "bg-[#0066FF] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            aria-disabled={resending}
            className={`mt-3 w-full text-sm font-medium transition cursor-pointer ${
              resending
                ? "text-slate-300 cursor-not-allowed"
                : "text-[#0066FF] hover:underline"
            }`}
          >
            {resending ? "Resending..." : "Resend OTP"}
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
            <p className="text-sm text-slate-500 text-center pt-4">
            Wrong email?{" "}
            <Link
              to="/signup"
              className="text-[#0066FF] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
            >
              Change it
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}























































