import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { verifyOtpApi, resendOtpApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("otp_email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      showErrorToast("Enter valid 4 digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await createApiFunction(
        "post",
        verifyOtpApi,
        null,
        { email, otp }
      );

      if (res?.success) {
        showSuccessToast("Email verified successfully");
        localStorage.removeItem("otp_email");
        navigate("/signin");
      } else {
        showErrorToast(res?.message || "Invalid OTP");
      }
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await createApiFunction(
        "post",
        resendOtpApi,
        null,
        { email }
      );
      showSuccessToast("OTP resent to your email");
    } catch {
      showErrorToast("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANEL */}
      <div className="w-full xl:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20 py-12">
        <h2 className="text-xl font-semibold mb-2">Verify Email</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter 4 digit OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          maxLength={4}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full h-12 text-center text-lg tracking-widest border rounded-lg mb-4"
          placeholder="____"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-3 text-sm text-indigo-600 w-full"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
      {/* RIGHT PANEL */}
      <div className="hidden xl:flex w-1/2 bg-[#0B0E2A] text-white items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.15,
          }}
        />
        <div className="relative text-center px-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-500 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h2 className="ml-3 text-2xl font-semibold">Click Stopper</h2>
          </div>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            Shield your campaigns. Boost your performance. Experience smart
            traffic cloaking — secure, optimized, effortless.
          </p>
        </div>
      </div>
    </div>
  );
}
