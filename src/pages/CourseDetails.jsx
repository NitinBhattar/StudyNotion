// Import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { fetchCourseDetails } from "../services/Operations/courseDetailsAPI.js";
import { buyCourse } from "../services/Operations/studentFeaturesAPI.js";
import formatDate from "../services/formatDate.js";
import GetAvgRating from "../utils/avgRating.js";
import ConfirmationModal from "../components/common/ConfirmationModal.jsx";
import Footer from "../components/common/Footer.jsx";
import RatingStars from "../components/common/RatingStars.jsx";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar.jsx";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard.jsx";
import Spinner from "../components/common/Spinner.jsx";
import Error from "./Error.jsx"

const CourseDetails = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth );
    const { user, loading } = useSelector( (state) => state.profile );
    const { paymentLoading } = useSelector( (state) => state.course );
    const dispatch = useDispatch();

    // Getting courseId from url parameter
    const { courseId } = useParams();
    const navigate = useNavigate();

    // States to keep track of course, average rating isActive, no. of lectures and confirmation modal
    const [response, setResponse] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [isActive, setIsActive] = useState(Array(0));
    // Different from viewCourse slices
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect(() => {
        // API Call
        const courseDetailsAPI = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                setResponse(result);
            }
            catch (error) {
                console.error("Could not fetch Course Details");
            }
        }

        // State update
        courseDetailsAPI();
    }, [courseId])

    // Calculating Avg Review count
    useEffect(() => {
        if(!response) {
            return;
        }

        const count = GetAvgRating(response?.data?.course?.ratingAndReview);
        setAvgReviewCount(count);
    }, [response]);


    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e != id)
        )
    }

    // Total number of lectures
    useEffect(() => {
        if(!response) {
            return;
        }

        let lectures = 0;

        for(const section of response?.data?.course?.courseContent) {
            lectures += section.subSections.length || 0;
        }

        setTotalNoOfLectures(lectures)
    }, [response]);

    // If no fetching response
    if (loading || !response) {
        return (
            <div className= "grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        );
    }
    if (!response?.data?.success) {
        return <Error />
    }

    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnailUrl,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReview,
        instructor,
        studentsEnrolled,
        createdAt
    } = response?.data?.course;

    const handleBuyCourse = () => {
        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }

        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }

    if (paymentLoading) {
        return (
            <div className= "grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className= "">
            <div className= "relative w-full bg-richblack-800">
                {/* Hero Section */}
                <div className= "mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                    <div className= "mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className= "relative block max-h-[30rem] lg:hidden">
                            <div className= "absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                            <img
                                src= {thumbnailUrl}
                                alt= "course thumbnailUrl"
                                className= "aspect-auto w-full"
                            />
                        </div>

                        <div className= "z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
                            <div className= "">
                                <p className= "text-4xl font-bold text-richblack-5 sm:text-[42px]">
                                    {courseName}
                                </p>
                            </div>

                            <p className= "text-richblack-200">{courseDescription}</p>

                            <div className= "text-md flex flex-wrap items-center gap-2">
                                <span className= "text-yellow-25">{avgReviewCount}</span>

                                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />

                                <span>{`(${ratingAndReview.length} reviews)`}</span>

                                <span>{`${studentsEnrolled.length} students enrolled`}</span>
                            </div>

                            <div>
                                <p className= "">
                                    Created By {`${instructor.firstName} ${instructor.lastName}`}
                                </p>
                            </div>

                            <div className= "flex flex-wrap gap-5 text-lg">
                                <p className= "flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className= "flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div>
                        </div>

                        <div className= "flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                            <p className= "space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>

                            <button className= "yellowButton" onClick= {handleBuyCourse}>
                                Buy Now
                            </button>

                            <button className= "blackButton">Add to Cart</button>
                        </div>
                    </div>

                    {/* Courses Card */}
                    <div className= "right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                        <CourseDetailsCard
                            course= {response?.data?.course}
                            setConfirmationModal= {setConfirmationModal}
                            handleBuyCourse= {handleBuyCourse}
                        />
                    </div>
                </div>
            </div>

            <div className= "mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                <div className= "mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    {/* What will you learn section */}
                    <div className= "my-8 border border-richblack-600 p-8">
                        <p className="text-3xl font-semibold">What you'll learn</p>
                        <div className="mt-5">
                            <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Course content section */}
                    <div className= "max-w-[830px] ">
                        <div className= "flex flex-col gap-3">
                            <p className= "text-[28px] font-semibold">Course Content</p>

                            <div className= "flex flex-wrap justify-between gap-2">
                                <div className= "flex gap-2">
                                    <span className= "">
                                        {courseContent.length} {`section(s)`}
                                    </span>
                                    <span className= "">
                                        {totalNoOfLectures} {`lecture(s)`}
                                    </span>

                                    <span className= "">{response.data?.totalDuration} total length</span>
                                </div>

                                <button
                                    className= "text-yellow-25"
                                    onClick= {() => setIsActive([])}
                                >
                                    Collapse all sections
                                </button>
                            </div>
                        </div>

                        {/* Course Details Accordion */}
                        <div className="py-4">
                            {
                                courseContent?.map((course, index) => {
                                    return (
                                        <CourseAccordionBar
                                            course= {course}
                                            key= {index}
                                            isActive= {isActive}
                                            handleActive= {handleActive}
                                        />
                                    )
                                })
                            }
                        </div>

                        {/* Author Details */}
                        <div className= "mb-12 py-4">
                            <p className= "text-[28px] font-semibold">Author</p>

                            <div className= "flex items-center gap-4 py-4">
                                <img
                                    src={instructor.image
                                         ? instructor.image
                                         : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${instructor.firstName} ${instructor.lastName}`}
                                    alt="Author"
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                            </div>

                            <p className="text-richblack-50">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* When to activate */}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
};

// Export
export default CourseDetails
