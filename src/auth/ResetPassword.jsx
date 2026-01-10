import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { forgotPassword } from "../api/Apis";
import { showErrorToast, showInfoToast, showSuccessToast } from "../components/toast/toast";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Function
const onSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email.trim()) {
    alert("Email is required");
    return;
  }

  try {
    setIsSubmitting(true);

    const res = await createApiFunction(
      "post",
      forgotPassword,
      null,
      { email: formData.email }
    );
    localStorage.setItem("resetEmail", formData.email);

  showSuccessToast(res?.data?.message || "OTP Sent");
  navigate('/update-password')

  } catch (err) {
    console.error(err);
    showErrorToast(
      err.response?.data?.message ||
      "Something went wrong! Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <>
      <div className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="w-full xl:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20 py-12">
          <div className="p-5 md:p-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-gray-500 mb-8">
              Enter your email address linked to your account, and we’ll send you
              a link to reset your password.
            </p>

           <form onSubmit={onSubmit}>
  {/* Email */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Email <span className="text-red-500">*</span>
    </label>

    <input
      type="email"
      name="email"
      autoComplete="off"
      placeholder="info@gmail.com"
      value={formData.email}
      onChange={handleChange}
      required
      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      onInvalid={(e) =>
        e.target.setCustomValidity("Please enter a valid email")
      }
      onInput={(e) => e.target.setCustomValidity("")}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Submit Button */}
  <button
    disabled={isSubmitting}
    type="submit"
    className={`w-full py-2.5 cursor-pointer rounded-lg font-medium transition flex items-center justify-center gap-2
      ${
        isSubmitting
          ? "bg-indigo-400 text-white cursor-not-allowed opacity-70"
          : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
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
        Sending OTP...
      </>
    ) : (
      "Send OTP"
    )}
  </button>
  <p className="text-sm text-gray-600 mt-6 text-center">
                Wait, I remember my password...{" "}
                <Link to="/signin" className="text-indigo-600 hover:underline">
                  Click here
                </Link>
              </p>
</form>

          </div>
        </div>

        {/* RIGHT PANEL */}
        {/* RIGHT PANEL */}
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
              <h2 className="ml-3 text-2xl font-semibold">Click Stopper</h2>
            </div>
            <p className="text-gray-300 text-sm max-w-sm mx-auto">
              Shield your campaigns. Boost your performance. Experience smart
              traffic cloaking — secure, optimized, and effortless.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
