import { PayPalScriptProvider,PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

function PayPalIntegration() {
    const initialOptions = {
        "client-id": "Adenx-z-vmV67v-6MNYwq878nvqIsC9Hx1VNxd2oWSxgW1duvnSVAaPdSBRYkDZMlGIBfnw1GV4uBtZr",
        currency: "USD",
        intent: "capture",
    };

    const [message, setMessage] = useState("");

    return (
        <div className="paypal-integration mt-6">
           
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                   style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                   createOrder={async () => {
                    console.log(localStorage.getItem("token"));
                    
                        try {
                            const response = await fetch("http://localhost:2000/api/v2/payment/create-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJpZCI6MTAwMDAxLCJlbWFpbCI6ImNvZGVAZ21haWwuY29tIn0sImlhdCI6MTc2ODAzMTM0MywiZXhwIjoxNzY4MjA0MTQzfQ.hvI8FMt_qPg0TTReaqpiQtjA_VUwb9hR6-qypqL-4hE`,
                                },
                                // use the "body" param to optionally pass additional order information
                                // like product ids and quantities
                                body: JSON.stringify({
                                    cart: [
                                        {
                                            id: 1245,
                                            quantity: 1,
                                        },
                                    ],
                                }),
                            });


                            const orderData = await response.json();
                            console.log("orderData", orderData);
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
                            console.error(error);
                            setMessage(
                                `Could not initiate PayPal Checkout...${error}`
                            );
                        }
                    }}
                   onApprove={async (data, actions) => {
                        try {
                            const response = await fetch(
                                `/api/orders/${data.orderID}/capture`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            const orderData = await response.json();
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
                                    `${errorDetail.description} (${orderData.debug_id})`
                                );
                            } else {
                                // (3) Successful transaction -> Show confirmation or thank you message
                                // Or go to another URL:  actions.redirect('thank_you.html');
                                const transaction =
                                    orderData.purchase_units[0].payments
                                        .captures[0];
                                setMessage(
                                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                                );
                                console.log(
                                    "Capture result",
                                    orderData,
                                    JSON.stringify(orderData, null, 2)
                                );
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage(
                                `Sorry, your transaction could not be processed...${error}`
                            );
                        }
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}

export default PayPalIntegration;