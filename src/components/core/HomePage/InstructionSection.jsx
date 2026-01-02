// Import
// Modules
import { FaArrowRight } from "react-icons/fa";

// Components
import HighlightText from "./HighlightText";
import CTAButton from "./CTAButton";

// Assets
import Instructor from "../../../assets/Images/Instructor.png";

const InstructionSection = () => {
    return (
        <div className= "flex flex-col gap-20 items-center lg:flex-row">
            <div className="lg:w-[50%]">
                <img
                    src={Instructor}
                    alt="InstructorImage"
                    className="shadow-white shadow-[-20px_-20px_0_0]"
                />
            </div>

            <div className="flex flex-col gap-10 lg:w-[50%]">
                <h2 className="text-4xl font-semibold lg:w-[50%]">
                    Become an
                    <HighlightText text={"Instructor"} />
                </h2>

                <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
                    Instructors from around the world teach millions of students on
                    StudyNotion. We provide the tools and skills to teach what you
                    love.
                </p>

                <div className="w-fit">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className="flex items-center gap-3">
                            Start Teaching Today
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                </div>
            </div>            
        </div>
    )
};

// Export
export default InstructionSection;
