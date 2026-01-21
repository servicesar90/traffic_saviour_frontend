import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { verifyOtpApi, resendOtpApi, signupApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { set } from "react-hook-form";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const signupData = JSON.parse(localStorage.getItem("signup_data"));
  const email = signupData?.email;

  useEffect(() => {
    if (!signupData) navigate("/signup");
  }, [signupData, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showErrorToast("Enter valid 6 digit OTP");
      return;
    }

    const payload = {
      name: signupData?.name,
      email,
      password: signupData?.password,
      otp: otp,
    };

    setLoading(true);
    try {
      const res = await createApiFunction("post", verifyOtpApi, null, payload);
      
      if (res?.status === 201) {
        showSuccessToast("Account created successfully 🎉");
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
      console.log(response);
      setOtp("");
      
      if (response?.data?.success) {
        showSuccessToast("OTP resent successfully!");
      };
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
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Verify Email</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter 4 digit OTP sent to <b>{signupData.email}</b>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="h-11 w-full mb-3 rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition"
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
