// Import
import axios from "axios";

const axiosInstance = axios.create({});

const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method,
        url,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null
    })
};

// Export
export {axiosInstance};
export default apiConnector;
