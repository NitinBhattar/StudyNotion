// Import
import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice.js";
import apiConnector from "../apiConnector.js";
import { profileEndpoints } from "../apis.js";
import { logout } from "./authAPI.js";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints

// Returns user
const getUserDetails = (token, navigate) => {
    return async (dispatch) => {
        // Loading screen on
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {Authorization: `Bearer ${token}`});

            // API Fail
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const userImage = response?.data?.user?.imageUrl
                            ? response.data.user.imageUrl
                            : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

            dispatch(setUser({ ...response.data.user, image: userImage }));
        }
        catch (error) {
            dispatch(logout(navigate));
            console.error("Get User Details API error: ", error);
            const message = error?.response?.data?.message || "Failed to get user details";
            toast.error(message);
        }

        // Loading screen off
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
};

// Returns courses
const getUserEnrolledCourses = async (token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, { Authorization: `Bearer ${token}`,});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.courses;
    }
    catch(error) {
        console.error("Get Enrolled Courses API error: ", error);
        const message = error?.response?.data?.message || "Failed to get enrolled courses";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns courses
const getInstructorData = async (token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
        throw new Error(response.data.message)
        }

        result = response?.data?.courses;
    }
    catch(error) {
        console.error("Get Instructor Data API error: ", error);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Export
export {getUserDetails, getUserEnrolledCourses, getInstructorData};
 