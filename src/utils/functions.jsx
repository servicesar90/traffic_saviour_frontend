import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi, javascriptIntegrationCheckApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const getIntegrationErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Integration check failed. Please verify the URL and try again.";

export const javascriptIntegration = async (camp) => {
  try {
    const url = camp?.url?.trim();
    new URL(url);

    const res = await apiFunction(
      "post",
      javascriptIntegrationCheckApi,
      null,
      { url, campId: camp?.cid }
    );

    if (!res?.data?.success) {
      showErrorToast(
        res?.data?.message ||
          "Integration check failed. Script tag was not detected."
      );
      return false;
    }

    await apiFunction("patch", createCampaignApi, camp?.id, {
      integration: true,
      integrationUrl: url,
      integrationType: "javascript",
    });
    showSuccessToast("Integration completed successfully.");
    return true;
  } catch (error) {
    showErrorToast(getIntegrationErrorMessage(error));
    return false;
  }
};

export async function checkIntegration(camp) {
  try {
    const url = new URL(camp?.url?.trim());
    url.searchParams.set("TS-CODE-16161", "1");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Integration URL returned HTTP ${res.status}.`);
    }

    const text = await res.text();
    if (text.trim() !== camp?.cid) {
      await apiFunction("patch", createCampaignApi, camp?.id, {
        integration: false,
        integrationUrl: null,
        integrationType: null,
      });
      showErrorToast(
        "Integration check failed. Campaign code was not found at this URL."
      );
      return false;
    }

    await apiFunction("patch", createCampaignApi, camp?.id, {
      integration: true,
      integrationUrl: camp.url.trim(),
      integrationType: "php",
    });
    showSuccessToast("Integration completed successfully.");
    return true;
  } catch (error) {
    showErrorToast(getIntegrationErrorMessage(error));
    return false;
  }
}
