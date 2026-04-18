import React, { useEffect, useRef, useState } from "react";
import { Trash2, FileDown, Plus, Pencil } from "lucide-react";
import { apiFunction } from "../api/ApiFunction";
import { blacklistIpApi, getWhitelistApi } from "../api/Apis";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import BlacklistedIPsPage from "./IpListings";

export default function WhitelistIp() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [singleIp, setSingleIp] = useState("");
  const [ipName, setIpName] = useState("");
  const [ipDescription, setIpDescription] = useState("");
  const [ipActive, setIpActive] = useState(true);
  const [ipBlacklisted, setIpBlacklisted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [ips, setIps] = useState([]);
  const [loadingIps, setLoadingIps] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortRef = useRef(null);

  const normalizeFlag = (value) =>
    value === true ||
    value === 1 ||
    value === "1" ||
    String(value).toLowerCase() === "true";

  const isValidIPv4 = (ip) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return ipv4Regex.test(ip);
  };

  const isValidIPv6 = (ip) => {
    const ipv6Regex =
      /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
    return ipv6Regex.test(ip);
  };

  const isValidIP = (ip) => isValidIPv4(ip) || isValidIPv6(ip);

  const exportWhitelistedIps = () => {
    if (!ips || ips.length === 0) {
      showErrorToast("No IPs to export");
      return;
    }
    const rows = [
      ["SN", "IP Address", "Title", "Description", "Status", "Active", "Added On"],
      ...ips.map((ip, index) => [
        index + 1,
        ip.ip,
        ip.name || "",
        ip.description || "",
        ip.isBlacklisted ? "Blacklisted" : "Allowed",
        ip.isActive ? "Active" : "Inactive",
        ip.addedOn,
      ]),
    ];
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `whitelisted-ips-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccessToast("Export started");
  };

  const addWhitelistedIp = async (payload) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showErrorToast("User not logged in");
        return false;
      }

      if (!payload?.IPAddress || !payload.IPAddress.trim()) {
        showErrorToast("Please enter IP address");
        return false;
      }

      if (!isValidIP(payload.IPAddress.trim())) {
        showErrorToast(`Invalid IP: ${payload.IPAddress}`);
        return false;
      }

      const finalPayload = {
        userId,
        IPAddress: [payload.IPAddress.trim()],
        name: payload.name || "",
        description: payload.description || "",
        isActive: payload.isActive ? true : false,
        isBlacklisted: payload.isBlacklisted ? true : false,
      };

      await apiFunction("post", blacklistIpApi, null, finalPayload);
      await fetchWhitelistedIps();

      showSuccessToast("IP added successfully");
      setSingleIp("");
      setIpName("");
      setIpDescription("");
      setIpActive(true);
      setIpBlacklisted(false);
      setIsDrawerOpen(false);
      return true;
    } catch (error) {
      if (error?.response?.status === 409) {
        const shouldSwitch = window.confirm(
          "This IP already exists in another list. Do you want to move it to Whitelist?",
        );
        if (!shouldSwitch) {
          showErrorToast("IP already exists");
          return false;
        } 

        try {
          const userData = JSON.parse(localStorage.getItem("user"));
          const userId = userData?.id;
          if (!userId) {
            showErrorToast("User not logged in");
            return false;
          }

          const res = await apiFunction(
            "get",
            `${blacklistIpApi}?userId=${userId}`,
            null,
            null,
          );
          const rawData = Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.data?.data?.rows)
                ? res.data.data.rows
                : [];
          const existing = rawData.find(
            (row) =>
              String(row.IPAddress || "").trim() === payload.IPAddress.trim(),
          );
          if (!existing) {
            showErrorToast("IP exists but could not be found");
            return false;
          }

          await updateWhitelistedIp({
            id: existing.id,
            IPAddress: existing.IPAddress,
            name: existing.name || payload.name || "",
            description: existing.description || payload.description || "",
            isActive: true,
            isBlacklisted: false,
          });
          await fetchWhitelistedIps();
          showSuccessToast("Moved to Whitelist");
          return true;
        } catch {
          showErrorToast("Failed to switch list");
          return false;
        }
      }
      showErrorToast("Failed to add IP(s)");
      return false;
    }
  };

  const updateWhitelistedIp = async (payload) => {
    console.log(`pfsdjn ${JSON.stringify(payload)}`);
    
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showErrorToast("User not logged in");
        return;
      }

      const updatePayload = {
        userId,
        IPAddress: payload.IPAddress,
        name: payload.name || "",
        description: payload.description || "",
        isActive: payload.isActive ? true : false,
        isBlacklisted: payload.isBlacklisted ? true : false,
      };
      console.log("updated payload",updatePayload);
      
      await apiFunction("put", blacklistIpApi, payload?.id, updatePayload);

      setIps((prev) =>
        prev.map((row) =>
          row.id === payload.id
            ? {
                ...row,
                ip: payload.IPAddress?.trim() || row.ip,
                name: payload.name || "",
                description: payload.description || "",
                isActive: Boolean(payload.isActive),
                isBlacklisted: Boolean(payload.isBlacklisted),
              }
            : row
        )
      );

      showSuccessToast("IP updated successfully");
    } catch (error) {
      showErrorToast("Failed to update IP");
    }
  };

  const deleteWhitelistedIp = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this IP?",
      );

      if (!confirmDelete) return;

      await apiFunction("delete", blacklistIpApi, id, null);
      showSuccessToast("IP deleted successfully");
      setIps((prev) => prev.filter((ip) => ip.id !== id));
    } catch (error) {
      showErrorToast("Failed to delete IP");
    }
  };

  const toggleActiveStatus = async (ip) => {
    await updateWhitelistedIp({
      id: ip.id,
      IPAddress: ip.ip,
      name: ip.name,
      description: ip.description,
      isActive: !ip.isActive,
      isBlacklisted: ip.isBlacklisted,
    });
  };

  const openAddDrawer = () => {
    setSingleIp("");
    setIpName("");
    setIpDescription("");
    setIpActive(true);
    setIpBlacklisted(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  };

  const handleEditIp = (ip) => {
    setSingleIp(ip.ip || "");
    setIpName(ip.name || "");
    setIpDescription(ip.description || "");
    setIpActive(normalizeFlag(ip.isActive));
    setIpBlacklisted(normalizeFlag(ip.isBlacklisted));
    setEditingId(ip.id);
    setIsDrawerOpen(true);
  };

  const handleSubmitIps = async () => {
    if (editingId) {
      await updateWhitelistedIp({
        id: editingId,
        IPAddress: singleIp,
        name: ipName,
        description: ipDescription,
        isActive: ipActive,
        isBlacklisted: ipBlacklisted,
      });
      setEditingId(null);
      setIsDrawerOpen(false);
      return;
    }

    const added = await addWhitelistedIp({
      IPAddress: singleIp,
      name: ipName,
      description: ipDescription,
      isActive: ipActive,
      isBlacklisted: ipBlacklisted,
    });
    if (added) {
      setIsDrawerOpen(false);
    }
  };

  const fetchWhitelistedIps = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      setLoadingIps(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showErrorToast("User not logged in");
        return;
      }

      let res;
      try {
        res = await apiFunction(
          "get",
          `${getWhitelistApi}?userId=${userId}`,
          null,
          null,
          controller.signal,
        );
      } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 405) {
          res = await apiFunction(
            "get",
            `${blacklistIpApi}?userId=${userId}`,
            null,
            null,
            controller.signal,
          );
          if (!res) return;
          const rawAll = Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.data?.data?.rows)
                ? res.data.data.rows
                : [];
          const rawData = rawAll.filter(
            (item) => !normalizeFlag(item.isBlacklisted),
          );

          const formatted = rawData.map((item, index) => ({
            sn: index + 1,
            ip: item.IPAddress || "-",
            name: item.name || "",
            description: item.description || "",
            isActive:
              item.isActive === true ||
              String(item.isActive) === "1" ||
              String(item.isActive).toLowerCase() === "true",
            isBlacklisted:
              item.isBlacklisted === true ||
              String(item.isBlacklisted) === "1" ||
              String(item.isBlacklisted).toLowerCase() === "true",
            addedOn: item.createdAt
              ? new Date(item.createdAt).toLocaleString("en-IN")
              : "-",
            id: item.id,
          }));

          setIps(formatted);
          return;
        }
        throw error;
      }
      if (!res) return;

      let rawData = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data?.rows)
            ? res.data.data.rows
            : [];

      if (!rawData || rawData.length === 0) {
        const fallbackRes = await apiFunction(
          "get",
          `${blacklistIpApi}?userId=${userId}`,
          null,
          null,
          controller.signal,
        );
        const fallbackData = Array.isArray(fallbackRes?.data?.data)
          ? fallbackRes.data.data
          : Array.isArray(fallbackRes?.data)
            ? fallbackRes.data
            : Array.isArray(fallbackRes?.data?.data?.rows)
              ? fallbackRes.data.data.rows
              : [];
        rawData = fallbackData.filter(
          (item) => !normalizeFlag(item.isBlacklisted),
        );
      } else {
        rawData = rawData.filter((item) => !normalizeFlag(item.isBlacklisted));
      }

      const formatted = rawData.map((item, index) => ({
        sn: index + 1,
        ip: item.IPAddress || "-",
        name: item.name || "",
        description: item.description || "",
        isActive:
          item.isActive === true ||
          String(item.isActive) === "1" ||
          String(item.isActive).toLowerCase() === "true",
        isBlacklisted:
          item.isBlacklisted === true ||
          String(item.isBlacklisted) === "1" ||
          String(item.isBlacklisted).toLowerCase() === "true",
        addedOn: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-IN")
          : "-",
        id: item.id,
      }));

      setIps(formatted);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      showErrorToast("Failed to fetch IPs");
    } finally {
      setLoadingIps(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    try {
      setIsRefreshing(true);
      await fetchWhitelistedIps();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchWhitelistedIps();
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const TrashIcon = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="text-red-500 hover:text-red-600 cursor-pointer"
      aria-label="Delete IP"
    >
      <Trash2 size={16} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 p-0 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="dashboard-heading text-left">Whitelisted IPs</h1>
            <p className="dashboard-subheading text-left">
              Manage, add or remove whitelisted IP addresses with ease
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddDrawer}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] hover:bg-[#356ee6] cursor-pointer !text-white"
            >
              <Plus size={14} />
              Add IP
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] border transition-all duration-200
                ${
                  isRefreshing
                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed opacity-80"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                }
              `}
            >
              <svg
                className={`h-3 w-3 transition-transform duration-300 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={exportWhitelistedIps}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-[13px] text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <FileDown size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {loadingIps ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse"></span>
                <span className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse [animation-delay:0.15s]"></span>
                <span className="h-2 w-2 rounded-full bg-[#3c79ff] animate-pulse [animation-delay:0.3s]"></span>
              </div>
              <p className="text-sm">Loading whitelisted IPs...</p>
            </div>
          ) : ips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <div className="text-2xl mb-3 text-slate-400">No items</div>
              <p className="text-lg font-medium text-slate-700">
                No Whitelisted IPs Found
              </p>
              <p className="text-sm mt-1">
                You haven't added any IP addresses yet.
              </p>

              <button
                onClick={openAddDrawer}
                className="mt-5 px-5 py-2 bg-[#3c79ff] hover:bg-[#356ee6] rounded-md text-sm cursor-pointer !text-white"
              >
                + Add Your First IP
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ips.map((ip) => (
                <div
                  key={ip.id}
                  className="bg-white border border-[#d5d9e4] rounded-md p-4"
                >
                  <div className="flex items-start justify-between gap-4 text-left">
                    <div className="flex items-start gap-3 min-w-0">
                      <input type="checkbox" className="mt-1 h-4 w-4" />
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold text-[#3c79ff] truncate">
                          {ip.ip}
                        </div>
                        <div className="text-sm text-slate-800 text-left truncate">
                          <span className="font-semibold">Title:</span>{" "}
                          <span className="font-normal text-slate-500">
                            {ip.name || "Not available"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-800 text-left truncate whitespace-nowrap">
                          <span className="font-semibold">Description:</span>{" "}
                          <span className="font-normal text-slate-500">
                            {ip.description || "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <button
                        type="button"
                        onClick={() => toggleActiveStatus(ip)}
                        className="flex items-center gap-2 cursor-pointer"
                        aria-label={ip.isActive ? "Set inactive" : "Set active"}
                      >
                        <span
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            ip.isActive ? "bg-[#22c55e]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              ip.isActive ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </span>
                        <span className={ip.isActive ? "text-[#22c55e]" : "text-slate-500"}>
                          {ip.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <hr
                    className="my-4"
                    style={{
                      border: 0,
                      borderTop: "1px solid var(--app-border)",
                      height: 0,
                    }}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                          fill="currentColor"
                          d="M7 2h10a2 2 0 0 1 2 2v2H5V4a2 2 0 0 1 2-2Zm12 6H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm-2 4h-5v5h5v-5Z"
                        />
                      </svg>
                      <span>{ip.addedOn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 border rounded-full ${
                          ip.isBlacklisted
                            ? "border-[#ef4444] text-[#ef4444]"
                            : "border-[#22c55e] text-[#22c55e]"
                        }`}
                      >
                        {ip.isBlacklisted ? "Blacklisted" : "Allowed"}
                      </span>
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => handleEditIp(ip)}
                          className="text-slate-600 hover:text-slate-800 cursor-pointer"
                          aria-label="Edit IP"
                        >
                          <Pencil size={16} />
                        </button>
                        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          Edit
                        </span>
                      </div>
                      <div className="relative group">
                        <TrashIcon onClick={() => deleteWhitelistedIp(ip.id)} />
                        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          Delete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[380px] bg-[#f5f7fa] border-l  shadow-2xl transition-transform duration-300 flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between p-5 border-b border-[#d5d9e4]">
            <div>
              <div className="text-lg font-semibold text-slate-900 text-left">Add IP</div>
              <div className="text-xs text-slate-500">Whitelist entry details</div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="ml-3 h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:text-slate-800 shrink-0"
              aria-label="Close"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                IP Address <span className="text-red-500">*</span>
              </label>
              <input
                value={singleIp}
                onChange={(e) => setSingleIp(e.target.value)}
                required
                className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700"
                placeholder="e.g. 240.4.91.158"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Title
              </label>
              <input
                value={ipName}
                onChange={(e) => setIpName(e.target.value)}
                maxLength={60}
                className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700"
                placeholder="e.g. Office Gateway"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Description
              </label>
              <textarea
                value={ipDescription}
                onChange={(e) => setIpDescription(e.target.value)}
                rows={4}
                maxLength={160}
                className="w-full bg-white border border-[#d5d9e4] rounded-md p-3 text-sm text-slate-700"
                placeholder="Add short description..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIpActive((v) => !v)}
                  className="flex items-center gap-2 cursor-pointer"
                  aria-label={ipActive ? "Set inactive" : "Set active"}
                >
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      ipActive ? "bg-[#22c55e]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ipActive ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </span>
                  <span className={ipActive ? "text-[#22c55e]" : "text-slate-500"}>
                    {ipActive ? "Active" : "Inactive"}
                  </span>
                </button>
              </div>
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ipBlacklisted}
                  onChange={(e) => setIpBlacklisted(e.target.checked)}
                  className="h-4 w-4"
                />
                Blacklisted
              </label>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#d5d9e4] flex justify-start gap-3">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 cursor-pointer border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmitIps}
              className="px-4 py-2 bg-[#3c79ff] hover:bg-[#356ee6] rounded-md  cursor-pointer !text-white"
            >
              {editingId ? "Update" : "+ Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
