import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { paypalCreateOrder, paypalCaptureOrder, cryptoPayment } from "../api/Apis";

function PayPalIntegration(cart) {
    console.log(cart);

    const initialOptions = {
        "client-id": "Adenx-z-vmV67v-6MNYwq878nvqIsC9Hx1VNxd2oWSxgW1duvnSVAaPdSBRYkDZMlGIBfnw1GV4uBtZr",
        currency: "USD",
        intent: "capture",
    };

    // const serverUrl = "https://api.webservices.press/";
        const serverUrl = "http://localhost:2000/";



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
                        const token = localStorage.getItem("token");

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
                            const response = await apiFunction("post", paypalCreateOrder, null, { cart: cart?.cart });


                            const orderData = response.data;
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

                            const response = await apiFunction("post", paypalCaptureOrder, data.orderID, null);

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

                                const response = await apiFunction("post", cryptoPayment, null, cart);
                                return response;

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