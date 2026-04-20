import React, { useState } from "react";

const SUPPORT_EMAIL = "support@trafficsaviour.com";

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
      await fetch(`https://formsubmit.co/64a5507a55b4c06ba816a83c245eb1c4`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "New Support Ticket",
          _template: "table",
          _captcha: "false",
        }),
      });

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
    <div className="w-full">
      {success && (
        <div className="mb-4 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[13px] font-semibold text-[#15803d]">
          Request submitted successfully. Our support team will get back to you shortly.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6 space-y-5 w-full"
      >
        <h2 className="text-[22px] font-extrabold text-[#141824]">Raise a Support Request</h2>
        <p className="text-[13px] text-[#64748b]">
          Response updates will be managed by <span className="font-semibold text-[#1e293b]">{SUPPORT_EMAIL}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Contact Name" name="name" value={form.name} onChange={handleChange} required />
          <InputField label="Contact Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <InputField label="Issue Subject" name="subject" value={form.subject} onChange={handleChange} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Issue Category" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Choose a category</option>
            <option>Billing</option>
            <option>Subscription</option>
            <option>Technical Issue</option>
            <option>Account</option>
            <option>Other</option>
          </SelectField>

          <SelectField label="Urgency Level" name="priority" value={form.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </SelectField>
        </div>

        <div>
          <label className="flex items-center text-[11px] font-extrabold uppercase tracking-wide text-[#52607a] mb-2">Issue Details</label>
          <textarea
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full bg-white border text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors resize-none border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
          />
        </div>

        <button
          disabled={loading}
          className="px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

const InputField = ({ label, type = "text", name, value, onChange, required = false }) => (
  <div>
    <label className="flex items-center text-[11px] font-extrabold uppercase tracking-wide text-[#52607a] mb-2">{label}</label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full bg-white border text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, required = false, children }) => (
  <div>
    <label className="flex items-center text-[11px] font-extrabold uppercase tracking-wide text-[#52607a] mb-2">{label}</label>
    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full bg-white border rounded-md py-2.5 px-4 text-[#141824] text-sm focus:outline-none transition-colors border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
    >
      {children}
    </select>
  </div>
);
