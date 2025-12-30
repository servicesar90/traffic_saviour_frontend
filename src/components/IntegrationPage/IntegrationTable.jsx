import { Activity, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { apiFunction } from "../../api/ApiFunction";
import { createCampaignApi } from "../../api/Apis";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { useNavigate,useLocation } from "react-router-dom";
import { checkIntegration, javascriptIntegration } from "../../utils/functions";
import { useEffect, useState } from "react";


export default function Campaign({ camp, setShowIntegrationTable  }) {
  // -----------------------------
  // Derived values from backend
  // -----------------------------
  const [campaign,setCampaign] = useState(camp)


  
  const campaignName =
    camp?.campaign_info?.campaignName || "NA";
    const navigate = useNavigate();

  const tableData = campaign
    ? [
        {
          id: campaign.uid,
          cid:campaign.cid ,
          url: campaign.integrationUrl || "https://webservices.press",
          status: campaign.status || "Inactive",
          type: campaign.integrationType,
          firstInstalled: campaign.createdAt
            ? new Date(campaign.createdAt).toLocaleString("en-IN")
            : "-",
          lastUpdated: campaign.updatedAt
            ? new Date(campaign.updatedAt).toLocaleString("en-IN")
            : "-",
          
        },
      ]
    : [];
      
  // -----------------------------
  // Helpers
  // -----------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-900/20 text-green-400 border border-green-700/50";
      case "Block":
      case "Inactive":
        return "bg-red-900/20 text-red-400 border border-red-700/50";
      case "Pending":
        return "bg-yellow-900/20 text-yellow-400 border border-yellow-700/50";
      default:
        return "bg-gray-900/20 text-gray-400 border border-gray-700/50";
    }
  };

  const handleEditCampaign=(camp)=>{
    navigate("/Dashboard/create-campaign", {
    state: {
      data: camp,
      id:camp.uid,
      mode: "edit", // optional but useful
    },
  });

  }

 const handleDelete = async (id) => {
  if (!id) return;

  

  try {
    const payload={
      integration:false,
      integrationUrl:null,
      integrationType:null
    };

    const res = await apiFunction(
      "patch",
      createCampaignApi, id , payload// 👈 same API, DELETE method
    );

    

    showSuccessToast("Cloaking Activity Closed");
    setShowIntegrationTable(true)
    // navigate('/Dashboard/create-campaign',{
    //   state: {
    //   data: camp,
    //   id:camp.uid,
    //   mode: "edit", // optional but useful
    // },
    // })

    // OPTIONAL: UI se remove karna ho to
    // refetchCampaigns();
    // ya parent state update


  
  } catch (error) {
    console.error("Delete campaign error:", error);
    showErrorToast(
      error?.response?.data?.message || "Failed to delete campaign"
    );
  }
};

  const handleRefresh = (id) => {

  };

  const handleTestUrl = (url) => {
    if (!url || url === "-") return;
    window.open(url, "_blank");
  };

  async function testIntegration(camp){
    const type = camp?.type;
    if(type === "javascript"){
      javascriptIntegration(camp)
    }else if(type === "php"){
      checkIntegration(camp)
    }else{
      console.log("incorect type",type);
      
    }
    
  }

  const fetchdata = async()=>{
    const res = await apiFunction("get",createCampaignApi,camp.uid,null);
    if(res.status === 200) setCampaign(res.data.data)

  }

  useEffect(()=>{
    fetchdata()
  },[])
  // async function checkIntegration(camp) {
  //   const url = camp?.url;
  
  //   const res = await fetch(`${url}/?TS-BHDNR-84848=1`);
    
  
  //   const text = await res.text();
  //   console.log("result", camp, "text", text,camp?.id);
  
  //   let status = "failed";
  //   if (text.trim() != camp?.cid) {
  //     status = "false";
  //     showSuccessToast("Integration Error try again " + status);
  //     const data = {
  //     integration: false,
  //     integrationUrl: null,
  //     integrationType: null
  //   }
  //   console.log("cyc",camp.id);
  //   const integrate = await apiFunction("patch", createCampaignApi, camp?.id, data);
    
  //     return
  //   }
  //   if (text.trim() === camp?.cid) {
  //     status = "success";
  //   }
  //   const data = {
  //     integration: true,
  //     integrationUrl: url,
  //     integrationType: "Php paste"
  //   }
  //   console.log("cyc",camp.id);
  //   const integrate = await apiFunction("patch", createCampaignApi, camp?.id, data)
  //   console.log(integrate.status,"ghfshg");
    
  //   if (integrate.status === 200) return showSuccessToast("Integration Status: " + status);
  //   showErrorToast("Integration Error try again" + status);
  // }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Campaign Name
            </h1>
            <span className="text-xl sm:text-2xl font-semibold text-emerald-400">
              [{campaignName}]
            </span>
          </div>

          <button
            onClick={() => handleEditCampaign(camp)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-sm shadow-lg transition duration-150 cursor-pointer"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Edit Campaign
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm text-slate-300">
                    URL
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    First Installed
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Last Upgrade
                  </th>
                  <th className="px-6 py-4 text-center text-sm text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-700/30 hover:bg-slate-700/20 ${
                      index === tableData.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* URL */}
                    <td className="px-6 py-4  text-left">
                      {row.url !== "-" ? (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-blue-400 underline"
                        >
                          {row.url}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not Available</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-left">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-slate-300 text-sm text-left">
                      {row.type}
                    </td>

                    {/* First Installed */}
                    <td className="px-6 py-4 text-slate-400 text-sm text-left">
                      {row.firstInstalled}
                    </td>

                    {/* Last Updated */}
                    <td className="px-6 py-4 text-slate-400 text-sm text-left">
                      {row.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
  <div className="flex gap-3 justify-center">

    {/* 🔍 Test / Integration */}
    <button
      onClick={() => testIntegration(row)}
      title="Test Integration"
      className="p-2 rounded-md transition-all duration-200 
                 text-blue-400 hover:text-blue-300 
                 hover:bg-blue-500/10 hover:scale-110 cursor-pointer"
    >
      <Activity className="w-5 h-5" />
    </button>

    {/* 🗑 Delete */}
    <button
      onClick={() => handleDelete(row.id)}
      title="Delete Campaign"
      className="p-2 rounded-md transition-all duration-200 
                 text-red-400 hover:text-red-300 
                 hover:bg-red-500/10 hover:scale-110 cursor-pointer"
    >
      <Trash2 className="w-5 h-5" />
    </button>

    {/* 🔄 Refresh */}
    <button
      onClick={() => handleRefresh(row.id)}
      title="Refresh Status"
      className="p-2 rounded-md transition-all duration-200 
                 text-gray-400 hover:text-gray-200 
                 hover:bg-gray-500/10 hover:scale-110 cursor-pointer"
    >
      <RefreshCw className="w-5 h-5" />
    </button>

  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {tableData.length === 0 && (
          <div className="mt-8 p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg flex items-center gap-3 text-slate-300">
            <AlertCircle className="w-5 h-5" />
            <p>No campaign data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
