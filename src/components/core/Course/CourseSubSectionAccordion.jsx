// Import
import { HiOutlineVideoCamera } from "react-icons/hi"

const CourseSubSectionAccordion = ({ subSection }) => {
    return (
        <div className= "flex justify-between py-2">
            <div className= "flex items-center gap-2">
                <span className= "">
                    <HiOutlineVideoCamera />
                </span>
                <p className= "">{subSection?.title}</p>
            </div>
        </div>
    )
};

// Export
export default CourseSubSectionAccordion;
