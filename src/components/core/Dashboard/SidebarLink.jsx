// Import
import { useDispatch } from "react-redux";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import * as Icons from "react-icons/vsc";

const SidebarLink = ({ link, iconName }) => {
    const location = useLocation();
    const Icon = Icons[iconName];

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    return (
        // NavLink cause we only need to show the active panel
        <NavLink
            to= {link.path}
            className={`relative px-8 py-2 text-sm font-medium
                        transition-all duration-200
                        ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50"
                                                : "bg-opacity-0 text-richblack-300"}`}
        >
            <span
                className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50
                            ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}
            />

            <div className= "flex items-center gap-x-2">
                {/* Icon Goes Here */}
                <Icon className= "text-lg" />

                <span className= "">
                    {link.name}
                </span>
            </div>
        </NavLink>
    )
};

// Export
export default SidebarLink;
