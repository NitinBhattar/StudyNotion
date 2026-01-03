// Import
const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password"
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"
};

// SETTINGS PAGE API
export const settingsEndpoints = {
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile"
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail"
};

// COURSE ENDPOINTS
export const courseEndpoints = {
    CREATE_COURSE_API: BASE_URL + "/courses/createCourse",
    EDIT_COURSE_API: BASE_URL + "/courses/editCourse",
    COURSE_DETAILS_API: BASE_URL + "/courses/getCourseDetails",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/courses/getFullCourseDetails",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/courses/getInstructorCourses",
    GET_ALL_COURSE_API: BASE_URL + "/courses/getAllCourses",
    DELETE_COURSE_API: BASE_URL + "/courses/deleteCourse",

    LECTURE_COMPLETION_API: BASE_URL + "/courses/updateCourseProgress",

    COURSE_CATEGORIES_API: BASE_URL + "/courses/showAllCategories",

    CREATE_SECTION_API: BASE_URL + "/courses/addSection",
    UPDATE_SECTION_API: BASE_URL + "/courses/updateSection",
    DELETE_SECTION_API: BASE_URL + "/courses/deleteSection",

    CREATE_SUBSECTION_API: BASE_URL + "/courses/addSubSection",
    UPDATE_SUBSECTION_API: BASE_URL + "/courses/updateSubSection",
    DELETE_SUBSECTION_API: BASE_URL + "/courses/deleteSubSection",

    CREATE_RATING_API: BASE_URL + "/courses/createRating"
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API: BASE_URL + "/courses/getReviews"
};

// CATAGORIES API
export const categories = {
    CATEGORIES_API: BASE_URL + "/courses/showAllCategories"
};

// CATALOG PAGE DATA
export const catalogData = {
    CATALOGPAGEDATA_API: BASE_URL + "/courses/getCategoryPageDetails"
};

// CONTACT-US API
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact"
};
