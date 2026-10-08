import toast from "react-hot-toast";
import { isPlanValid } from "./checkPlan";

export const openAiBuilder = (navigate, onComplete) => {
  const token = localStorage.getItem("token");
  const builderUrl = import.meta.env.VITE_AI_BUILDER?.trim();

  if (!token) {
    toast.error("Please sign in again to open AI Builder.");
    return;
  }
  if (!isPlanValid()) {
    toast.error("An active plan is required to access AI Builder.");
    navigate("/Dashboard/pricing");
    onComplete?.();
    return;
  }
  if (!builderUrl) {
    toast.error("AI Builder is currently unavailable.");
    return;
  }

  const url = new URL(builderUrl);
  url.hash = `token=${encodeURIComponent(token)}`;
  window.open(url.href, "_blank", "noopener,noreferrer");
  onComplete?.();
};
