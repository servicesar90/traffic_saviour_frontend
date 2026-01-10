// import {
//   FormControl,
//   Input,
//   Modal,
//   ModalClose,
//   ModalDialog,
//   Typography,
// } from "@mui/joy";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { createApiFunction } from "../../api/ApiFunction";
// import { signupApi } from "../../api/Apis";
// import { useNavigate } from "react-router-dom";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// // ✅ Validation Schema
// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
//   email: Yup.string().required("Email is required").email("Email is invalid"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(/[a-z]/, "At least one lowercase letter")
//     .matches(/[A-Z]/, "At least one uppercase letter")
//     .matches(/\d/, "At least one number")
//     .matches(/[@$!%*?&#]/, "At least one special character"),
//   confirmPassword: Yup.string()
//     .required("Confirm Password is required")
//     .oneOf([Yup.ref("password"), null], "Passwords must match"),
// });

// export default function SigninModal({ open, onClose, onregister }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ Hook Form setup with Yup validation
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//   });

//   const onSubmit = async (data) => {
//     try {
//       const response = await createApiFunction("post", signupApi, null, data);
//       if (response) {
//         console.log(response);
//         onregister();
//       }
//     } catch (error) {
//       console.error("Signup failed:", error);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <ModalDialog>
//         <ModalClose />
//         <Typography level="h5" mb={2}>
//           Sign In
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Name */}
//           <FormControl sx={{mb:2}}>
//             <Input
//               variant="outline"
//               {...register("name")}
//               placeholder="Enter Name..."
//               size="sm"
//               color="primary"
//             />
//             {errors.name && (
//               <Typography color="danger" level="body2">
//                 {errors.name.message}
//               </Typography>
//             )}
//           </FormControl>

//           {/* Email */}
//           <FormControl sx={{ mb: 2 }}>
//             <Input
//               variant="outline"
//               {...register("email")}
//               placeholder="Enter Email"
//               size="sm"
//               color="primary"
//             />
//             {errors.email && (
//               <Typography color="danger" level="body2">
//                 {errors.email.message}
//               </Typography>
//             )}
//           </FormControl>

//           {/* Password */}
//           <FormControl sx={{ mb: 2, position: "relative" }}>
//             <Input
//               variant="outline"
//               {...register("password")}
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter Password"
//               size="sm"
//               color="primary"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               style={{
//                 position: "absolute",
//                 right: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 background: "transparent",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </button>
//             {errors.password && (
//               <Typography color="danger" level="body2">
//                 {errors.password.message}
//               </Typography>
//             )}
//           </FormControl>

//           {/* Confirm Password */}
//           <FormControl sx={{ mb: 2 }}>
//             <Input
//               variant="outline"
//               {...register("confirmPassword")}
//               type="password"
//               placeholder="Confirm Password"
//               size="sm"
//               color="primary"
//             />
//             {errors.confirmPassword && (
//               <Typography color="danger" level="body2">
//                 {errors.confirmPassword.message}
//               </Typography>
//             )}
//           </FormControl>

//           {/* Submit */}
//           <FormControl>
//             <Input
//               variant="solid"
//               size="sm"
//               color="primary"
//               type="submit"
//               value="Register"
//             />
//           </FormControl>
//         </form>
//       </ModalDialog>
//     </Modal>
//   );
// }


// SignupPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { createApiFunction } from "../api/ApiFunction";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import { signupApi } from "../api/Apis";

// ✅ Validation Schema
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
  terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // ✅ Submit
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
      
      

      if (response?.status === 201 || response?.success) {
        showSuccessToast("Account created successfully!");
        reset();
        navigate("/signin");
      } else {
        showErrorToast(response?.message || "Something went wrong. Please try again.");
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
    <div className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-full xl:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Sign Up</h1>
        <p className="text-gray-500 mb-8">Create an account to get started!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className={`h-11 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
                className={`h-11 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              className={`h-11 w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                 autoComplete="new-password"
                className={`h-11 w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                 autoComplete="new-password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
    <EyeIcon className="h-5 w-5" />
  ) : (
    <EyeSlashIcon className="h-5 w-5" />
  )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className={`h-11 w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              {...register("terms")}
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>.
              {errors.terms && (
                <div className="text-xs text-red-500 mt-1">{errors.terms.message}</div>
              )}
            </label>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 cursor-pointer rounded-lg font-medium text-white flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
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

          <p className="text-sm text-gray-600 mt-3 text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
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
            Shield your campaigns. Boost your performance. Experience smart traffic cloaking — secure, optimized, effortless.
          </p>
        </div>
      </div>
    </div>
  );
}

