// Import
import { useLocation, matchPath } from "react-router-dom";

const useRouteMatch = (path) => {
    const location = useLocation();
    return matchPath(location.pathname, {path});
};

// Export
export default useRouteMatch;
