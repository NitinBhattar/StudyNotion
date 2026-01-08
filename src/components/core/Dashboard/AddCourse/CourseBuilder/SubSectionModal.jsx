// Import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import {createSubSection, updateSubSection} from "../../../../../services/Operations/courseDetailsAPI.js";
import { setCourse } from "../../../../../slices/courseSlice.js";
import IconBtn from "../../../../common/IconBtn.jsx";
import Upload from "../Upload.jsx";

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        getValues,
    } = useForm();

    // From slices
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const dispatch = useDispatch();

    // States to keep track of loading
    const [loading, setLoading] = useState(false);

    // For view and edit
    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    // Form update in edit mode, if no change, nothing will trigger
    const isFormUpdated = () => {
        const currentValues = getValues();

        // If change is made to any field, return true
        if (
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl
        )   {
                return true;
            }

        return false;
    }

    // Edit section
    const handleEditSubsection = async () => {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }
        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo);
        }

        setLoading(true);

        // API Call
        const result = await updateSubSection(formData, token);

        // Update course
        if(result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData.sectionId ? result : section
            );
            
            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            // Update in slice
            dispatch(setCourse(updatedCourse));
        }

        // Reset modal
        setModalData(null);
        setLoading(false);
    }

    // Next button, Edit/Create Course
    const onSubmit = async (data) => {
        // View mode on
        if (view) {
            return;
        }

        // Edit mode on
        if (edit) {
            // Validation
            if (!isFormUpdated()) {
                toast.error("No changes made to the subsection");
            }
            else {
                // Call edit handle
                handleEditSubsection();
            }

            return;
        }

        // Create mode on
        const formData = new FormData();

        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("video", data.lectureVideo);
        setLoading(true);

        // API Call
        const result = await createSubSection(formData, token);

        // Update course
        if(result) {
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData ? result : section
            );

            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            // Update slices
            dispatch(setCourse(updatedCourse));
        }
        
        // Reset modal
        setModalData(null);
        setLoading(false);
    }

    return (
        <div className= "fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-richblack-900/60 backdrop-blur-sm">
            <div className= "my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                {/* Modal Header */}
                <div className= "flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <h2 className= "text-xl font-semibold text-richblack-5">
                        {/* Mode */}
                        {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                    </h2>

                    <button onClick={() => (!loading ? setModalData(null) : {})}>
                        <RxCross2 className= "text-2xl text-richblack-5" />
                    </button>
                </div>

                {/* Modal Form */}
                <form
                    onSubmit= {handleSubmit(onSubmit)}
                    className= "space-y-8 px-8 py-10"
                >
                    {/* Lecture Video Upload */}
                    <Upload
                        name= "lectureVideo"
                        label= "Lecture Video"
                        register= {register}
                        setValue= {setValue}
                        errors= {errors}
                        video= {true}
                        viewData= {view ? modalData.videoUrl : null}
                        editData= {edit ? modalData.videoUrl : null}
                    />

                    {/* Lecture Title */}
                    <div className= "flex flex-col space-y-2">
                        <label className= "text-sm text-richblack-5" htmlFor="lectureTitle">
                            Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                        </label>

                        <input
                            disabled= {view || loading}
                            id= "lectureTitle"
                            placeholder= "Enter Lecture Title"
                            className= "form-style w-full"
                            {...register("lectureTitle", { required: true })}
                        />

                        {errors.lectureTitle && (
                                                <span className= "ml-2 text-xs tracking-wide text-pink-200">
                                                    Lecture title is required
                                                </span>
                                                )}
                    </div>

                    {/* Lecture Description */}
                    <div className= "flex flex-col space-y-2">
                        <label className= "text-sm text-richblack-5" htmlFor= "lectureDesc">
                            Lecture Description{" "}

                            {!view && <sup className= "text-pink-200">*</sup>}
                        </label>

                        <textarea
                            disabled={view || loading}
                            id= "lectureDesc"
                            placeholder= "Enter Lecture Description"
                            className= "form-style resize-x-none min-h-[130px] w-full"
                            {...register("lectureDesc", { required: true })}
                        />
                        { errors.lectureDesc && (
                                                <span className= "ml-2 text-xs tracking-wide text-pink-200">
                                                    Lecture Description is required
                                                </span>
                                                )}
                    </div>
                    
                    {/* When not in view mode */}
                    {!view && (
                                <div className= "flex justify-end">
                                    <IconBtn
                                        disabled= {loading}
                                        text= {loading ? "Loading.." : edit ? "Save Changes" : "Save"}
                                    />
                                </div>
                              )}
                </form>
            </div>
        </div>
    )
};

// Export
export default SubSectionModal;
