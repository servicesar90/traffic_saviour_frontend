import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi, javascriptIntegrationCheckApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const getIntegrationErrorMessage = (error) => {
  if (error?.name === "AbortError") {
    return "URL test timed out. Check that the page is online and try again.";
  }
  if (error instanceof TypeError && error?.message === "Failed to fetch") {
    return "The URL could not be reached. Check the address, HTTPS, and CORS settings.";
  }
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Integration check failed. Please verify the URL and try again."
  );
};

const parseIntegrationUrl = (value) => {
  const trimmed = value?.trim();
  if (!trimmed) throw new Error("No integration URL is saved for this campaign.");

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("The saved integration URL is invalid. Add a valid HTTP or HTTPS URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP or HTTPS URLs can be tested.");
  }
  return parsed;
};

const markValidationFailed = async (camp) => {
  await apiFunction("patch", createCampaignApi, camp?.id, {
    integration: false,
  });
};

export const javascriptIntegration = async (camp) => {
  try {
    if (!camp?.id || !camp?.cid) {
      throw new Error("Campaign details are missing. Refresh the page and try again.");
    }
    const url = parseIntegrationUrl(camp?.url).toString();

    const res = await apiFunction(
      "post",
      javascriptIntegrationCheckApi,
      null,
      { url, campId: camp?.cid }
    );

    if (res?.data?.success !== true) {
      await markValidationFailed(camp);
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
    if (!camp?.id || !camp?.cid) {
      throw new Error("Campaign details are missing. Refresh the page and try again.");
    }
    const savedUrl = parseIntegrationUrl(camp?.url).toString();
    const url = new URL(savedUrl);
    url.searchParams.set("TS-CODE-16161", "1");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    let res;
    try {
      res = await fetch(url.toString(), { signal: controller.signal });
    } finally {
      window.clearTimeout(timeoutId);
    }
    if (!res.ok) {
      throw new Error(`URL test failed: the page returned HTTP ${res.status}.`);
    }

    const text = await res.text();
    if (text.trim() !== camp?.cid) {
      await markValidationFailed(camp);
      showErrorToast(
        "Integration failed: this URL does not contain the expected campaign code."
      );
      return false;
    }

    await apiFunction("patch", createCampaignApi, camp?.id, {
      integration: true,
      integrationUrl: savedUrl,
      integrationType: "php",
    });
    showSuccessToast("Integration completed successfully.");
    return true;
  } catch (error) {
    showErrorToast(getIntegrationErrorMessage(error));
    return false;
  }
}
