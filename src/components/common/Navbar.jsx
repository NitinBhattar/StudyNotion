// Import
// Modules
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import ProfileDropdown from "../core/Auth/ProfileDropdown.jsx";
import apiConnector from "../../services/apiConnector.js";
import { ACCOUNT_TYPE } from "../../utils/constants.js";
import { categories } from "../../services/apis.js";

// Data
import { NavbarLinks } from "../../data/navbar-links.js";

// Assets
import logo from "../../assets/Logo/Logo-Full-Light.png";


const Navbar = () => {
    // From slices
    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile );
    const {totalItems} = useSelector( (state) => state.cart );

    // React
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSubLinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(result.data.data);
        }
        catch(error) {
            console.error("Failed to fetch catalog: ", error);
        }
    };

    useEffect( () => {
        fetchSubLinks();
    }, []);

    // Router-Dom
    const location = useLocation();
    // For word match, path is path before last "/"
    const matchRoute = (route) => {
        return matchPath({ path:route}, location.pathname )
    };

    return (
        <div 
            className = {`flex h-14 items-center justify-center border-b border-b-richblack-700
                        transition-all duration-200
                        ${location.pathname !== "/" ? "bg-richblack-800" : ""}`}
        >
            <div className= "flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to= {"/"}>
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                {/* Navigation links */}
                <nav className= "hidden md:block">
                    <div className= "flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map( (element, index) => {
                                return(
                                    <div key= {index} className= "">
                                        {
                                            element.title === "Catalog"
                                            ? (
                                                <div className= {`group relative flex cursor-pointer items-center gap-1
                                                                ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}
                                                >
                                                    {/* Catalog + Arrow */}
                                                    <div className= "">
                                                        {element.title}
                                                    </div>

                                                    <BsChevronDown />

                                                    <div className="invisible absolute left-[50%] top-[50%] z-10 flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                        {loading 
                                                        ? ( <p className="text-center">Loading...</p>)
                                                        : subLinks.length ? (
                                                                                <div className= "">
                                                                                    {subLinks
                                                                                    ?.filter(
                                                                                        (subLink) => subLink?.courses?.length > 0
                                                                                    )
                                                                                    ?.map((subLink, index) => (
                                                                                        <Link
                                                                                            key={index}
                                                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                                                        >
                                                                                            <div className= "">{subLink.name}</div>
                                                                                        </Link>
                                                                                    ))}
                                                                                </div>
                                                                            ) 
                                                                          : (<p className="text-center">No Courses Found</p>)}
                                                    </div>                                                    
                                                </div>
                                              ) 
                                            : (
                                                <Link to= {element.path}>
                                                    <div className= {`${matchRoute(element?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                        {element.title}
                                                    </div>
                                                </Link>
                                              )
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </nav>

                {/* Login, Signup, Dashboard */}
                <div className= "hidden items-center gap-x-4 md:flex">
                    {
                        user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                            <Link to= {"/dashboard/cart"} className= "relative">
                                <AiOutlineShoppingCart className= "text-2xl text-richblack-100"/>
                                {
                                    totalItems > 0 && (
                                        <span className= "absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to= {"/login"}>
                                <button className= "rounded-[8px] border cursor-pointer border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log In
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to= {"/signup"}>
                                <button className= "rounded-[8px] border cursor-pointer border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign Up
                                </button>
                            </Link>
                        )                        
                    }
                    {
                        token !== null && <ProfileDropdown />
                    }
                </div>

                {/*  */}
                <button className="mr-4 md:hidden">
                    <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                </button>

            </div>
        </div>
    )
};

// Export
export default Navbar;