import { useState } from "react";
import { ShippingForm } from "../checkOutFlow/ShippingForm";
import  {BillingForm } from  "../checkOutFlow/BillingForm";
import { PaymentForm } from "../checkOutFlow/PaymentForm";

const steps = [
  { id: 1, label: "Billing" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment Info" }
];

export default function CheckoutFlow() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6">

      {/* Top Step Indicator */}
      <div className="flex gap-6 mb-10">
        {steps.map(s => (
          <div
            key={s.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border
              ${step === s.id ? "bg-orange-600 text-white border-orange-600" : "bg-white border-slate-300 text-slate-500"}
            `}
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full border">
              {s.id}
            </span>

            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Page View */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        {step === 1 && <BillingForm onNext={() => setStep(2)} />}
        {step === 2 && <ShippingForm onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <PaymentForm onBack={() => setStep(2)} />}

      </div>
    </div>
  );
}
