import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { createApiFunction } from "../api/ApiFunction";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signupApi } from "../api/Apis";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/\d/, "At least one number")
    .matches(/[@$!%*?&#]/, "At least one special character"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions",
  ),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await createApiFunction("post", signupApi, null, payload);

      if (response?.data?.success === true) {
        showSuccessToast("Enter Otp to Verify your mail!");

        localStorage.setItem(
          "signup_data",
          JSON.stringify({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
          }),
        );

        reset();
        navigate("/verify-otp");
      } else {
        showErrorToast(
          response?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again later.";
      showErrorToast(message);
    } finally {
      setLoading(false);
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
            <h1 className="mt-1.5 text-[27px] md:text-[32px] font-semibold tracking-[-0.02em] text-slate-900">Create your account</h1>
            <p className="text-[14px] text-slate-500/90 mt-1.5 leading-6">Create your secure workspace in minutes.</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Enter your first name"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none transition ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Enter your last name"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none transition ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  autoComplete="new-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:ring-offset-2"
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400/70 focus:outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:border-[#0066FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/25 focus-visible:shadow-[0_0_0_6px_rgba(0,102,255,0.12)] focus-visible:ring-offset-2"
                >
                  {showConfirm ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                {...register("terms")}
                id="terms"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-[#0066FF] hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#0066FF] hover:underline">
                  Privacy Policy
                </a>
                .
                {errors.terms && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.terms.message}
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,102,255,0.25)] ${
                loading
                  ? "bg-[#0066FF]/70 text-white cursor-not-allowed"
                  : "bg-[#0066FF] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#0066FF]/30 focus-visible:ring-offset-2"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
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
              Already have an account?{" "}
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























































