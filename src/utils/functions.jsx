import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi, javascriptIntegrationCheckApi } from "../api/Apis";
import { showSuccessToast } from "../components/toast/toast";

export const javascriptIntegration = async (camp) => {
  const url = camp?.url
  const data = {
    url: url,        // client site URL
    campId: camp?.cid           // expected camp id
  }
  const res = await apiFunction(
    "post",
    javascriptIntegrationCheckApi, null, data
  );
  console.log(res);

  if (res.status === 200) {
    const data = {
      integration: true,
      integrationUrl: url,
      integrationType: "javascript"
    }
    const integrate = await apiFunction("patch", createCampaignApi, camp?.id, data)
    alert("✅ Integration Successful");
  } else {
    alert("❌ Integration Failed");
  }
};


export async function checkIntegration(camp) {
    const url = camp?.url;
  
    const res = await fetch(`${url}/?TS-BHDNR-84848=1`);
    
  
    const text = await res.text();
    console.log("result", camp, "text", text,camp?.id);
  
    let status = "failed";
    if (text.trim() != camp?.cid) {
      status = "false";
      showSuccessToast("Integration Error try again " + status);
      const data = {
      integration: false,
      integrationUrl: null,
      integrationType: null
    }
    console.log("cyc",camp.id);
    const integrate = await apiFunction("patch", createCampaignApi, camp?.id, data);
    
      return
    }
    if (text.trim() === camp?.cid) {
      status = "success";
    }
    const data = {
      integration: true,
      integrationUrl: url,
      integrationType: "php"
    }
    console.log("cyc",camp.id);
    const integrate = await apiFunction("patch", createCampaignApi, camp?.id, data)
    console.log(integrate.status,"ghfshg");
    
    if (integrate.status === 200) return showSuccessToast("Integration Status: " + status);
    showErrorToast("Integration Error try again" + status);
  }