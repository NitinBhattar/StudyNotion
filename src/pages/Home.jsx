// Import
// Modules
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText.jsx";
import CTAButton from "../components/core/HomePage/CTAButton.jsx";
import CodeBlocks from "../components/core/HomePage/CodeBlocks.jsx";
import ExploreMore from "../components/core/HomePage/ExploreMore.jsx";
import TimelineSection from "../components/core/HomePage/TimelineSection.jsx";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection.jsx";
import InstructionSection from "../components/core/HomePage/InstructionSection.jsx";
import ReviewSlider from "../components/common/ReviewSlider.jsx";
import Footer from "../components/common/Footer.jsx";

// Assets
import Banner from "../assets/Images/banner.mp4";

const Home = () => {
    return (
        <div className= "">
            {/* Section1 */}
            <div className= "relative mx-auto flex flex-col w-11/12 max-w-maxContent gap-8 items-center justify-between text-white">

                {/* Become an Instructor Button */}
                <Link to={"/signup"}>
                    <div className= {`group mt-16 p-1 mx-auto w-fit rounded-full bg-richblue-800 shadow-zinc-400 font-bold text-white
                                    drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none`}>

                            <div className= "flex items-center gap-2 rounded-full px-10 py-1.25 transition-all duration-200 group-hover:bg-richblack-900">
                                <p className= "">Become an Instructor</p>
                                <FaArrowRight/>
                            </div>  
                            
                    </div>
                </Link>
                
                {/* Heading */}
                <div className= "text-center text-4xl font-semibold">
                    Empower Your Future Growth With
                    <HighlightText text= {"Coding Skills"} />
                </div>

                {/* Sub-Heading */}
                <div className= "-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300 ">
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.                
                </div>
                    
                {/* CTAButton */}
                <div className= "flex gap-7 mt-8">
                    <CTAButton active={true} linkto= {"/signup"}>
                        <div className= "flex items-center gap-2">
                            Learn More
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                    <CTAButton active={false} linkto= {"/login"}>
                        <div className= "">
                            Book a Demo
                        </div>
                    </CTAButton>
                </div>

                {/* Video */}
                <div className= "mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video
                        className= "shadow-[20px_20px_rgba(255,255,255)]"
                        muted
                        loop
                        autoPlay
                    >
                        <source src= {Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section1 */}
                <div className= "">
                    <CodeBlocks 
                        position= {"lg: flex-row"}
                        heading= {
                            <div className= "text-4xl font-semibold">
                                Unlock Your
                                <HighlightText text={"Coding Potential"} />
                                with our online courses
                            </div>
                        }
                        subheading= {"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                        CTAbtn1= {{
                            text: "Try it Yourself",
                            linkto: "/login",
                            active: true
                        }}
                        CTAbtn2= {{
                            text: "Learn More",
                            linkto: "/signup",
                            active: false
                        }}
                        codeColour= {"text-yellow-25"}
                        codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                {/* Code Section2 */}
                <div className= "">
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                        <div className="w-full text-4xl font-semibold lg:w-[50%]">
                            Start
                            <HighlightText text={"Coding in Seconds"} />
                        </div>
                        }
                        subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                        CTAbtn1={{
                            text: "Continue Lesson",
                            linkto: "/login",
                            active: true
                        }}
                        CTAbtn2={{
                            text: "Learn More",
                            linkto: "/signup",
                            active: false
                        }}
                        codeColor={"text-white"}
                        codeBlock={`import React from "react";\n import CTAButton from "./Button";\n import TypeAnimation from "react-type";\n import { FaArrowRight } from "react-icons/fa"; \n\n const Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>

                <ExploreMore />
            </div>

            {/* Section2 */}
            <div className= "bg-pure-greys-5 text-richblack-700">
                <div className= "homepage_bg h-[320px]">

                    {/* Explore Full Catagory Section */}
                    <div className= "w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 mx-auto">
                        <div className= "lg:h-[150px]"></div>
                        {/* Buttons */}
                        <div className= "flex gap-7 text-white lg:mt-8">
                            <CTAButton active= {true} linkto= {"/login"}>
                                <div className= "flex items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>

                            <CTAButton active= {false} linkto= {"/signup"}>
                                <div className= "">
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>

                </div>

                {/* Job in Demand */}
                <div className= "mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8">
                    <div className= "mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className= "text-4xl font-semibold lg:w-[45%]">
                            Get the Skills you need for a
                            <HighlightText text={"Job that is in Demand."} />
                        </div>

                        <div className= "flex flex-col gap-10 items-start lg:w-[40%]">
                            <div className= "text-[16px]">
                                The modern StudyNotion is the dictates its own terms. Today, to
                                be a competitive specialist requires more than professional
                                skills.
                            </div>
                            <CTAButton active= {true} linkto= {"/signup"}>
                                <div className= "">
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                    
                    {/* Other Sections */}
                    <TimelineSection />
                    <LearningLanguageSection />
                </div>

            </div>

            {/* Section3 */}
            <div className= "w-11/12 mx-auto mt-20 max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Become an Instructor */}
                <InstructionSection />

                {/* Reviews Column */}
                <h2 className= "text-center text-4xl font-semibold mt-10">
                    Review from other learners
                </h2>

                <ReviewSlider />
            </div>
                    
            {/* Section4 */}
            <Footer />
        </div>
    )
};

// Export
export default Home;
