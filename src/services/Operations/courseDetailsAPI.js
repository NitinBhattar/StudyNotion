// Import
import { toast } from "react-hot-toast";
import apiConnector from "../apiConnector.js";
import { courseEndpoints } from "../apis.js";

const {
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    COURSE_DETAILS_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    GET_ALL_INSTRUCTOR_COURSES_API,
    GET_ALL_COURSE_API,
    DELETE_COURSE_API,
    LECTURE_COMPLETION_API,
    COURSE_CATEGORIES_API,
    CREATE_SECTION_API,
    UPDATE_SECTION_API,
    DELETE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    CREATE_RATING_API
} = courseEndpoints;

// Returns course
const addCourseDetails = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        });

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.course;
        toast.success("Course details added successfully");
    }
    catch(error) {
        console.error("Create course API error: ", error);
        const message = error?.response?.data?.message || "Failed to add course details";
        toast.error(message);
    }

    // loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns course 
const editCourseDetails = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("PUT", EDIT_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        });

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.course;
        toast.success("Course Details Updated Successfully");
    }
    catch(error) {
        console.error("Edit course API error: ", error);
        const message = error?.response?.data?.message || "Failed to edit course";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId)
    return result
};

// Returns course
const fetchCourseDetails = async (courseId) => {
    // Loadin screen on
    const toastId = toast.loading("Loading...")
    let result = null;

    try {
        const response = await apiConnector("POST", COURSE_DETAILS_API, {courseId});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response;
    }
    catch(error) {
        console.error("Get course details API error: ", error);
        const message = error?.response?.data?.message || "Failed to get course details";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns courses
const fetchInstructorCourses = async (token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API, null, {Authorization: `Bearer ${token}`});

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.courses;
    }
    catch(error) {
        console.error("Get Instructor's courses API error: ", error);
        const message = error?.response?.data?.message || "Failed to get Instructor's courses";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns data and components in it
const getFullDetailsOfCourse = async (courseId, token) => {
    // Loading screeen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("POST", GET_FULL_COURSE_DETAILS_AUTHENTICATED, {courseId}, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
    }
    catch(error) {
        console.error("Get Full Details of Course API error: ", error);
        const message = error?.response?.data?.message || "Failed to get full details of this course";
        toast.error(message);
    }

    // Loading screeen off
    toast.dismiss(toastId);
    return result;
};

// Returns allCourses
const getAllCourses = async () => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET", GET_ALL_COURSE_API);

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.allCourses || [];
    }
    catch(error) {
        console.error("Get all courses API error: ", error);
        const message = error?.response?.data?.message || "Failed to get all courses";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

const deleteCourse = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        toast.success("Course deleted successfully");
    }
    catch(error) {
        console.error("Delete course API error: ", error);
        const message = error?.response?.data?.message || "Failed to delete course";
        toast.error(message);
    }

    // Loading screen on
    toast.dismiss(toastId);
};

// Returns course 
const createSection = async (data, token) => {
    // Loading screen on
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.course;
        toast.success("Course section added successfully");
    }
    catch(error) {
        console.error("Create section API error: ", error);
        const message = error?.response?.data?.message || "Failed to add section";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns course 
const updateSection = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.course;
        toast.success("Course section updated successfully");
    }
    catch(error) {
        console.error("Update section API error: ", error);
        const message = error?.response?.data?.message || "Failed to update section";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns course 
const deleteSection = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("POST", DELETE_SECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.course;
        toast.success("Course section deleted");
    }
    catch(error) {
        console.error("Delete section API error: ", error);
        const message = error?.response?.data?.message || "Failed to delete section";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns section
const createSubSection = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.section;
        toast.success("Lecture added successfully");
    }
    catch(error) {
        console.error("Create subsection API error: ", error);
        const message = error?.response?.data?.message || "Failed to create subsection";
        toast.error(message);
    }

    // Loading screeen off
    toast.dismiss(toastId);
    return result;
};

// Returns section
const updateSubSection = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.section;
        toast.success("Lecture updated successfully");
    }
    catch(error) {
        console.error("Update subsection API error: ", error);
        const message = error?.response?.data?.message || "Failed to update subsection";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns section
const deleteSubSection = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.section;
        toast.success("Lecture deleted successfully");
    }
    catch(error) {
        console.error("Delete subsection API error: ", error);
        const message = error?.response?.data?.message || "Failed to delete subsection";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Returns allCategories
const fetchCourseCategories = async () => {
    let result = [];

    try {
        const response = await apiConnector("GET", COURSE_CATEGORIES_API);

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.allCategories;
    }
    catch(error) {
        console.error("Get all categories API error: ", error);
        const message = error?.response?.data?.message || "Failed to get all categories";
        toast.error(message);
    }

    return result;
};

// Returns bool
const markLectureAsComplete = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("PUT", LECTURE_COMPLETION_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.message) {
            throw new Error(response.data.message);
        }

        result = true;
        toast.success("Lecture completed");
    }
    catch(error) {
        console.error("Lecture Completion API error: ", error);
        const message = "Failed to mark this lecture complete";
        toast.error(message);
    }

    toast.dismiss(toastId);
    return result;
};

// Returns bool
const createRating = async (data, token) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let success = false;

    try {
        const response = await apiConnector("POST", CREATE_RATING_API, data, {Authorization: `Bearer ${token}`});

        // API Fail
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        success = true;
        toast.success("Rating Created");
    }
    catch(error) {
        console.error("Create Rating API error: ", error);
        const message = error?.response?.data?.message || "Failed to create rating";
        toast.error(message);
    }

    // Loading screen off
    toast.dismiss(toastId);
    return success;
};

// Export
export {addCourseDetails, editCourseDetails, fetchCourseDetails, fetchInstructorCourses, getFullDetailsOfCourse, getAllCourses, deleteCourse,
        createSection, updateSection, deleteSection,
        createSubSection, updateSubSection, deleteSubSection,
        fetchCourseCategories, markLectureAsComplete, createRating};
