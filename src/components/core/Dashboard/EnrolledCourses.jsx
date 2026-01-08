// Import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from "../../common/Spinner.jsx";
import { getUserEnrolledCourses } from "../../../services/Operations/profileAPI.js";
import CTAButton from "../HomePage/CTAButton.jsx";

const EnrolledCourses = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth );

    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const courses = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses
            setEnrolledCourses(courses);
        }
        catch(error) {
            console.error("Couldn't fetch enrolled courses")
        }
    };

    useEffect(() => {
        getEnrolledCourses();
    }, [])

    return (
        <div className= "">
            <div className= "text-3xl text-richblack-50">Enrolled Courses</div>
            {   
                // Show spinner until courses load
                !enrolledCourses
                ? (
                    <div className= "grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <Spinner/>
                    </div>
                  )
                : !enrolledCourses.length
                    ? (
                        <div className= "flex flex-col items-center justify-center gap-5">
                            <p className= "grid h-[10vh] w-full place-content-center text-xl text-richblack-5">
                                You have not enrolled in any course yet.
                            </p>
                            <CTAButton linkto= {"/"} active= {true}>
                                Explore courses
                            </CTAButton>
                        </div>
                      )
                    : (
                        <div className= "my-8 text-richblack-5">
                            {/* Headings */}
                            <div className= "flex rounded-t-lg bg-richblack-500">
                                <p className= "w-[45%] px-5 py-3">Course Name</p>
                                <p className= "w-1/4 px-2 py-3">Duration</p>
                                <p className= "flex-1 px-2 py-3">Progress</p>
                            </div>

                            {/* Course Names */}
                            {
                                enrolledCourses.map((course, index, arr) => {
                                    return(
                                        <div
                                            key= {index}
                                            className= {`flex items-center border border-richblack-700
                                            ${index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`}
                                        >
                                            {/* Navigate to particular course */}
                                            <div
                                                className= "flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                                onClick= {() => {navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}
                                            >   
                                                {/* Thumbnail */}
                                                <img
                                                    src= {course.thumbnailUrl}
                                                    alt= "course_img"
                                                    className= "h-14 w-14 rounded-lg object-cover"
                                                />

                                                {/* Name and Description */}
                                                <div className= "flex max-w-xs flex-col gap-2">
                                                    <p className= "font-semibold">{course.courseName}</p>

                                                    {/* First 50 words of the description */}
                                                    <p className= "text-xs text-richblack-300">
                                                        {course.courseDescription.length > 50
                                                        ? `${course.courseDescription.slice(0, 50)}...`
                                                        : course.courseDescription}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Duration */}
                                            <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                                            
                                            {/* Progress Bar */}
                                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                                <p className= ""> Progress: {course.progressPercentage || 0}% </p>
                                                <ProgressBar
                                                    completed={course.progressPercentage || 0}
                                                    height= "8px"
                                                    isLabelVisible= {false}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                      )
            }
            <div/>
        </div>
    )
};

// Export
export default EnrolledCourses;
