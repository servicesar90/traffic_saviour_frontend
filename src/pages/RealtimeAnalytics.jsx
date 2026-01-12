import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { apiFunction } from "../api/ApiFunction";
import { getAllAnalyticsCamp } from "../api/Apis";
import { getBrowserIcon } from "../utils/getBrowserIcon";
import { getCountryIcon } from "../utils/getCountryIcon";
import { getDeviceIcon } from "../utils/getDeviceIcon";
import { getOSIcon } from "../utils/getOsIcon";
import socket from "../utils/socket";

export default function RealtimeAnalytics({}) {
  const [refreshing, setRefreshing] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [view, setView] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const { id } = useParams();
  const [highlight, setHighlight] = useState(false);
  const [uniqueVisitors, setUniqueVistors]= useState(0)


  const fetchAnalytics = useCallback(async (id) => {
    try {
      const response = await apiFunction("get", getAllAnalyticsCamp, id, null);
      const analyticsData = response.data.data;
      console.log(analyticsData);
      setUniqueVistors(analyticsData?.[2]?.uniquecount);
     
      
 
      const analytics = analyticsData?.[0];
     

      // update view with highlight
      setView(analytics?.clickCount ?? 0);
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);

      // format logs with unique key for re-render animation
     const formattedLogs = (analytics?.weblogs ?? []).map((log, index) => ({
  ...log,
  uniqueKey: log.created_at
    ? `${log.created_at}-${index}`
    : `${Date.now()}-${index}`,
  isNew: false,
}));


      console.log("logs", formattedLogs);

      setLogs(
        formattedLogs.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      );

      setLoadingLogs(false);
    } catch (error) {
      console.log("Something went wrong", error);
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchAnalytics(id);
    }
  }, [id, fetchAnalytics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics(id).then(() => {
      setTimeout(() => setRefreshing(false), 1200);
    });
  };
  // for socket io real-time updates, later
   const user = JSON.parse(localStorage.getItem("user"));
  
 useEffect(() => {
  if (!user?.id) return;

  socket.emit("join", `${user.id}`);

  socket.on("new_click", (data) => {
  const newLog = {
    ...data,
    created_at: new Date().toISOString(),
    uniqueKey: `${Date.now()}-${Math.random()}`,
    isNew: true,
  };
  console.log("fuf",data);
  

  setLogs(prev => {
    const updated = [newLog, ...prev]
      .slice(0, 5)
      .map(log => ({ ...log, isNew: false }));

    updated[0].isNew = true; // sirf top card animate
    return updated;
  });
});


  return () => socket.off("new_click");
}, [user?.id]);


  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-10 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Realtime Analytics</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-sm">VIEWS IN LAST 5 MINUTES</p>
          <p
            className={`text-3xl font-bold mt-1 transition-all ${
              highlight ? "text-green-400 scale-110" : ""
            }`}
          >
            {view}
          </p>
          <p className="text-slate-300 mt-1 text-sm">Page Views</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700 flex flex-col items-center">
          <p className="text-slate-300 text-sm">Unique visitors</p>
          <p  className={`text-3xl font-bold mt-1 transition-all ${
              highlight ? "text-green-400 scale-110" : ""
            }`}>{uniqueVisitors  || 0}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-300 text-sm">Real-time</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700 flex flex-col justify-between">
          <div className="flex justify-between w-full gap-4 mb-3">
            <div className="text-center flex-1">
              <p className="text-slate-300 text-sm">Mobile</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-slate-300 text-sm">Tablet</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-slate-300 text-sm">Desktop</p>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-300 text-sm">Real-time</p>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer transition-transform duration-200 active:scale-95"
      >
        <ArrowPathIcon
          className={`h-5 w-5 transition-transform duration-500 ${
            refreshing ? "animate-spin" : ""
          }`}
        />
        Refresh
      </button>

      {/* Graph + Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line graph */}
        <div className="bg-gray-850/40 border border-gray-700 rounded-xl p-6 flex flex-col">
          <h3 className="text-white text-lg font-semibold mb-2">Page Views</h3>
          <p className="text-sm text-slate-400 mb-3">Daily Traffic Trends</p>

          <div className="flex-1 flex items-center justify-center">
            {loadingGraph ? (
              <div className="flex flex-col items-center text-slate-400 gap-2">
                <span className="h-4 w-4 rounded-full bg-slate-500 animate-ping"></span>
                <p className="text-sm">Loading graph...</p>
              </div>
            ) : !graphData.length ? (
              <div className="flex flex-col items-center text-center text-slate-400 gap-2 py-10">
                <div className="text-4xl">📈</div>
                <p className="font-medium">No view data available</p>
                <p className="text-xs opacity-70">
                  Data will appear when visitors access your page.
                </p>
              </div>
            ) : (
              <ResponsiveContainer key={Date.now()} width="100%" height={260}>
                <LineChart data={graphData}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-850/40 border border-gray-700 rounded-xl p-6 flex flex-col">
          <h3 className="text-white text-lg font-semibold mb-4">
            Click Activity Log
          </h3>

          <div className="flex-1">
            {loadingLogs ? (
              <div className="flex flex-col items-center text-slate-400 gap-2 mt-8">
                <span className="h-4 w-4 rounded-full bg-slate-500 animate-ping"></span>
                <p className="text-sm">Loading logs...</p>
              </div>
            ) : !logs.length ? (
              <div className="flex flex-col items-center text-center text-slate-400 gap-2 py-10">
                <div className="text-4xl">📝</div>
                <p className="font-medium">No clicks recorded yet.</p>
                <p className="text-xs opacity-70">
                  Click data will appear here in realtime.
                </p>
              </div>
            ) : (
              <div className="rounded-lg">
                <div className="flex flex-col gap-3">
                  {logs.slice(0,5).map((log) => (
  <div
    key={log.uniqueKey}
    className={`
      bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3
      flex items-center justify-between
      ${log.isNew ? "opacity-0 animate-rowIn" : "opacity-100"}
    `}
                      // style={{ animationDelay: `${i * 0.4}s` }}
                    >
                      {/* LEFT : DATE */}
                      <div className="text-slate-400 text-xs w-24">
                        <p>
                          {new Date(log.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="opacity-70">
                          {new Date(log.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* CENTER : IP */}
                      <div className="flex-1 text-center text-sm text-white font-mono">
                        {log.ip}
                      </div>

                      {/* RIGHT : ICONS with hover tooltip */}
                      <div className="flex items-center gap-5">
                        <div className="relative group">
                          <img
                            src={getBrowserIcon(log.browser)}
                            alt={log.browser}
                            className="w-6 h-6"
                          />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2
                                           bg-gray-800 text-white text-xs px-2 py-1 rounded-md
                                           opacity-0 group-hover:opacity-100
                                           pointer-events-none whitespace-nowrap z-50">
                            {log.browser}
                          </span>
                        </div>

                        <div className="relative group w-6 h-6 text-gray-200">
                          {getDeviceIcon(log.device)}
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2
                                           bg-gray-800 text-white text-xs px-2 py-1 rounded-md
                                           opacity-0 group-hover:opacity-100
                                           pointer-events-none whitespace-nowrap z-50">
                            {log.device}
                          </span>
                        </div>

                        <div className="relative group">
                          <img
                            src={getCountryIcon(log.country)}
                            className="w-6 h-5 object-cover"
                            alt={log.country}
                          />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2
                                           bg-gray-800 text-white text-xs px-2 py-1 rounded-md
                                           opacity-0 group-hover:opacity-100
                                           pointer-events-none whitespace-nowrap z-50">
                            {log.country}
                          </span>
                        </div>

                        <div className="relative group">
                          <img src={getOSIcon(log.os)} alt={log.os} className="w-6 h-6" />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2
                                           bg-gray-800 text-white text-xs px-2 py-1 rounded-md
                                           opacity-0 group-hover:opacity-100
                                           pointer-events-none whitespace-nowrap z-50">
                            {log.os}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
