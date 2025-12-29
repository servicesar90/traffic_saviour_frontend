import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export function PaymentForm() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const price = 4390.01;

  return (
    <>
       
      <div className="relative w-full space-y-6">
        {/* ---------------- TOP LEFT BUTTON ---------------- */}

         <button
        onClick={() => navigate("/Dashboard/allStats")}
        className="absolute top-4 left-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-700 transition cursor-pointer"
      >
        ← Go to Dashboard
      </button>

        {/* MAIN PAYMENT UI */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-16">
          <div className="flex justify-between bg-slate-50 px-6 py-3 font-semibold text-slate-600 text-sm">
            <span>PRODUCT</span>
            <span>SUBTOTAL</span>
          </div>

          <div className="flex justify-between px-6 py-4 text-slate-800 border-b border-slate-100">
            <span>Starter Plan - MS × 1</span>
            <span className="text-purple-700 font-semibold">
              ₹{price.toLocaleString()} / Month
            </span>
          </div>

          <div className="bg-slate-50 px-6 py-6 space-y-6">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Subtotal</span>
              <span className="text-purple-700 font-semibold">
                ₹{price.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-purple-700 font-semibold text-lg">
                ₹{price.toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200"></div>

            <div className="font-semibold text-slate-700">Recurring Totals</div>

            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Subtotal</span>
              <span className="text-purple-700 font-semibold">
                ₹{price.toLocaleString()} / Month
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">
                Recurring Total
              </span>
              <span className="text-purple-700 font-semibold text-lg">
                ₹{price.toLocaleString()} / Month
              </span>
            </div>

            <p className="text-xs text-slate-500 text-right mt-1">
              First Renewal: December 25, 2025
            </p>
          </div>
        </div>

        {/* PAYMENT ACCORDION */}

        {/* ---------------- BOTTOM LEFT BUTTON ---------------- */}
        <button
          onClick={() => navigate(-1)}
          className="absolute bottom-4 left-4 bg-gray-200 text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition cursor-pointer"
        >
          ← Previous
        </button>
      </div>
    </>
  );
}
