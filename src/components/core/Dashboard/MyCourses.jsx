// Import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { fetchInstructorCourses } from "../../../services/Operations/courseDetailsAPI.js"
import IconBtn from "../../common/IconBtn.jsx"
import CoursesTable from "./InstructorCourses/CoursesTable.jsx"

const MyCourses = () => {
    // From slices
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const fetchCourses = async () => {
            // API Call
            const result = await fetchInstructorCourses(token);
            if (result) {
                setCourses(result);
            }
        }

        fetchCourses();
    }, [])

    return (
        <div className = "">
            <div className= "mb-14 flex items-center justify-between">
                <h2 className= "text-3xl font-medium text-richblack-5">My Courses</h2>
                <IconBtn
                    text=  "Add Course"
                    onclick={() => navigate("/dashboard/add-course")}
                >
                    <VscAdd />
                </IconBtn>
            </div>

            {/* If courses are there, we show it */}
            {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
        </div>
    )
};

// Export
export default MyCourses;
