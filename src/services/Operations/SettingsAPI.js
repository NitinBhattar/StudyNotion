// Import
import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice.js";
import apiConnector from "../apiConnector.js";
import { settingsEndpoints } from "../apis.js";
import { logout } from "./authAPI.js";

const {
    CHANGE_PASSWORD_API,
    UPDATE_PROFILE_API,
    DELETE_PROFILE_API
} = settingsEndpoints;

const updateDisplayPicture = (token, formData) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");

        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            );

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Update user in slices
            dispatch(setUser(response.data.user));
            toast.success("Display Picture updated successfully");
        } 
        catch (error) {
            console.error("Update Profile API error for Display Picture: ", error)
            const message = error?.response?.data?.message || "Failed to update Display Picture";
            toast.error(message);
        }

        // Loading screen off
        toast.dismiss(toastId);
    }
};

const updateProfile = (token, formData) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");

        try {
            const response = await apiConnector( "PUT", UPDATE_PROFILE_API, formData, {Authorization: `Bearer ${token}`} );

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Update user in slices
            dispatch(setUser(response.data.user));
            toast.success("Profile Updated Successfully");
        }
        catch(error) {
            console.error("Update Profile API error: ", error)
            const message = error?.response?.data?.message || "Failed to update profile details";
            toast.error(message);
        }

        // Loading screen on
        toast.dismiss(toastId);
    }
};

const changePassword = async (token, formData) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector("PUT", CHANGE_PASSWORD_API, formData, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Password Changed Successfully");
    } 
    catch(error) {
        console.error("Change Password API error: ", error)
        const message = error?.response?.data?.message || "Failed to change password";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
};

const deleteProfile = (token, navigate) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {Authorization: `Bearer ${token}`});

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Logging out
            dispatch(logout(navigate));
            toast.success("Profile Deleted Successfully");
        } 
        catch(error) {
            console.error("Update Profile API error: ", error)
            const message = error?.response?.data?.message || "Failed to update profile details";
            toast.error(message);
        }

        // Loading screen off
        toast.dismiss(toastId)
    }
};

// Export
export {updateDisplayPicture, updateProfile, changePassword, deleteProfile};
