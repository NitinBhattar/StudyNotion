// Import
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import Sidebar from "../components/core/Dashboard/Sidebar.jsx";

const Dashboard = () => {
    // From slices
    const { loading: authLoading } = useSelector( (state) => state.auth );
    const { loading: profileLoading } = useSelector( (state) => state.profile );

    // Spinner wen profile is loading or token is being saved.
    if (authLoading || profileLoading) {
        return (
            <div className= "grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        );
    }

    // Dashboard
    return (
        <div className= "relative flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar />

            <div className= "h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className= "mx-auto w-11/12 max-w-[1000px] py-10">
                    {/* Allows multiple pages to be rendered, under dashboard/page part */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

// Export
export default Dashboard;
