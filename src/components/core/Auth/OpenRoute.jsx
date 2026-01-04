// Import
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OpenRoute = ({ children }) => {
    const {token} = useSelector( (state) => state.auth );

    // For non logged-in users
    if (token === null) {
        return children
    }

    // Opens Dashboard for logged-in users
    return <Navigate to= {"/dashboard/my-profile"} />
};

// Export
export default OpenRoute;
