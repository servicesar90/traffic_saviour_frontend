import React from "react";
import { useNavigate } from "react-router-dom";

export default function DevToolsBlocked() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontFamily: "Outfit, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "28px" }}>⚠️ DevTools Disabled</h1>

        <p style={{ marginTop: "10px", color: "#aaa" }}>
          Developer tools are not allowed on this platform.
        </p>

        {/* Added BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#4f39f6",
            color: "#fff",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ⬅ Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}
