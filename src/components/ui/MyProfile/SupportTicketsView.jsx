import React, { useState } from "react";

export function SupportTicketsView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "Medium",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("https://formsubmit.co/ffedefd76b08c830449f6c87dba9206a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "New Support Ticket",
          _template: "table",
          _captcha: "false",
        }),
      });

      // ✅ SUCCESS
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "Medium",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white w-full">

      {/* HEADER */}
   

      {/* SUCCESS NOTIFICATION */}
      {success && (
        <div className="mb-6 bg-green-600/20 border border-green-500 text-green-400 p-4 rounded-lg">
          ✅ Ticket submitted successfully. Our support team will contact you soon.
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6 w-full"
      >
        {/* NAME */}
        <div>
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 text-sm">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* SUBJECT */}
        <div>
          <label className="block mb-1 text-sm">Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          >
            <option value="">Select category</option>
            <option>Billing</option>
            <option>Subscription</option>
            <option>Technical Issue</option>
            <option>Account</option>
            <option>Other</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div>
          <label className="block mb-1 text-sm">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block mb-1 text-sm">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 resize-none"
          />
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}
