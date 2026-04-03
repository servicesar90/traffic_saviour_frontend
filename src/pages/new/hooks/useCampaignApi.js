import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFunction } from "../../../api/ApiFunction";
import { createCampaignApi } from "../../../api/Apis";

export const useCampaignQuery = (campaignId) =>
  useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const res = await apiFunction("get", `${createCampaignApi}/${campaignId}`, null, null);
      return res?.data?.data;
    },
    enabled: !!campaignId,
    retry: 1,
  });

export const useCreateCampaign = () =>
  useMutation({
    mutationFn: async (payload) => {
      const res = await apiFunction("post", createCampaignApi, null, payload);
      return res?.data;
    },
  });

export const useUpdateCampaign = () =>
  useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await apiFunction("patch", createCampaignApi, id, payload);
      return res?.data;
    },
  });
