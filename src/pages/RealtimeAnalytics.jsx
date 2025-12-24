import { useState, useEffect } from "react";
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

export default function RealtimeAnalytics({ pageId }) {
  const [refreshing, setRefreshing] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const { id } = useParams();
  console.log(pageId);

  useEffect(() => {
    fetchGraph();
    fetchLogs();
  }, [pageId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGraph();
    fetchLogs();
    setTimeout(() => setRefreshing(false), 1200);
  };

  const fetchGraph = async () => {
    try {
      const res = await fetch(`/api/analytics/${pageId}/views`);
      const result = await res.json();
      setGraphData(result);
    } catch (err) {
      console.error("Graph error", err);
    }
    setLoadingGraph(false);
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/analytics/${pageId}/logs`);
      const result = await res.json();
      setLogs(result);
    } catch (err) {
      console.error("Logs error", err);
    }
    setLoadingLogs(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-10 py-6 space-y-8">
      {/* Warning Banner */}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Realtime Analytics</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-sm">VIEWS IN LAST 5 MINUTES</p>
          <p className="text-3xl font-bold mt-1">0</p>
          <p className="text-slate-300 mt-1 text-sm">Page Views</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700 flex flex-col items-center">
  <p className="text-slate-300 text-sm">Unique visitors</p>

  {/* center number */}
  <p className="text-3xl font-bold mt-2">0</p>

  {/* realtime indicator */}
  <div className="flex items-center gap-2 mt-2">
    <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
    <p className="text-slate-300 text-sm">Real-time</p>
  </div>
</div>


        {/* Card 3 */}
        <div className="bg-[#111829] p-5 rounded-lg border border-slate-700 flex flex-col justify-between ">
  
  {/* device counters row */}
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

  {/* realtime pulse */}
  <div className="flex items-center gap-2">
     <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
    <p className="text-slate-300 text-sm">Real-time</p>
  </div>

</div>

      </div>

      {/* Refresh button */}
      <div className="flex justify-between items-center pt-3">
        <p className="text-slate-400 text-sm">Auto-refreshes every 10s</p>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md hover:bg-green-700"
        >
          <ArrowPathIcon
            className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

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
        <ResponsiveContainer width="100%" height={260}>
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
        <div className="overflow-y-auto max-h-64 border border-gray-700 rounded-lg">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800 border-b border-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Device</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Time (Local)</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="px-4 py-2">{log.ip}</td>
                  <td className="px-4 py-2">{log.device}</td>
                  <td className="px-4 py-2">{log.city}</td>
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
}
