import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isPlanValid } from "../utils/checkPlan";
import PlanRequiredModal from "../components/PlanRequireModal";
import { apiFunction } from "../api/ApiFunction";
import { getUpdatedPlan } from "../api/Apis";
import { signOutApi, freePlanClaimApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const PLAN_ALLOWED_ROUTES = new Set([
  "/Dashboard/pricing",
  "/Dashboard/billing",
]);

const toBool = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

export default function DashboardGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isClaimingFree, setIsClaimingFree] = useState(false);
  const [showFreeClaimView, setShowFreeClaimView] = useState(false);

  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined" || raw === "null") return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const syncFreeClaimView = () => {
    const user = getStoredUser();
    setShowFreeClaimView(!toBool(user?.free_claimed));
    return user;
  };

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("plan");
    localStorage.removeItem("todo_tasks");
  };

  const handleLogout = async () => {
    try {
      const response = await apiFunction("get", signOutApi, null, null);
      if (response) {
        clearSession();
      }
    } catch (error) {
      clearSession();
    } finally {
      setShowPlanModal(false);
      navigate("/signin");
    }
  };

  const setUpdatedPlan = async () => {
    try {
      const response = await apiFunction("get", getUpdatedPlan, null, null);
      if (response?.status === 200 && response?.data?.data) {
        const subscriptionData = response?.data?.data;
        localStorage.setItem("plan", JSON.stringify(subscriptionData));
      }
    } catch (error) {
      console.error("Failed to fetch updated plan:", error);
    }
  };

  const handleUpgrade = () => {
    setShowPlanModal(false);
    navigate("/Dashboard/pricing");
  };

  const handleClaimFree = async () => {
    try {
      setIsClaimingFree(true);

      const currentUser = getStoredUser();
      const body = {
        planId: "c56bad95-f3d3-11f0-a7eb-0ec2a4ae6687",
        userId: currentUser?.id,
      };

      const response = await apiFunction("post", freePlanClaimApi, null, body);

      if (response?.data?.success || response?.status === 200) {
        await setUpdatedPlan();
        const updatedUser = { ...currentUser, free_claimed: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowFreeClaimView(false);
        setShowPlanModal(false);
        showSuccessToast("Free plan claimed successfully.");
      }
    } catch (error) {
      showErrorToast("Failed to claim free plan. Please try again.");
    } finally {
      setIsClaimingFree(false);
    }
  };

  useEffect(() => {
    syncFreeClaimView();
    const isAllowedRoute = PLAN_ALLOWED_ROUTES.has(location.pathname);
    const shouldBlock = !isPlanValid() && !isAllowedRoute;
    setShowPlanModal(shouldBlock);
  }, [location.pathname]);

  return (
    <>
      {children}

      <PlanRequiredModal
        open={showPlanModal}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
        showFreeClaimView={showFreeClaimView}
        onClaimFree={handleClaimFree}
        isClaimingFree={isClaimingFree}
      />
    </>
  );
}
