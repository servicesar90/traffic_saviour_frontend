import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cryptoPayment, getSubscription, getUpdatedPlan } from "../../api/Apis";
import { apiFunction } from "../../api/ApiFunction";

function PayPalSubscription(cart) {
  console.log("cart data", cart);

  const navigate = useNavigate();
  const initialOptions = {
    "client-id": "AZWazeIjFlmn-Z7WPWIUJi1pmuScHU2PbjymElppK4PvVCTYaZAY8NAfGGpoXB2EIws4RwRETRLTPO2u",
    vault: true,
    intent: "subscription",
  };

  const [message, setMessage] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaypalButtons, setShowPaypalButtons] = useState(true);

  return (
    <div className="paypal-integration mt-6">
      {showPaypalButtons &&
      
      <PayPalScriptProvider options={initialOptions}>

        {/* button for subcription */}
        <PayPalButtons

          style={{
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              // plan_id: "P-0DD08373AM9704330NGLNZ2A"
              plan_id: cart?.cart?.price_id,
            });
          }}
          onApprove={async (data) => {
            await apiFunction("post", cryptoPayment, null, {
              ...cart?.cart,
              payment_id: data.subscriptionID,
              status: "Paid",
            });
            const res = await apiFunction("get", getUpdatedPlan, null, null);
            if (res?.data?.success && res?.data?.plan) {
              const subscriptionData = res.data?.data;
              localStorage.setItem("plan", JSON.stringify(subscriptionData));
            }

            setPaymentInfo({
              paymentId: data.subscriptionID,
              amount: cart?.cart?.amount,
              currency: "USD",
            });
            setOpenSuccessModal(true);
            setShowPaypalButtons(false);

          }}
          onCancel={(data) => {
            setCancelReason("You cancelled the payment process.");
            setOpenCancelModal(true);
            setShowPaypalButtons(false);
          }}
          onError={(err) => {
            setCancelReason("An error occurred during the payment process. Please try again.");
            setOpenCancelModal(true);
            setShowPaypalButtons(false);
          }}
        />
      </PayPalScriptProvider>
      }

      {openSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[650px] shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h2 className="text-xl text-white font-semibold">
                Payment Successful 🎉
              </h2>

              <button
                onClick={() => setOpenSuccessModal(false)}
                className="text-gray-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="text-center space-y-3">
              <div className="text-green-400 text-4xl">✅</div>

              <p className="text-gray-300">
                Thank you! Your payment has been completed successfully.
              </p>

              <div className="bg-black border border-slate-700 rounded-lg p-4 text-sm text-gray-300">
                <p>
                  <span className="text-gray-400">Payment ID:</span>{" "}
                  <span className="text-green-400">
                    {paymentInfo?.paymentId}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Amount:</span>{" "}
                  <span className="text-green-400">
                    {paymentInfo?.amount} {paymentInfo?.currency}
                  </span>
                </p>
              </div>

              <p className="text-gray-400 text-sm mt-2">
                Redirecting to dashboard...
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate("/dashboard/allStats")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {openCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[650px] shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h2 className="text-xl text-red-500 font-semibold">
                Payment Cancelled ❌
              </h2>

              <button
                onClick={() => setOpenCancelModal(false)}
                className="text-gray-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="text-center space-y-3">
              <div className="text-red-500 text-4xl">⚠️</div>

              <p className="text-gray-300">{cancelReason}</p>

              <div className="bg-black border border-slate-700 rounded-lg p-4 text-sm text-gray-300">
                <p className="text-gray-400">
                  If money was deducted, it will be automatically refunded
                  within 5–7 working days.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenCancelModal(false)}
                className="border border-gray-500 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setOpenCancelModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayPalSubscription;
