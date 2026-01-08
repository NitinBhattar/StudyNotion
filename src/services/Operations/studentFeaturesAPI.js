// Import
import { toast } from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice.js";
import { setPaymentLoading } from "../../slices/courseSlice.js";
import apiConnector from "../apiConnector.js";
import { studentEndpoints } from "../apis.js";

// Assets
import rzpLogo from "../../assets/Logo/rzp_logo.png";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Load the Razorpay SDK from the CDN
const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    });
};

// Returns paymentResponse 
const buyCourse = async (
    token,
    courses,
    user_details,
    navigate,
    dispatch
) => {
    // Loading screen on
    const toastId = toast.loading("Loading...")
    try {
        // Loading the script of Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        // Razorpay connection failure
        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your Internet Connection.")
            return;
        }

        // Initiating the Order in Backend
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                                                {
                                                    courses
                                                },
                                                {
                                                    Authorization: `Bearer ${token}`,
                                                }
                                                );

        // API Fail
        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // Opening the Razorpay SDK
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderResponse.data.paymentResponse.currency,
            amount: `${orderResponse.data.paymentResponse.amount}`,
            order_id: orderResponse.data.paymentResponse.id,
            name: "StudyNotion",
            description: "Thank you for Purchasing the Course.",
            image: rzpLogo,
            prefill: {
                name: `${user_details.firstName} ${user_details.lastName}`,
                email: user_details.email
            },
            handler: (response) => {
                sendPaymentSuccessEmail(response, orderResponse.data.paymentResponse.amount, token);
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);

        paymentObject.open();
        
        paymentObject.on("payment.failed", (response) => {
            toast.error("Oops! Payment Failed.");
            console.error(response.error);
        });
    }
    catch(error) {
        console.error("Buy Courses API error: ", error);
        const message = error?.response?.data?.message || "Failed to buy courses";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
};

const verifyPayment = async (bodyData, token, navigate, dispatch) => {
    // Loading screen on
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment Successful. You are Added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(error) {
        console.error("Verify payment API error: ", error);
        const message = error?.response?.data?.message || "Failed to verify payment";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
};

const sendPaymentSuccessEmail = async (response, amount, token) => {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,
                            {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                amount
                            },
                            {
                                Authorization: `Bearer ${token}`
                            }
                            );
        
        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
    }
    catch(error) {
        console.error("Payment success mail API error: ", error);
    }
};

// Export
export {buyCourse, verifyPayment, sendPaymentSuccessEmail};
