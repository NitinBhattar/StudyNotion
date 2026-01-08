// Import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import {deleteSection, deleteSubSection} from "../../../../../services/Operations/courseDetailsAPI.js"
import { setCourse } from "../../../../../slices/courseSlice.js"
import ConfirmationModal from "../../../../common/ConfirmationModal.jsx"
import SubSectionModal from "./SubSectionModal.jsx"

const NestedView = ({ handleChangeEditSectionName }) => {
    // From slices
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    // States to keep track of subsection (add, view & edit)
    const [addSubSection, setAddSubsection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);

    // Conformation modal
    const [confirmationModal, setConfirmationModal] = useState(null);

    // Delete section
    const handleDeleSection = async (sectionId) => {
        // API Call
        const result = await deleteSection(
            {
                sectionId,
                courseId: course._id
            },
            token
        );

        // Update course
        if(result) {
            dispatch(setCourse(result));
        }

        // Clear conformation modal
        setConfirmationModal(null);
    }

    // Delete subsection
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        // API Call
        const result = await deleteSubSection({subSectionId, sectionId}, token);

        // Update the structure of course
        if(result) {
            // Remove from section
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section);
            // Update course
            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            // Update slices
            dispatch(setCourse(updatedCourse));
        }

        // Clear conformation modal
        setConfirmationModal(null);
    }

    return (
        <div className= "">
            <div
                id= "nestedViewContainer"
                className= "rounded-lg bg-richblack-700 p-6 px-8"
            >
                {
                    course?.courseContent?.map((section) => {
                        return (
                            // Section Dropdown
                            <details key= {section._id} open>

                                {/* Section Dropdown Content */}
                                <summary className= "flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                                    <div className= "flex items-center gap-x-3">
                                        <RxDropdownMenu className= "text-2xl text-richblack-50" />

                                        <p className= "font-semibold text-richblack-50">
                                            {section.sectionName}
                                        </p>
                                    </div>

                                    <div className= "flex items-center gap-x-3">
                                        <button
                                            onClick= {() => handleChangeEditSectionName(section._id, section.sectionName)}
                                        >
                                            <MdEdit className= "text-xl text-richblack-300" />
                                        </button>

                                        <button
                                            onClick= {() =>
                                                setConfirmationModal({
                                                    text1: "Delete this Section?",
                                                    text2: "All the lectures in this section will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: () => handleDeleSection(section._id),
                                                    btn2Handler: () => setConfirmationModal(null)
                                                })
                                            }
                                        >
                                            <RiDeleteBin6Line className= "text-xl text-richblack-300" />
                                        </button>

                                        <span className= "font-medium text-richblack-300">|</span>

                                        <AiFillCaretDown className= "text-xl text-richblack-300" />
                                    </div>
                                </summary>

                                <div className= "px-6 pb-4">
                                    {/* Render All Subsections Within a Section */}
                                    {
                                        (section.subSections).map((data) => {
                                            return (
                                                <div
                                                    key= {data?._id}
                                                    onClick= {() => setViewSubSection(data)}
                                                    className= "flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                                >
                                                    {/* Dropdown to view subsection */}
                                                    <div className= "flex items-center gap-x-3 py-2 ">
                                                        <RxDropdownMenu className= "text-2xl text-richblack-50" />
                                                        <p className= "font-semibold text-richblack-50">
                                                            {data.title}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Edit and Delete Button for subsection */}
                                                    <div
                                                        // stopPropagation for current ouput,not parent one
                                                        onClick= {(event) => event.stopPropagation()}
                                                        className= "flex items-center gap-x-3"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setEditSubSection({ ...data, sectionId: section._id })
                                                            }
                                                        >
                                                            <MdEdit className= "text-xl text-richblack-300" />
                                                        </button>

                                                        <button
                                                            onClick= {() =>
                                                                setConfirmationModal({
                                                                    text1: "Delete this Sub-Section?",
                                                                    text2: "This lecture will be deleted",
                                                                    btn1Text: "Delete",
                                                                    btn2Text: "Cancel",
                                                                    btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                                    btn2Handler: () => setConfirmationModal(null)
                                                                })
                                                            }
                                                        >
                                                            <RiDeleteBin6Line className= "text-xl text-richblack-300" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    {/* Add New Lecture to Section */}
                                    <button
                                        onClick= {() => setAddSubsection(section._id)}
                                        className= "mt-3 flex items-center gap-x-1 text-yellow-50"
                                    >
                                        <FaPlus className="text-lg" />
                                        <p>Add Lecture</p>
                                    </button>
                                </div>
                            </details>
                        )
                    })
                }
            </div>

            {/* Modal Display (Add, View, Edit) */}
            {
                addSubSection
                ? (
                    <SubSectionModal
                        modalData= {addSubSection}
                        setModalData= {setAddSubsection}
                        add= {true}
                    />
                  ) 
                : viewSubSection 
                  ? (
                    <SubSectionModal
                        modalData= {viewSubSection}
                        setModalData= {setViewSubSection}
                        view= {true}
                    />
                    ) 
                  : editSubSection
                    ? (
                        <SubSectionModal
                            modalData= {editSubSection}
                            setModalData= {setEditSubSection}
                            edit= {true}
                        />
                      )
                    : (<></>)
            }

            {/* Confirmation Modal */}
            {
                confirmationModal ? (<ConfirmationModal modalData= {confirmationModal} />) : (<></>)
            }
        </div>
    )
};

// Export
export default NestedView;
