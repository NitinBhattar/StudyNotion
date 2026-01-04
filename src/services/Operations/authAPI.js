// Import
import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice.js";
import { setUser } from "../../slices/profileSlice.js";
import { resetCart } from "../../slices/cartSlice.js";
import apiConnector from "../apiConnector";
import { authEndpoints } from "../apis.js";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API
} = authEndpoints;

const sendotp = (email, navigate) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true
            });

            // API fail
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully");
            navigate("/verify-email");
        }
        catch(error) {
            console.error("SendOTP API error: ", error);
            const message = error?.response?.data?.message || "Failed to send OTP";
            toast.error(message);
        }

        // Loading screen off
        dispatch(setLoading(false))
        toast.dismiss(toastId);
    }
};

const signup = (
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp
            });
        
            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Signup Successful");
            navigate("/login");
        } 
        catch(error) {
            console.error("Signup API error: ", error);
            const message = error?.response?.data?.message || "Failed to sign-in";
            toast.error(message);
        }

        // Loading screen off
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
};

const login = (email, password, navigate) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            });

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Login successful!");
            dispatch(setToken(response.data.user.token));

            // If user has set an image, display that, otherwise we use default from DiceBear
            const userImage = response.data?.user?.imageUrl
                            ? response.data.user.imageUrl
                            : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

            dispatch(setUser({ ...response.data.user, image: userImage }));

            // Save in local storage and re-route
            localStorage.setItem("token", JSON.stringify(response.data.user.token));
            navigate("/dashboard/my-profile");
        } 
        catch(error) {
            console.error("Login API error: ", error);
            const message = error?.response?.data?.message || "Failed to log-in";
            toast.error(message);
        }

        // Loading screen off
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
};

const getPasswordResetToken = (email, setEmailSent) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Reset email sent");
            setEmailSent(true);
        }
        catch(error) {
            console.error("Reset-Password-Token API error: ", error);
            const message = error?.response?.data?.message || "Failed to reset password";
            toast.error(message);
        }

        // Loading screen off
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
};

const resetPassword = (password, confirmPassword, token, navigate) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token
            });

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Password reset successfully");
            navigate("/login");
        } 
        catch(error) {
            console.error("Reset-Password API error: ", error);
            const message = error?.response?.data?.message || "Failed to reset password";
            toast.error(message);
        }

        // Loading screen off
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
};

const logout = (navigate) => {
    return (dispatch) => {
        // Clear Everything
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());

        // Remove from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Re-route
        toast.success("Logged Out");
        navigate("/");
    }
};

// Export
export {sendotp, signup, login, getPasswordResetToken, resetPassword, logout};
