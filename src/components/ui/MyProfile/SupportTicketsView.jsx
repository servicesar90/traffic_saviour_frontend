import React, { useState, useEffect } from "react";

export function SupportTicketsView() {
  // Dummy data – replace later with API response
  const [tickets, setTickets] = useState([
    {
      id: "TCK-5231",
      subject: "Payment not reflecting",
      status: "Open",
      priority: "High",
      createdAt: "Nov 18, 2025",
    },
    {
      id: "TCK-5122",
      subject: "Issue with subscription invoice",
      status: "In Progress",
      priority: "Medium",
      createdAt: "Nov 16, 2025",
    },
    {
      id: "TCK-5018",
      subject: "Unable to update profile",
      status: "Closed",
      priority: "Low",
      createdAt: "Nov 12, 2025",
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        {/* <div>
          <h1 className="text-3xl font-semibold">Support Tickets</h1>
          <p className="text-slate-400">Dashboard &gt; Support</p>
        </div> */}

        <button className="bg-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition cursor-pointer">
          + Create Ticket
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 w-full border border-slate-700 rounded-lg px-4 py-2 focus:outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700 text-left">
              <th className="p-4">Ticket ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-slate-400"
                >
                  No tickets found
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-slate-700 hover:bg-slate-750"
                >
                  <td className="p-4">{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>
                    <span
                      className={
                        `px-3 py-1 rounded-full text-sm ` +
                        (ticket.status === "Open"
                          ? "bg-red-500/30 text-red-400"
                          : ticket.status === "In Progress"
                          ? "bg-yellow-500/30 text-yellow-400"
                          : "bg-green-500/30 text-green-400")
                      }
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        `px-3 py-1 rounded-full text-sm ` +
                        (ticket.priority === "High"
                          ? "bg-red-600/30 text-red-400"
                          : ticket.priority === "Medium"
                          ? "bg-yellow-600/30 text-yellow-400"
                          : "bg-blue-600/30 text-blue-400")
                      }
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td>{ticket.createdAt}</td>

                  <td>
                    <button className="text-orange-500 hover:text-orange-400 font-medium cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER – Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
          <p className="text-slate-400">Total Tickets</p>
          <h2 className="text-2xl font-bold">{tickets.length}</h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
          <p className="text-slate-400">Open</p>
          <h2 className="text-2xl font-bold">
            {tickets.filter((t) => t.status === "Open").length}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
          <p className="text-slate-400">Closed</p>
          <h2 className="text-2xl font-bold">
            {tickets.filter((t) => t.status === "Closed").length}
          </h2>
        </div>
      </div>
    </div>
  );
}
