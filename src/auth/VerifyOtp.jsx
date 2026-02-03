import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
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

  // only single digit number
  if (!/^\d?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // auto focus next
  if (value && index < otp.length - 1) {
    document.getElementById(`otp-${index + 1}`)?.focus();
  }
};

const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    if (otp[index]) {
      // clear current
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      // move focus back
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }
};

// Optional but professional: paste full OTP
const handlePaste = (e) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

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
 
      setOtp(["", "", "", "", "", ""] );
      
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
          Enter 6 digit OTP sent to <b>{signupData.email}</b>
        </p>

        {/* <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="h-11 w-full mb-3 rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition"
          placeholder="____"
        /> */}
        <div  onPaste={handlePaste}>
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
      className="
        h-12 w-12 
        m-1
        mb-3
        rounded-sm 
        border 
        text-gray-800
        text-center 
        text-lg 
        font-semibold 
        text-gray-800
        focus:outline-none 
        focus:ring-2 
        focus:ring-[#4f39f6]
        transition
      "
    />
  ))}

        </div>

        
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-3 text-sm text-indigo-600 w-full cursor-pointer"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
      {/* RIGHT PANEL */}
     <div className="hidden xl:flex w-1/2 bg-[#0B0E2A] text-white items-center justify-center relative overflow-hidden">

          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:40px_40px]" />
          <div className="relative text-center px-10">
            <div className="flex items-center justify-center ">
             
                <img
    src="/logo1.svg"
    alt="Click Stopper Logo"
    className="w-30 h-30"
  />
              
              <h2 className=" text-4xl font-semibold text-[#a855f7] mt-[30px]">Click Stopper</h2>
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
