import { useState } from "react";

export function ShippingForm({ onNext, onBack }) {
  const [form, setForm] = useState({
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <h2 className="text-xl font-semibold text-slate-800">
        Shipping Information
      </h2>

      {/* Additional Information Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Additional information
        </label>

        <div>
          <label className="text-sm text-slate-600">
            Order notes (optional)
          </label>

          <textarea
            name="notes"
            rows="6"
            placeholder="Notes about your order, e.g. special notes for delivery."
            className="mt-2 w-full text-black border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none resize-none"
            value={form.notes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="bg-slate-300 text-slate-800 px-8 py-3 rounded-lg font-medium hover:bg-slate-400 cursor-pointer"
        >
          ← Back to Billing
        </button>

        <button
          onClick={onNext}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 cursor-pointer"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
