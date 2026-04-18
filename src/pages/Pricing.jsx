import React, { useEffect, useState } from "react";
import { apiFunction, createApiFunction } from "../api/ApiFunction";
import { cryptoPayment, getPlans } from "../api/Apis";
import PayPalIntegration from "./paypalIntegration";
import PayPalSubscription from "../components/paypalComponents/PayPalSubscription";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "../components/Stripe/Checkout";
import { stripePromise } from "../utils/stripe";
import Subscribe from "./Stripe/StripeSubscription";


/* ===================== PAYMENT DETAILS ===================== */

const PAYMENT_DETAILS = {
  ERC20: {
    address: "0x8A8e46327fdA6ca4505bCBE5d7839a591ee82A32",
    qr: "/ERC.jpeg",
  },
  TRC20: {
    address: "TN26mZ3G2RyFbbUT2T7CMn42tBBX8hLo9W",
    qr: "/TRC.jpeg",
  },
};

/* ===================== COMPONENT ===================== */

export default function Pricing() {
  const [billing, setBilling] = useState("Monthly");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // MODAL STATE
  const [modalStep, setModalStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();

  /* ===================== FETCH PLANS ===================== */

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await createApiFunction("get", getPlans, null, null);

        if (res?.data?.success && Array.isArray(res.data.Plans)) {
          setPlans(res.data.Plans);
        }
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);


  // ====================== STRIPE PAYMENT =====================
   /* ===================== PAYMENT HANDLERS ===================== */
const handleSubscribe = async (priceId) => {
  if (!priceId) return alert("Price ID is required for subscription");
  try {
    const response = await fetch("https://api.clickstopper.com/api/v2/payment/stripe/checkout-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ planId: selectedPlan?.id, priceId: priceId }),
    });
    const data = await response.json();
    console.log("Subscription Response:", data); 
    window.location.href = data.url; // Redirect to Stripe Checkout   
  } catch (error) {
    console.log("Error",error);  
    
  }
}

  // ====================== STRIPE PAYMENT =====================
   /* ===================== PAYMENT HANDLERS ===================== */
