// Import
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import useOnClickOutside from "../../../hooks/useOnClickOutside.js";
import { logout } from "../../../services/Operations/authAPI.js";

const ProfileDropdown = () => {
    // From slice
    const { user } = useSelector((state) => state.profile);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Menu closed after clicking outside
    useOnClickOutside(ref, () => setOpen(false));

    // If no user, we dont need it
    if (!user) {
        return null;
    }

    return (
        <div className= "">
            <button className= "relative" onClick={() => setOpen(true)}>
                <div className= "flex items-center gap-x-1">
                    <img
                        src= {user?.image}
                        alt= {`profile-${user?.firstName}`}
                        className= "aspect-square w-[30px] rounded-full object-cover"
                    />
                    <AiOutlineCaretDown className= "text-sm text-richblack-100" />
                </div>
                {open &&
                    (
                        <div
                            // event.stopPropagation() will make onClick implement directly, otherwise it goes like child->parent->document
                            // child->parent->document and on document we have eventListener so menu closes before actions are performed
                            onClick={(event) => event.stopPropagation()}
                            className= "absolute top-[118%] right-0 z-1000 divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                            ref= {ref}
                        >   
                            {/* DashBoard */}
                            <Link to= {"/dashboard/my-profile"} onClick={() => setOpen(false)}>
                                <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                                    <VscDashboard className="text-lg" />
                                    Dashboard
                                </div>
                            </Link>

                            {/* Logout */}
                            <div
                                onClick={() => {
                                    dispatch(logout(navigate))
                                    setOpen(false)
                                    }}
                                className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
                            >
                                <VscSignOut className="text-lg" />
                                Logout
                            </div>
                        </div>
                    )
                }
            </button>
        </div>
    )
};

// Export
export default ProfileDropdown;
