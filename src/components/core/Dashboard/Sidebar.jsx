// Import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { logout } from "../../../services/Operations/authAPI.js";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import SidebarLink from "./SidebarLink.jsx";
import Spinner from "../../common/Spinner.jsx";

// Data
import { sidebarLinks } from "../../../data/dashboard-links.js";

const Sidebar = () => {
    // From slices
    const { user, loading: profileLoading } = useSelector( (state) => state.profile );
    const { loading: authLoading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // To keep track of confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null);

    // Still fetching data
    if (authLoading || profileLoading) {
        return (
            <div className= "grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r border-r-richblack-700 bg-richblack-800">
                <Spinner />
            </div>
        );
    }

    return (
        <div className= "">
            <div className= "flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
                {/* Options */}
                <div className= "flex flex-col">
                    {
                        sidebarLinks.map((link) => {
                            if (link.type && user?.accountType !== link.type) {
                                return null;
                            }

                            return (
                                <SidebarLink key= {link.id} link= {link} iconName= {link.icon} />
                            );
                        })
                    }
                </div>
                
                {/* Border */}
                <div className= "mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

                <div className= "flex flex-col">
                    {/* Settings */}
                    <SidebarLink
                        link= {{ name: "Settings", path: "/dashboard/settings" }}
                        iconName= "VscSettingsGear"
                    />

                    {/* Logout button */}
                    <button
                        onClick={() =>
                            setConfirmationModal({
                                text1: "Are you sure?",
                                text2: "You will be logged out of your account.",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                btn1Handler: () => dispatch(logout(navigate)),
                                btn2Handler: () => setConfirmationModal(null)
                            })
                        }
                        className= "px-8 py-2 text-sm font-medium text-richblack-300"
                    >
                        <div className= "flex items-center gap-x-2">
                            <VscSignOut className=" text-lg" />
                            <span className= "">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Modal */}
            <div className= "">
                {confirmationModal && <ConfirmationModal modalData= {confirmationModal} />}
            </div>
        </div>
    )
};

// Export
export default Sidebar;