const dodoPaymentCheckout = async (priceId) => {
  if (!priceId) return alert("Price ID is required for subscription");
  try {
    const response = await fetch("http://localhost:2000/api/v2/dodo/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ planId: selectedPlan?.id, priceId: priceId }),
    });
    const data = await response.json();
    console.log("Subscription Response:", data); 
    window.location.href = data.checkout_url; // Redirect to Stripe Checkout   
  } catch (error) {
    console.log("Error",error);  
    
  }
}


  /* ===================== HELPERS ===================== */

  const resetPaymentState = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
    setPayload(null);
    // navigate("/Dashboard/billing");
  };

  const resetPaymentState1 = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
    setPayload(null);
    navigate("/Dashboard/billing");
  };

  const calculateStartEndDates = (billing) => {
    const start = new Date();
    const end = new Date(start);

    if (billing === "Monthly") end.setMonth(end.getMonth() + 1);
    if (billing === "quarterly") end.setMonth(end.getMonth() + 3);
    if (billing === "Yearly") end.setFullYear(end.getFullYear() + 1);

    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  };

  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const filteredPlans = plans.filter((plan) => {
    if (billing === "Monthly") return plan.durationInMonths === 1;
    if (billing === "quarterly") return plan.durationInMonths === 3;
    if (billing === "Yearly") return plan.durationInMonths === 12;
    return false;
  });

  const isCurrentPlan = (plan) => {
    const flag = plan?.isCurrentPlan ?? plan?.isCurrent ?? plan?.current ?? plan?.isActivePlan ?? false;
    const status = String(plan?.status || "").toLowerCase();
    return Boolean(flag) || status === "active" || status === "current";
  };

  const totalAmount = selectedPlan ? selectedPlan.price : 0;
  const modalProgress = modalStep === 4 ? 100 : modalStep === 3 ? 75 : modalStep === 2 ? 50 : 25;
  const modalStepLabel =
    modalStep === 1
      ? "Review Order"
      : modalStep === 2
      ? paymentMethod === "USDT"
        ? "Choose Network"
        : paymentMethod === "card"
        ? "Card Checkout"
        : "Dodo Checkout"
      : modalStep === 3
      ? "Confirm Transfer"
      : "Payment Submitted";

  const makeCryptoPayment = async (payload) => {
    return await apiFunction("post", cryptoPayment, null, payload);
  };

  /* ===================== LOADER ===================== */

  if (loadingPlans) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 px-2 md:px-4 pt-2 pb-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="h-9 w-72 mx-auto rounded bg-slate-200 animate-pulse" />
            <div className="h-5 w-96 max-w-full mx-auto mt-3 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-[#d5d9e4] bg-white p-8">
                <div className="h-6 w-36 rounded bg-slate-200 animate-pulse" />
                <div className="h-10 w-28 rounded bg-slate-200 animate-pulse mt-4" />
                <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mt-3" />
                <div className="space-y-2 mt-6">
                  <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-11/12 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-10/12 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="h-10 w-full rounded bg-slate-200 animate-pulse mt-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 px-2 md:px-4 pt-2 pb-5">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-[30px] font-extrabold text-slate-900 mb-1">
            Choose Your Growth Plan
          </h1>
          <p className="text-[16px] leading-[21px] text-[#525b75]">
            Flexible pricing built for teams scaling campaigns with confidence.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-[12px] text-[#64748b] bg-white border border-[#d5d9e4] rounded-full px-4 py-1.5">
            <span>No hidden fees</span>
            <span className="text-[#94a3b8]">•</span>
            <span>Cancel anytime</span>
            <span className="text-[#94a3b8]">•</span>
            <span>Secure checkout</span>
          </div>
          <p className="text-[12px] text-[#64748b] mt-2">
            Billing starts immediately after successful payment confirmation.
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-14">
          <div className="bg-white border border-[#d5d9e4] p-1 rounded-xl flex gap-1 shadow-sm">
            {["Monthly", "quarterly", "Yearly"].map((type) => {
              const discount =
                type === "quarterly"
                  ? "10% OFF"
                  : type === "Yearly"
                    ? "20% OFF"
                    : null;

              return (
                <button
                  key={type}
                  onClick={() => setBilling(type)}
                  className={`relative px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    billing === type
                      ? "bg-[#3c79ff] text-white shadow-[0_2px_10px_rgba(60,121,255,0.32)]"
                      : "text-[#475569] hover:bg-[#f8fafc]"
                  }`}
                >
                  {type}

                  {/* DISCOUNT BADGE */}
                  {discount && (
                    <span className="absolute -top-2 -right-2 bg-[#22c55e] text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
                      {discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLANS */}
        {filteredPlans.length === 0 ? (
          <div className="rounded-xl border border-[#d5d9e4] bg-white p-8 text-center">
            <h3 className="text-[18px] font-semibold text-[#1e293b]">No Plans Available</h3>
            <p className="mt-2 text-[14px] text-[#64748b]">
              No plans are currently available for <span className="font-semibold">{billing}</span> billing.
            </p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Try switching to Monthly, quarterly, or Yearly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white border rounded-xl p-8 shadow-sm ${
                plan.name.includes("Pro")
                  ? "border-[#3c79ff] ring-1 ring-[#3c79ff]"
                  : "border-[#d5d9e4]"
              }`}
            >
              {isCurrentPlan(plan) && (
                <span className="absolute -top-3 right-4 bg-[#0ea5a6] !text-white text-[11px] px-3 py-1 rounded-full font-semibold">
                  Current Plan
                </span>
              )}
              {plan.name.includes("Pro") && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3c79ff] to-[#2f69e8] !text-white text-xs px-4 py-1 rounded-full"
                  style={{ color: "#ffffff" }}
                >
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-[#0f172a]">{plan.name}</h3>
              <p className="mt-1 text-[12px] text-[#64748b]">
                {plan.name.includes("Starter")
                  ? "Best for launching your first campaigns"
                  : plan.name.includes("Pro")
                    ? "Best for performance-focused growth teams"
                    : "Best for scaling operations at volume"}
              </p>

              <div className="mt-4">
                <span className="text-4xl font-bold text-[#0f172a]">${plan.price}</span>
                <span className="text-[#64748b] ml-2">/ {billing}</span>
              </div>
              <p className="text-[12px] text-[#64748b] mt-1">
                ~ $
                {billing === "Yearly"
                  ? (plan.price / 12).toFixed(2)
                  : billing === "quarterly"
                    ? (plan.price / 3).toFixed(2)
                    : plan.price.toFixed(2)}{" "}
                / month effective
              </p>

              <p className="mt-3 text-[#64748b] text-sm">
                {plan.maxCampaigns === -1 ? "Unlimited Campaigns" : `${plan.maxCampaigns} Campaigns`} •{" "}
                {plan.clicksPerCampaign === -1
                  ? "Unlimited Clicks"
                  : `${plan.clicksPerCampaign} Clicks/day`}
              </p>

              <div className="mt-6 text-sm text-[#334155]">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#64748b] mb-2 text-left">
                  Included Features
                </p>
                <ul className="space-y-1.5">
                  {parseFeatures(plan.features).map((f, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#ecfdf3] text-[#16a34a] text-[11px] font-bold mt-[1px]">
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setModalStep(1);
                }}
                disabled={isCurrentPlan(plan)}
                className={`mt-8 w-full py-3 rounded-lg !text-white font-semibold cursor-pointer ${
                  isCurrentPlan(plan)
                    ? "bg-[#94a3b8] cursor-not-allowed"
                    : plan.name.includes("Pro")
                    ? "bg-[#3c79ff] hover:bg-[#2f69e8]"
                    : "bg-[#334155] hover:bg-[#1e293b]"
                }`}
                style={{ color: "#ffffff" }}
              >
                {isCurrentPlan(plan)
                  ? "Current Plan"
                  : plan.name.includes("Starter")
                  ? "Start Starter"
                  : plan.name.includes("Pro")
                    ? "Go Pro"
                    : "Scale with Enterprise"}
              </button>
            </div>
            ))}
          </div>
        )}

      </div>

      {/* ===================== MODAL ===================== */}
      {modalStep > 0 && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl p-6 border relative bg-white border-[#d5d9e4] text-[#1e293b]">
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748b] mb-1.5">
                <span>{modalStepLabel}</span>
                <span>Step {Math.min(modalStep, 4)} of 4</span>
              </div>
              <div className="h-2 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                <div className="h-full bg-[#3c79ff] transition-all duration-300" style={{ width: `${modalProgress}%` }} />
              </div>
            </div>

            {selectedPlan && modalStep < 4 && (
              <div className="mb-4 rounded-lg border border-[#d5d9e4] bg-[#f8fbff] px-3 py-2.5 text-left">
                <div className="text-[12px] text-[#64748b]">
                  <span className="font-semibold text-[#334155]">{selectedPlan.name}</span> • {billing}
                </div>
                <div className="text-[13px] font-bold text-[#1e293b] mt-0.5">${totalAmount}</div>
              </div>
            )}
            <button
              onClick={resetPaymentState}
              disabled={loading}
              className="absolute top-3 right-4 cursor-pointer text-[#94a3b8] hover:text-[#334155] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ×
            </button>

            {/* STEP 1 */}
            {modalStep === 1 && (
              <>
                <h2 className="text-xl font-bold text-[#141824]">Confirm Purchase</h2>
                <p className="text-[#475569] mt-2 text-sm">
                  Activate <b>{selectedPlan.name}</b> for <b>${totalAmount}</b>?
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    { key: "USDT", title: "USDT", hint: "Crypto transfer with TX hash verification" },
                    { key: "card", title: "Card", hint: "Pay quickly using card checkout" },
                    { key: "dodo", title: "Dodo", hint: "Continue via Dodo payment gateway" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key)}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-left cursor-pointer transition ${
                        paymentMethod === m.key
                          ? "border-[#3c79ff] bg-[#eef4ff]"
                          : "border-[#d5d9e4] bg-white hover:bg-[#f8fafc]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-[#1e293b]">{m.title}</p>
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            paymentMethod === m.key
                              ? "border-[#3c79ff] bg-[#3c79ff]"
                              : "border-[#cbd5e1]"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-[#64748b] mt-0.5">{m.hint}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    className="px-4 py-2 rounded-md border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                    onClick={resetPaymentState}
                  >
                    Close
                  </button>
                  <button
                    disabled={!paymentMethod}
                    onClick={() => {
                      setModalStep(2);
                      console.log(paymentMethod);

                  

                      if (paymentMethod === "card" || paymentMethod === "dodo") {
                        // handleSubscribe(selectedPlan.stripePriceId);
                        const { start_date, end_date } =
                          calculateStartEndDates(billing);
                        setPayload({
                          plan_id: selectedPlan.id,
                          price_id: selectedPlan.stripePriceId, 
                          plan_name: selectedPlan.name,
                          billing_cycle: billing,

                          method:
                            paymentMethod === "USDT"
                              ? "cryptocurrency"
                              : "card",

                          amount: totalAmount,

                          currency:
                            paymentMethod === "USDT"
                              ? network === "ERC20"
                                ? "USDT (ERC20)"
                                : "USDT (TRC20)"
                              : "USD",

                          start_date,
                          end_date,

                          payment_id: null,
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-md cursor-pointer !text-white ${
                      !paymentMethod ? "bg-[#94a3b8] cursor-not-allowed" : "bg-[#3c79ff] hover:bg-[#356ee6]"
                    }`}
                    style={{ color: "#ffffff" }}
                  >
                    Continue
                  </button>
                  {/* <button
                    disabled={!paymentMethod}
                    onClick={() => {
                      setModalStep(2);
                      console.log(paymentMethod);

                  

                      if (paymentMethod === "card" && selectedPlan.stripePriceId) {
                        handleSubscribe("price_1T0JW1QxKOqwXPnDTxMeHFB6");
                        const { start_date, end_date } =
                          calculateStartEndDates(billing);
                        setPayload({
                          plan_id: selectedPlan.id,
                          plan_name: selectedPlan.name,
                          billing_cycle: billing,

                          method:
                            paymentMethod === "USDT"
                              ? "cryptocurrency"
                              : "card",

                          amount: totalAmount,

                          currency:
                            paymentMethod === "USDT"
                              ? network === "ERC20"
                                ? "USDT (ERC20)"
                                : "USDT (TRC20)"
                              : "USD",

                          start_date,
                          end_date,

                          payment_id: null,
                        });
                      }
                    }}
                    className="bg-blue-600 px-4 py-2 rounded cursor-pointer"
                  >
                    Test
                  </button> */}
                </div>
              </>
            )}

            {/* STEP 2 - USDT */}
            {modalStep === 2 && paymentMethod === "USDT" && (
              <>
                <h2 className="text-xl font-bold text-[#141824]">Select Network</h2>
                <p className="text-[12px] text-[#64748b] mt-1">
                  Send exact amount on selected network only.
                </p>
                {["ERC20", "TRC20"].map((n) => (
                  <label key={n} className="flex gap-3 mt-4 cursor-pointer rounded-md border border-[#d5d9e4] bg-[#f8fafc] px-3 py-2.5">
                    <input
                      type="radio"
                      checked={network === n}
                      onChange={() => setNetwork(n)}
                    />
                    {n}
                  </label>
                ))}

                <div className="flex justify-between mt-6">
                  <button
                    className="px-4 py-2 rounded-md border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                    onClick={() => setModalStep(1)}
                  >
                    Back
                  </button>
                  <button
                    disabled={!network}
                    onClick={() =>{
                      setModalStep(3)}}
                    className={`px-4 py-2 rounded-md cursor-pointer !text-white ${
                      !network ? "bg-[#94a3b8] cursor-not-allowed" : "bg-[#3c79ff] hover:bg-[#356ee6]"
                    }`}
                    style={{ color: "#ffffff" }}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 - CARD */}
            {modalStep === 2 && paymentMethod === "card" && (
              <>
                <div className="bg-white text-left">
                  {/* {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <Checkout />
                    </Elements>
                  )} */}
                  {/* {clientSecret &&
                     (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                       <Checkout />
                        <Subscribe/>
                      </Elements>
                    )
                  } */}


                                {/* <h2 className="text-center text-black">Redirecting to stripe payment gateway...</h2> */}


                  {/* <PayPalIntegration cart={payload} /> */}
                  <PayPalSubscription cart={payload} />
                  <button
                    className="mt-6 cursor-pointer py-2 px-4 rounded-md border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc]"
                    onClick={() => setModalStep(1)}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* dodpayment */}
             {modalStep === 2 && paymentMethod === "dodo" && (
              <>
                <div className="text-left">
                 <h2 className="text-lg font-semibold text-[#141824]">Continue to Dodo Checkout</h2>
                 <p className="text-[12px] text-[#64748b] mt-1">You will be redirected securely to complete payment.</p>
                 <button
                    className="mt-6 cursor-pointer py-2 px-4 mr-2 rounded-md bg-[#3c79ff] hover:bg-[#356ee6] !text-white"
                    onClick={() => dodoPaymentCheckout("fdsjdghdfu")}
                    style={{ color: "#ffffff" }}
                  >
                    Continue to Pay
                  </button>
                  <button
                    className="mt-6 cursor-pointer py-2 px-4 rounded-md border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc]"
                    onClick={() => setModalStep(1)}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {/* STEP 3 */}
            {modalStep === 3 && (
              <>
                <h2 className="text-xl font-bold text-[#141824]">Confirm Transfer</h2>

                <p className="mt-2 text-sm text-[#64748b]">
                  You selected <b>USDT</b> on <b>{network}</b> network
                </p>

                <img
                  src={PAYMENT_DETAILS[network].qr}
                  alt={`${network} QR`}
                  className="mx-auto mt-4 w-36"
                />

                {/* Amount */}
                <div className="mt-4">
                  <label className="text-sm text-[#64748b]">Amount to Pay</label>
                  <input
                    disabled
                    value={`${totalAmount} USDT`}
                    className="w-full mt-1 p-2.5 bg-[#f8fafc] border border-[#d5d9e4] rounded text-[#1e293b]"
                  />
                </div>

                {/* Address */}
                <div className="mt-4">
                  <label className="text-sm text-[#64748b]">
                    Pay to this address
                  </label>
                  <input
                    disabled
                    value={PAYMENT_DETAILS[network].address}
                    className="w-full mt-1 p-2.5 bg-[#f8fafc] border border-[#d5d9e4] rounded text-[#1e293b]"
                  />
                </div>

                {/* TX HASH */}
                <div className="mt-4">
                  <label className="text-sm text-[#64748b]">
                    Transaction Hash
                  </label>
                  <input
                    placeholder="Enter transaction hash"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-white border border-[#d5d9e4] rounded text-[#1e293b] focus:outline-none focus:border-[#3c79ff]"
                  />
                  <p className="text-[11px] text-[#94a3b8] mt-1">Paste full hash exactly as shown in your wallet explorer.</p>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    className="px-4 py-2 rounded-md border border-[#d5d9e4] bg-white text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                    onClick={() => setModalStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>

                  <button
                    disabled={!txHash.trim() || loading}
                    className={`px-4 py-2 rounded cursor-pointer flex items-center gap-2 ${
                      !txHash.trim() || loading
                        ? "bg-[#94a3b8] cursor-not-allowed !text-white"
                        : "bg-[#3c79ff] hover:bg-[#356ee6] !text-white"
                    }`}
                    style={{ color: "#ffffff" }}
                    onClick={async () => {
                      if (!txHash.trim() || loading) return;

                      setLoading(true);

                      const { start_date, end_date } =
                        calculateStartEndDates(billing);

                      const payloadData = {
                        plan_id: selectedPlan.id,
                        plan_name: selectedPlan.name,
                        billing_cycle: billing,
                        method: "cryptocurrency",
                        amount: totalAmount,
                        currency:
                          network === "ERC20" ? "USDT (ERC20)" : "USDT (TRC20)",
                        start_date,
                        end_date,
                        payment_id: txHash,
                      };

                      try {
                        const res = await makeCryptoPayment(payloadData);
                        if (res?.success || res?.status === 201) {
                          setModalStep(4);
                        }
                      } catch {
                        alert("Payment failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full  "></span>
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 - THANK YOU */}
            {modalStep === 4 && (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#22c55e] flex items-center justify-center text-3xl text-white">
                    ✓
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-4 text-[#141824]">
                  Payment Submitted Successfully
                </h2>

                <p className="mt-3 text-[#64748b] text-sm leading-relaxed">
                  We have successfully received your payment.
                  <br />
                  Your transaction is currently under review.
                </p>

                <div className="mt-4 bg-[#f8fbff] border border-[#d5d9e4] p-4 rounded-lg text-sm text-[#475569] text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3c79ff]" />
                    <span>Submitted</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                    <span>Under Review (up to 24 hours)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    <span>Full Access Activated</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#64748b]">
                  You will be notified once your payment is approved.
                </p>

                <button
                  onClick={resetPaymentState1}
                  className="mt-6 bg-[#3c79ff] hover:bg-[#356ee6] px-6 py-2 rounded-lg cursor-pointer !text-white"
                  style={{ color: "#ffffff" }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}





