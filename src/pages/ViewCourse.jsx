// Import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal.jsx";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { getFullDetailsOfCourse } from "../services/Operations/courseDetailsAPI.js";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice.js"

const ViewCourse = () => {
    // From Slices
    const { token } = useSelector( (state) => state.auth );
    const dispatch = useDispatch();

    // States to keep track of review modal
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();

    // Fetching when course is viewed
    useEffect(() => {
        const fetchFullDetails = async () => {
            // API Call
            const courseData = await getFullDetailsOfCourse(courseId, token);

            if(courseData) {
                dispatch(setCourseSectionData(courseData?.course?.courseContent));
                dispatch(setEntireCourseData(courseData?.course));
                dispatch(setCompletedLectures(courseData?.completedVideos));

                let lectures = 0;
                for(const section of courseData?.course?.courseContent) {
                    lectures += section.subSections.length
                }

                dispatch(setTotalNoOfLectures(lectures));
            }
        }

        fetchFullDetails();
    }, []);

    return (
        <div className= "">
            <div className= "relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />

                <div className= "h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className= "mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* When to display */}
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </div>
    )
};

// Export
export default ViewCourse;
