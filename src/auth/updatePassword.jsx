import React, { useState,useEffect } from "react";
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


  // Strong Password Regex
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


  // Submit Function
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      showErrorToast("OTP is required");
      return;
    }

    // 🔥 OTP must be exactly 4 digits
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
        "Password must be at least 8 chars, include 1 uppercase letter, 1 number & 1 special character."
      );
      return;
    }
try {
  setIsSubmitting(true);

  const res = await createApiFunction(
  "post",
  updatePassword,
  null,
  {
    email: email,
    otp: formData.otp,
    password: formData.newPassword,
  }
);


  showSuccessToast(
    res?.data?.message || "Password updated successfully!"
  );
  localStorage.removeItem("resetEmail");

  setTimeout(() => {
    navigate("/signin");
  }, 800);

} catch (err) {
  showErrorToast(
    err.response?.data?.message || "Something went wrong!"
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
              Update Your Password
            </h1>
            <p className="text-gray-500 mb-8">
              Enter the OTP you received and set your new password.
            </p>

            <form onSubmit={onSubmit}>
              {/* OTP FIELD */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only digits + limit to 4 digits
                    if (/^\d{0,6}$/.test(value)) {
                      setFormData({ ...formData, otp: value });
                    }
                  }}
                  required
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">✔  OTP must be in numeric</p>

              {/* New Password */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <span
                  className="absolute right-3 top-[30px] cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <span
                  className="absolute right-3 top-[30px] cursor-pointer text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </span>
              </div>

              {/* RULES */}
              <p className="text-sm text-gray-500 mb-4">
                Password must include:
                <br />✔ One uppercase letter
                <br />✔ One number
                <br />✔ One special character (@, $, !, %, *, ?, &)
                <br />✔ Minimum 8 characters
              </p>

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
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>

              <p className="text-sm text-gray-600 mt-6 text-center">
                Go back to login —{" "}
                <Link to="/signin" className="text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden xl:flex w-1/2 bg-[#0B0E2A] text-white items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:40px_40px]" />
          <div className="relative text-center px-10">
            <h2 className="text-2xl font-semibold mb-4">Click Stopper</h2>
            <p className="text-gray-300 text-sm max-w-sm mx-auto">
              Protect your campaigns with advanced cloaking and smart traffic
              controls.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
