// Import
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/Operations/courseDetailsAPI.js";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice.js";
import IconBtn from "../../common/IconBtn.jsx";

const VideoDetails = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth );
    const { courseSectionData, courseEntireData, completedLectures } = useSelector( (state) => state.viewCourse );
    const navigate = useNavigate();
    const location = useLocation();
    const playerRef = useRef(null);
    const dispatch = useDispatch();

    // From params
    const { courseId, sectionId, subSectionId } = useParams();

    // States to keep track of video, preview, videoEnded, loading
    const [videoData, setVideoData] = useState(null);
    const [previewSource, setPreviewSource] = useState("");
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEnrolledCoursesAPI = async () => {
            if (!courseSectionData.length) {
                return;
            }
            if (!courseId && !sectionId && !subSectionId) {
                navigate(`/dashboard/enrolled-courses`);
            }
            else {
                const filteredData = courseSectionData.filter((course) => course._id === sectionId);
                const filteredVideoData = filteredData?.[0]?.subSections.filter((data) => data._id === subSectionId);

                setVideoData(filteredVideoData[0]);
                setPreviewSource(courseEntireData.thumbnailUrl);
                setVideoEnded(false);
            }
        }

        fetchEnrolledCoursesAPI();
    }, [courseSectionData, courseEntireData, location.pathname]);

    // Check if the lecture is the first video of the course
    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSections.findIndex((data) => data._id === subSectionId);

        // First section and first subsection
        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        }
        else {
            return false;
        }
    };

    // Go to the next video
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const noOfSubsections =courseSectionData[currentSectionIndex].subSections.length;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSections.findIndex((data) => data._id === subSectionId);

        // If section isn't over
        if (currentSubSectionIndex !== noOfSubsections - 1) {
            // Index + 1
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSections[currentSubSectionIndex + 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        }
        // Next section, first video
        else {
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId =courseSectionData[currentSectionIndex + 1].subSections[0]._id;

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    };

    // Check if the lecture is the last video of the course
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const noOfSubsections = courseSectionData[currentSectionIndex].subSections.length;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSections.findIndex((data) => data._id === subSectionId);

        if (currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubsections - 1) {
            return true;
        }
        else {
            return false;
        }
    };

    // go to the previous video
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSections.findIndex((data) => data._id === subSectionId);

        // Same section 
        if (currentSubSectionIndex !== 0) {
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSections[currentSubSectionIndex - 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        }
        // Prev section
        else {
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSections.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSections[prevSubSectionLength - 1]._id;

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true);

        // API Call
        const result = await markLectureAsComplete({ courseId: courseId, subSectionId: subSectionId },token);

        if(result) {
            dispatch(updateCompletedLectures(subSectionId));
        }

        setLoading(false);
    }

    return (
        <div className= "flex flex-col gap-5 text-white">
            {
                !videoData?.videoUrl
                ? ( previewSource ? (
                                    <img
                                        src= {previewSource}
                                        alt= "Preview"
                                        className= "h-full w-full rounded-md object-cover"
                                    />
                                    )
                                    : null)
                : ( 
                    <div className="relative aspect-video">
                        <video
                            ref= {playerRef}
                            src= {videoData.videoUrl}
                            controls
                            className="w-full h-full rounded-md"
                            onEnded={() => setVideoEnded(true)}
                        />

                        {/* Render When Video Ends */}
                        {
                            videoEnded && 
                            (
                                <div
                                    style= {{ backgroundImage: "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",}}
                                    className= "full absolute inset-0 z-100 grid h-full place-content-center font-inter"
                                >   
                                    {/* Mark as complete Button */}
                                    {!completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                            disabled= {loading}
                                            onclick= {() => handleLectureCompletion()}
                                            text= {!loading ? "Mark As Completed" : "Loading..."}
                                            customClasses= "text-xl max-w-max px-4 mx-auto"
                                        />
                                    )}

                                    {/* Rewatch again Button */}
                                    <IconBtn
                                        disabled= {loading}
                                        onclick= {() => {
                                            const video = playerRef.current;
                                            if(video) {
                                                video.currentTime = 0;
                                                video.play();
                                                setVideoEnded(false);
                                            }
                                        }}
                                        text= "Rewatch"
                                        customClasses= "text-xl max-w-max px-4 mx-auto mt-2"
                                    />

                                    {/* Prev and Next Button */}
                                    <div className= "mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                        {!isFirstVideo() && (
                                                            <button
                                                                disabled= {loading}
                                                                onClick= {goToPrevVideo}
                                                                className= "blackButton"
                                                            >
                                                                Prev
                                                            </button>)}

                                        {!isLastVideo() && (
                                                            <button
                                                                disabled={loading}
                                                                onClick={goToNextVideo}
                                                                className="blackButton"
                                                            >
                                                                Next
                                                            </button>)}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                  )
            }

            <h2 className= "mt-4 text-3xl font-semibold">{videoData?.title}</h2>
            <p className= "pt-2 pb-6">{videoData?.description}</p>
        </div>
    )
};

// Export
export default VideoDetails;
