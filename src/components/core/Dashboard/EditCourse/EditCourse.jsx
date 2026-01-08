// Import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../services/Operations/courseDetailsAPI.js";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice.js";
import RenderSteps from "../AddCourse/RenderSteps.jsx";
import Spinner from "../../../common/Spinner.jsx";

const EditCourse = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth) ;
    const { course } = useSelector( (state) => state.course );
    const dispatch = useDispatch();

    // Extract course id from params
    const { courseId } = useParams();
    // States to keep track of loading
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);

            // API Call
            const result = await getFullDetailsOfCourse(courseId, token);

            // Update course
            if (result?.course) {
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.course));
            }

            setLoading(false);
        }

        fetchCourse();
    }, [courseId, token, dispatch]);

    // Annother way to write loading instead of ternary operator
    if(loading) {
        return (
            <div className= "grid flex-1 place-items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className= "">
            <h2 className= "mb-14 text-3xl font-medium text-richblack-5">
                Edit Course
            </h2>
            <div className= "mx-auto max-w-[600px]">
                {
                    course
                    ? (<RenderSteps />)
                    : (
                        <p className= "mt-14 text-center text-3xl font-semibold text-richblack-100">
                            Course not found
                        </p>
                      )
                }
            </div>
        </div>
    )
};

// Export
export default EditCourse;
