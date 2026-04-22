import {
  FaPlayCircle,
  FaTrashAlt,
  FaSyncAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import { apiFunction } from "../../api/ApiFunction";
import { createCampaignApi } from "../../api/Apis";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { useNavigate } from "react-router-dom";
import { checkIntegration, javascriptIntegration } from "../../utils/functions";
import { useEffect, useMemo, useState } from "react";

export default function Campaign({ camp, setShowIntegrationTable }) {
  const [campaign, setCampaign] = useState(camp);

  const campaignName = camp?.campaign_info?.campaignName || "NA";
  const navigate = useNavigate();

  const tableData = campaign
    ? [
        {
          id: campaign.uid,
          cid: campaign.cid,
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

  const row = tableData[0];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#ecfdf3] text-[#027a48] border border-[#abefc6]";
      case "Block":
      case "Inactive":
        return "bg-[#fff1f3] text-[#be123c] border border-[#fecdd3]";
      case "Pending":
        return "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]";
      default:
        return "bg-[#f8fafc] text-[#475569] border border-[#d5d9e4]";
    }
  };

  const methodReady = Boolean(row?.type);
  const deploymentReady = Boolean(
    row?.url && row.url !== "-" && row.url !== "https://webservices.press"
  );
  const validationReady = Boolean(campaign?.integration);

  const timelineSteps = useMemo(
    () => [
      {
        title: "Campaign Prepared",
        description: "Campaign config is ready for integration setup.",
        done: Boolean(campaign?.uid),
      },
      {
        title: "Method Selected",
        description: "Choose PHP, WordPress, or JavaScript integration mode.",
        done: methodReady,
      },
      {
        title: "Deployment Added",
        description: "Snippet/plugin URL is attached to the campaign.",
        done: deploymentReady,
      },
      {
        title: "Validation Complete",
        description: "Integration check passed and campaign is connected.",
        done: validationReady,
      },
    ],
    [campaign?.uid, methodReady, deploymentReady, validationReady]
  );

  const completedCount = timelineSteps.filter((s) => s.done).length;

  const handleEditCampaign = (camp) => {
    navigate("/Dashboard/create-campaign", {
      state: {
        data: camp,
        id: camp.uid,
        mode: "edit",
      },
    });
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      const payload = {
        integration: false,
        integrationUrl: null,
        integrationType: null,
      };

      await apiFunction("patch", createCampaignApi, id, payload);
      showSuccessToast("Cloaking Activity Closed");
      setShowIntegrationTable(true);
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to delete campaign");
    }
  };

  const handleRefresh = () => {
    fetchdata();
  };

  async function testIntegration(camp) {
    const type = camp?.type;
    if (type === "javascript") {
      javascriptIntegration(camp);
    } else if (type === "php") {
      checkIntegration(camp);
    }
  }

  const fetchdata = async () => {
    const res = await apiFunction("get", createCampaignApi, camp.uid, null);
    if (res.status === 200) setCampaign(res.data.data);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  if (!row) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mt-8 p-5 bg-white border border-[#d5d9e4] rounded-md flex items-center gap-3 text-[#52607a]">
            <FaExclamationCircle className="w-5 h-5 text-[#3c79ff]" />
            <p className="text-[13px]">No integration records found for this campaign.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="dashboard-heading text-left">Setup Timeline</h1>
            <p className="text-[12px] text-[#52607a] mt-1 text-left">
              Campaign: <span className="font-semibold text-[#141824] ">{campaignName}</span>
            </p>
          </div>

          <button
            onClick={() => handleEditCampaign(camp)}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-[12px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Edit Campaign
          </button>
        </div>

        <div className="rounded-md border border-[#d5d9e4] bg-white px-4 py-3 mb-5 flex flex-wrap items-center gap-4">
          <p className="text-[11px] uppercase font-extrabold tracking-wide text-[#52607a]">Progress</p>
          <p className="text-[13px] font-semibold text-[#1f2a44]">
            {completedCount} / {timelineSteps.length} steps completed
          </p>
          <span className={`px-2.5 py-1 rounded-full text-[11px] ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-5">
          <div className="rounded-md border border-[#d5d9e4] bg-white p-4">
            <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-[#52607a] mb-3">Integration Steps</h2>
            <div className="space-y-3">
              {timelineSteps.map((step, index) => (
                <div key={step.title} className="rounded-md border border-[#e5eaf3] bg-[#fbfdff] p-3">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {step.done ? (
                        <FaCheckCircle className="h-5 w-5 text-[#16a34a]" />
                      ) : (
                        <FaCircle className="h-5 w-5 text-[#94a3b8]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1f2a44] text-left">
                        {index + 1}. {step.title}
                      </p>
                      <p className="text-[12px] text-[#52607a] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-[#d5d9e4] bg-white p-4">
              <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-[#52607a] mb-3">Integration Snapshot</h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between rounded-sm border border-[#edf1f7] px-3 py-2">
                  <span className="text-[#52607a]">Campaign ID</span>
                  <span className="font-semibold text-[#1f2a44]">{row.cid || "-"}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-[#edf1f7] px-3 py-2">
                  <span className="text-[#52607a]">Integration Type</span>
                  <span className="font-semibold text-[#1f2a44]">{row.type || "-"}</span>
                </div>
                <div className="rounded-sm border border-[#edf1f7] px-3 py-2">
                  <p className="text-[#52607a] mb-1">URL</p>
                  <p className="font-semibold text-[#1f2a44] break-all">{row.url}</p>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-[#edf1f7] px-3 py-2">
                  <span className="text-[#52607a]">Created</span>
                  <span className="font-semibold text-[#1f2a44]">{row.firstInstalled}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-[#edf1f7] px-3 py-2">
                  <span className="text-[#52607a]">Updated</span>
                  <span className="font-semibold text-[#1f2a44]">{row.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#d5d9e4] bg-white p-4">
              <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-[#52607a] mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => testIntegration(row)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#d5d9e4] text-[#3c79ff] hover:bg-[#eef4ff] cursor-pointer text-[12px] font-semibold"
                >
                  <FaPlayCircle className="w-4 h-4" />
                  Test Integration
                </button>
                <button
                  onClick={() => handleRefresh(row.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#d5d9e4] text-[#475569] hover:bg-[#f8fafc] cursor-pointer text-[12px] font-semibold"
                >
                  <FaSyncAlt className="w-4 h-4" />
                  Refresh Data
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#fecdd3] text-[#e11d48] hover:bg-[#fff1f2] cursor-pointer text-[12px] font-semibold"
                >
                  <FaTrashAlt className="w-4 h-4" />
                  Remove Integration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
