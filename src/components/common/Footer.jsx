// Import
// Modules
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

// Data
import { FooterLink2 } from "../../data/footer-links.js";

// Assets
import Logo from "../../assets/Logo/Logo-Full-Light.png";

const BottomFooter =  ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources =  [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces"
];
const Plans =  ["Paid memberships", "For students", "Business solutions"];
const Community =  ["Forums", "Chapters", "Events"];
const GitUrl =  "https://github.com/NitinBhattar/StudyNotion";

const Footer =  () => {
    return (
        <div className= "bg-richblack-800">
            <div className= "flex gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14 lg:flex-row">
                <div className= "border-b w-full flex flex-col pb-5 border-richblack-700 lg:flex-row">
                    {/* Section 1 */}
                    <div className= "lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 gap-3 lg:border-richblack-700 lg:pr-5 lg:border-r">
                        <div className= "w-[30%] flex flex-col gap-3 mb-7 lg:w-[30%] lg:pl-0">
                            <img src= {Logo} alt= "StudyNotion Logo" className= "object-contain" />

                            {/* Company */}
                            <h2 className= "text-richblack-50 font-semibold text-[16px]">
                                Company
                            </h2>

                            <div className= "flex flex-col gap-2">
                                {["About", "Careers", "Affiliates"].map((element, index) => {
                                    return (
                                        <div
                                            key=  {index}
                                            className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                        <Link to= {element.toLowerCase()}>{element}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Company Links */}
                            <div className= "flex gap-3 text-lg">
                                <Link to= {GitUrl}>
                                    <FaFacebook />
                                </Link>
                                <Link to= {GitUrl}>
                                    <FaGoogle />
                                </Link>
                                <Link to= {GitUrl}>
                                    <FaTwitter />
                                </Link>
                                <Link to= {GitUrl}>
                                    <FaYoutube />
                                </Link>
                            </div>
                        </div>

                        <div className= "w-[48%] mb-7 lg:w-[30%] lg:pl-0">
                            {/* Resources */}
                            <h2 className= "text-richblack-50 font-semibold text-[16px]">
                                Resources
                            </h2>

                            <div className= "flex flex-col gap-2 mt-2">
                                {Resources.map((element, index) => {
                                    return (
                                        <div
                                            key= {index}
                                            className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to= {element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Support */}
                            <h2 className= "text-richblack-50 font-semibold text-[16px] mt-7">
                                Support
                            </h2>

                            <div className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                <Link to= {"/help-center"}>Help Center</Link>
                            </div>
                        </div>

                        <div className= "w-[48%] mb-7 lg:w-[30%] lg:pl-0">
                            {/* Plans */}
                            <h2 className= "text-richblack-50 font-semibold text-[16px]">
                                Plans
                            </h2>

                            <div className= "flex flex-col gap-2 mt-2">
                                {Plans.map((element, index) => {
                                    return (
                                        <div
                                            key= {index}
                                            className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to= {element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Community */}
                            <h2 className= "text-richblack-50 font-semibold text-[16px] mt-7">
                                Community
                            </h2>

                            <div className= "flex flex-col gap-2 mt-2">
                                {Community.map((element, index) => {
                                    return (
                                        <div
                                            key= {index}
                                            className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                        >
                                            <Link to= {element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className= "lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                        {FooterLink2.map((element, index) => {
                            return (
                                <div key= {index} className= "w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                                    {/* Title */}
                                    <h2 className= "text-richblack-50 font-semibold text-[16px]">
                                        {element.title}
                                    </h2>

                                    {/* Columns */}
                                    <div className= "flex flex-col gap-2 mt-2">
                                        {element.links.map((link, index) => {
                                            return (
                                                <div
                                                    key= {index}
                                                    className= "text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                                >
                                                    <Link to= {link.link}>{link.title}</Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
                    
            {/* Bottom Footer */}
            <div className= "flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
                    <div className= "flex justify-between items-center flex-col gap-3 w-full lg:flex-row lg:items-start">
                    
                    <div className= "flex flex-row">
                        {BottomFooter.map((element, index) => {
                            return (
                                <div
                                    key= {index}
                                    className= {`px-3 ${BottomFooter.length - 1 === index ? "" 
                                                    : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"}`}
                                >
                                    <Link to= {element.split(" ").join("-").toLocaleLowerCase()}>
                                        {element}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <div className= "text-center">Made with ❤️ FullMetal-Labs © 2026 StudyNotion</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
