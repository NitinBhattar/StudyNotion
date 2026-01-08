// Import
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const {token} = useSelector( (state) => state.auth );

    // For logged-in users
    if (token !== null) {
        return children;
    }

    // Opens login page for non logged-in users
    return <Navigate to= {"/login"} />;
};

// Export
export default PrivateRoute;
