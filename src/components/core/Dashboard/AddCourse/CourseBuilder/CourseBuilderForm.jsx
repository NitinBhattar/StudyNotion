// Import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import {createSection, updateSection} from "../../../../../services/Operations/courseDetailsAPI.js";
import {setCourse, setEditCourse, setStep} from "../../../../../slices/courseSlice.js";
import IconBtn from "../../../../common/IconBtn.jsx";
import NestedView from "./NestedView.jsx";

const CourseBuilderForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    // From slices
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // States to keep track of section and loading
    const [loading, setLoading] = useState(false);
    const [editSectionName, setEditSectionName] = useState(null);

    // Next button, Edit/Create Course
    const onSubmit = async (data) => {
        setLoading(true);
        let result;

        // Edit mode on
        if(editSectionName) {
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id
                },
                token
            )
        }
        // Create new section
        else {
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    courseId: course._id
                },
                token
            )
        }

        if(result) {
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName", "");
        }

        setLoading(false);
    }

    // Handle for cancel edit
    const cancelEdit = () => {
        setEditSectionName(null);
        setValue("sectionName", "");
    }

    // Edit section
    const handleChangeEditSectionName = (sectionId, sectionName) => {
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }

    const goToNext = () => {
        // No section added to course
        if(course.courseContent.length === 0) {
            toast.error("Please add atleast one section")
            return;
        }
        // No subsection added
        if(course.courseContent.some((section) => section.subSections.length === 0)) {
            toast.error("Please add atleast one lecture in each section");
            return;
        }

        // Push to Publish
        dispatch(setStep(3));
    }

    const goBack = () => {
        // Pull to Course Details
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }

    return (
        <div className= "space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
            <h2 className= "text-2xl font-semibold text-richblack-5">Course Builder</h2>

            {/* Section name */}
            <form onSubmit = {handleSubmit(onSubmit)} className= "space-y-4">
                <div className= "flex flex-col space-y-2">
                    <label className= "text-sm text-richblack-5" htmlFor= "sectionName">
                        Section Name <sup className= "text-pink-200">*</sup>
                    </label>

                    <input
                        id= "sectionName"
                        disabled= {loading}
                        placeholder ="Add a section to build your course"
                        className= "form-style w-full"
                        {...register("sectionName", { required: true })}
                    />

                    { errors.sectionName && (
                                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                                    Section name is required
                                                </span>
                                            )}
                </div>
                
                {/* Create/Edit section name */}
                <div className= "flex items-end gap-x-4">
                    <IconBtn
                        type= "submit"
                        disabled= {loading}
                        text= {editSectionName ? "Edit Section Name" : "Create Section"}
                        outline= {true}
                    >
                        <IoAddCircleOutline size= {20} className= "text-yellow-50" />
                    </IconBtn>

                    {editSectionName && (
                                            <button
                                                type= "button"
                                                onClick= {cancelEdit}
                                                className= "text-sm text-richblack-300 underline"
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                </div>
            </form>
            
            {/* Section List */}
            {course.courseContent.length > 0 && (<NestedView handleChangeEditSectionName={handleChangeEditSectionName} />)}

            {/* Prev & Next Button */}
            <div className= "flex justify-end gap-x-3">
                <button
                    // Go back make slices set it and in RenderSteps we have assigned to go back on prev steps
                    type= "button"
                    onClick= {goBack}
                    className= "flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                >
                    Back
                </button>

                <IconBtn disabled= {loading} text= "Next" onclick= {goToNext}>
                    <MdNavigateNext />
                </IconBtn>
            </div>
        </div>
    )
};

// Export
export default CourseBuilderForm;
