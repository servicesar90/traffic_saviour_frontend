import React, { useEffect, useState } from "react";

const FormGroup = ({ label, required, value = "", onChange, sub, type = "text", placeholder }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white border text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
    />
    {sub && <p className="text-xs text-[#64748b]">{sub}</p>}
  </div>
);

const FormInput = ({ placeholder, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full mt-3 bg-white border text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none transition-colors border-[#d5d9e4] focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff]"
  />
);

export function AccountDetailsForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white border border-[#d5d9e4] rounded-md p-5 md:p-6">
        <form className="space-y-7">
          <FormGroup
            label="Display Name"
            required
            placeholder="Enter display name"
            value={user?.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <FormGroup
            label="Email ID"
            required
            type="email"
            placeholder="Enter your email ID"
            value={user?.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wide text-[#52607a] mb-1">Password Update</label>
            <FormInput placeholder="Current password (leave empty to keep)" type="password" />
            <FormInput placeholder="New password (optional)" type="password" />
            <FormInput placeholder="Confirm new password" type="password" />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
