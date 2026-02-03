import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  paypalCreateOrder,
  paypalCaptureOrder,
  cryptoPayment,
  getSubscription,
} from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";

function PayPalIntegration(cart) {
  const navigate = useNavigate();

    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };



  const [message, setMessage] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("")

  return (
    <div className="paypal-integration mt-6 bg-white">
      <PayPalScriptProvider options={initialOptions}>
        <div className="max-h-[70vh] overflow-y-auto text-white">
          <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
            
          }}
          createOrder={async () => {
            try {
              // const response = await fetch(`${serverUrl}api/v2/payment/create-order`, {
              //     method: "POST",
              //     headers: {
              //         "Content-Type": "application/json",
              //         "Authorization": `Bearer ${token}`,
              //     },
              //     // use the "body" param to optionally pass additional order information
              //     // like product ids and quantities
              //     body: JSON.stringify({
              //         cart: cart?.cart,
              //     }),
              // });
              const response = await apiFunction(
                "post",
                paypalCreateOrder,
                null,
                { cart: cart?.cart },
              );

              const orderData = response.data;

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const token = localStorage.getItem("token");
              // const response = await fetch(
              //     `${serverUrl}api/v2/payment/capture-order/${data.orderID}`,
              //     {
              //         method: "POST",
              //         headers: {
              //             "Content-Type": "application/json",
              //             "Authorization": `Bearer ${token}`,
              //         },
              //     }
              // );

              const response = await apiFunction(
                "post",
                paypalCaptureOrder,
                data.orderID,
                null,
              );

              const orderData = response.data;
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`,
                );
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                );
                // console.log(
                //   "Capture result",
                //   orderData,
                //   JSON.stringify(orderData, null, 2),
                // );
                // console.log("cart.cart", cart?.cart);

                if (orderData.status === "COMPLETED") {
                  // clearCart();
                  await apiFunction("post", cryptoPayment, null, {
                    ...cart?.cart,
                    payment_id: orderData.id,
                    status: "Paid",
                  });

                  const res = await apiFunction(
                    "get",
                    getSubscription,
                    null,
                    null,
                  );

                  if (res?.data?.success && res?.data?.data) {
                    const subscriptionData = res?.data?.data;

                    localStorage.setItem(
                      "plan",
                      JSON.stringify(subscriptionData),
                    );
                  }

                  setPaymentInfo({
                    paymentId: orderData.id,
                    amount:
                      orderData.purchase_units[0].payments.captures[0].amount
                        .value,
                    currency:
                      orderData.purchase_units[0].payments.captures[0].amount
                        .currency_code,
                  });

                  setOpenSuccessModal(true);

                  // 3 sec baad redirect
                  setTimeout(() => {
                    setOpenSuccessModal(false);
                    navigate("/dashboard/allStats");
                  }, 3000);
                }
                const response = await apiFunction(
                  "post",
                  cryptoPayment,
                  null,
                  { ...cart?.cart, payment_id: orderData.id },
                );
                return response;
              }
            } catch (error) {
              setMessage(
                `Sorry, your transaction could not be processed...${error}`,
              );
            }
          }}
          onCancel={(data) => {
            setCancelReason(
              "You cancelled the payment. No amount has been deducted.",
            );
            setOpenCancelModal(false);
          }}
          onError={(err) => {
            setCancelReason(
              "Payment failed due to a technical issue or card problem. Please try again.",
            );
            setOpenCancelModal(false);
          }}
        />
        </div>
        
      </PayPalScriptProvider>

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

export default PayPalIntegration;
