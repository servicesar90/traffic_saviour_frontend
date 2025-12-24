import toast from "react-hot-toast";

export const showSuccessToast = (message) =>
  toast.success(message, {
    duration: 2000,
    style: {
      background: "linear-gradient(135deg, #0784c9 0%, #065a94 100%)",
      color: "#ffffff",
      border: "1px solid rgba(7, 132, 201, 0.3)",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow:
        "0 8px 32px rgba(7, 132, 201, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      maxWidth: "400px",
      minWidth: "300px",
      animation: "slideIn 0.3s ease-out",
    },
    iconTheme: {
      primary: "#ffffff",
      secondary: "#0784c9",
    },
  });

export const showErrorToast = (message) =>
  toast.error(message, {
    duration: 2000,
    style: {
      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
      color: "#ffffff",
      border: "1px solid rgba(220, 38, 38, 0.3)",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow:
        "0 8px 32px rgba(220, 38, 38, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      maxWidth: "400px",
      minWidth: "300px",
      animation: "slideIn 0.3s ease-out",
    },
    iconTheme: {
      primary: "#ffffff",
      secondary: "#dc2626",
    },
  });

export const showWarningToast = (message) =>
  toast(message, {
    duration: 2000,
    icon: "⚠️",
    style: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow:
        "0 8px 32px rgba(245, 158, 11, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      maxWidth: "400px",
      minWidth: "300px",
      animation: "slideIn 0.3s ease-out",
    },
  });

export const showInfoToast = (message) =>
  toast(message, {
    duration: 2000,
    icon: "ℹ️",
    style: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      color: "#ffffff",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow:
        "0 8px 32px rgba(59, 130, 246, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      maxWidth: "400px",
      minWidth: "300px",
      animation: "slideIn 0.3s ease-out",
    },
  });

