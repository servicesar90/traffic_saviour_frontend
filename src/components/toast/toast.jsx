import toast from "react-hot-toast";

const baseStyle = {
  backgroundColor: "#ffffff",
  color: "#475569",
  border: "1px solid #e2e8f0",
  padding: "12px 14px",
  fontSize: "14px",
  fontWeight: "500",
  borderRadius: "10px",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  maxWidth: "420px",
  minWidth: "300px",
  position: "relative",
  overflow: "hidden",
};

const ToastCard = ({ t, message, color, icon, duration }) => (
  <div
    style={{
      ...baseStyle,
      opacity: t.visible ? 1 : 0,
      transform: t.visible ? "translateY(0)" : "translateY(-10px)",
      transition: "all 260ms ease",
    }}
  >
    <style>{`
      @keyframes toast-progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
    `}</style>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          backgroundColor: color,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>{message}</div>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Close"
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 2,
        }}
      >
        x
      </button>
    </div>
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        background: color,
        transformOrigin: "left",
        animation: `toast-progress ${duration}ms linear forwards`,
      }}
    />
  </div>
);

const SINGLE_TOAST_ID = "global-toast";

const showCustomToast = (message, { color, icon, duration = 2200 }) => {
  toast.dismiss();
  toast.remove();
  return toast.custom(
    (t) => (
      <ToastCard
        t={t}
        message={message}
        color={color}
        icon={icon}
        duration={duration}
      />
    ),
    { duration, id: SINGLE_TOAST_ID },
  );
};

export const showSuccessToast = (message) =>
  showCustomToast(message, { color: "#22c55e", icon: "v" });

export const showErrorToast = (message) =>
  showCustomToast(message, { color: "#ef4444", icon: "!" });

export const showWarningToast = (message) =>
  showCustomToast(message, { color: "#f59e0b", icon: "!" });

export const showInfoToast = (message) =>
  showCustomToast(message, { color: "#3b82f6", icon: "i" });

