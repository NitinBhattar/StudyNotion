// Import
// Modules
import { useState } from "react";

// Components
import HighlightText from "./HighlightText.jsx";
import CourseCard from "./CourseCard";

// Data
import { HomePageExplore } from "../../../data/homepage-explore.js";

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];

const ExploreMore = () => {
    // Highlights Tab
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    // Tab's courses
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    // Highlights Course
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    // Combine Setter
    const setMyCard = (value) => {
        // Set Tab
        setCurrentTab(value);

        // Tab's courses, filter & set
        const result = HomePageExplore.filter( (course) => course.tag === value);
        setCourses(result[0].courses);

        // Set heading for each course
        setCurrentCard(result[0].courses[0].heading);
    };

    return (
        <div className= "">
            <div className= "">
                {/* Heading */}
                <h2 className= "text-4xl font-semibold text-center">
                    Unlock the
                    <HighlightText text= {"Power of Code"} />
                </h2>

                <p className= "text-center text-richblack-300 font-semibold mt-3">
                    Learn to build anything to can imagine
                </p>
            </div>

            {/* Hover Bar */}
            <div className= "hidden gap-5 mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] lg:flex ">
                {
                    tabsName.map( (element, index) => {
                        return (
                            <div
                                key= {index}
                                onClick= {() => setMyCard(element)}
                                className= {`text-[16px] flex items-center gap-2 rounded-full px-4 py-[7px]
                                            transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5
                                            ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium"
                                                                     : " text-richblack-200"} `}
                            >
                                {element}
                            </div>
                        );
                    })
                }
            </div>

            {/* Gap */}
            <div className="hidden lg:block lg:h-[200px]"></div>

            <div className= "w-full flex flex-wrap justify-center text-black px-3 gap-10 lg:absolute lg:gap-0 lg:justify-between lg:bottom-0 lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] lg:mb-0 mb-7 lg:px-0">
                {
                    courses.map( (element, index) => {
                        return (
                            <CourseCard 
                                key= {index}
                                cardData= {element}
                                currentCard= {currentCard}
                                setCurrentCard= {setCurrentCard}
                            />
                        );
                    })
                }
            </div>
        </div>
    )
}

// Export
export default ExploreMore;
