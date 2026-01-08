// Import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { editCourseDetails } from "../../../../../services/Operations/courseDetailsAPI.js";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice.js";
import { COURSE_STATUS } from "../../../../../utils/constants.js";
import IconBtn from "../../../../common/IconBtn.jsx";

const PublishCourse = () => {
    const { 
        register,
        handleSubmit,
        setValue,
        getValues
    } = useForm();

    // From slices
    const { token } = useSelector( (state) => state.auth );
    const { course } = useSelector( (state) => state.course );
    const dispatch = useDispatch();

    const navigate = useNavigate();
    // States to keep track of loading
    const [loading, setLoading] = useState(false);

    // Appear to public
    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, []);

    // Pull to Sections
    const goBack = () => {
        dispatch(setStep(2));
    }

    // Go to my-courses
    const goToCourses = () => {
        // Reset slice
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    }

    // Handle for Publish Button
    const handleCoursePublish = async () => {
        // State already saved, navigate to my-courses
        if (
            (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
        ) {
            goToCourses();
            return;
        }

        // Publish course
        const formData = new FormData();

        // course._id from slices
        formData.append("courseId", course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);
        setLoading(true);

        // API Call
        const result = await editCourseDetails(formData, token);
        if (result) {
            goToCourses();
        }

        setLoading(false);
    }

    // For button
    const onSubmit = () => {
        handleCoursePublish();
    }

    return (
        <div className= "rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <h2 className= "text-2xl font-semibold text-richblack-5">
                Publish Settings
            </h2>

            <form onSubmit= {handleSubmit(onSubmit)}>
                {/* Checkbox */}
                <div className="my-6 mb-8">
                    <label htmlFor= "public" className= "inline-flex items-center text-lg">
                        <input
                            type= "checkbox"
                            id= "public"
                            className= "border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                            {...register("public")}
                        />
                        <span className="ml-2 text-richblack-400">
                            Make this course as public
                        </span>
                    </label>
                </div>

                {/* Next Prev Button */}
                <div className= "ml-auto flex max-w-max items-center gap-x-4">
                    <button
                        disabled= {loading}
                        type= "button"
                        onClick= {goBack}
                        className= "flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        Back
                    </button>
                    <IconBtn disabled= {loading} text= "Save Changes" />
                </div>
            </form>
        </div>
    )
};

// Export
export default PublishCourse;
