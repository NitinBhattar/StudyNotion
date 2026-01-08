//Import
import { toast } from "react-hot-toast";
import apiConnector from "../apiConnector.js";
import { catalogData } from "../apis.js";

// Returns categoryCourses, differentCategories, topSellingCourses
const getCatalogPageData = async (categoryId) => {
    // Loading screen on
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
                                            {
                                                categoryId: categoryId,
                                            }
                                           );
                                        
        // API Fail
        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data;
    }
    catch (error) {
        console.error("Get Catalog API error: ", error);
        const message = error?.response?.data?.message || "Failed to get catalog";
        toast.error(message);
        result = error.response?.data
    }

    // Loading screen off
    toast.dismiss(toastId);
    return result;
};

// Export
export default getCatalogPageData;
