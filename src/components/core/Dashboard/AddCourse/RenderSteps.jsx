// Import
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm.jsx";
import CourseInformationForm from "./CourseInformation/CourseInformationForm.jsx";
import PublishCourse from "./PublishCourse/PublishCourse.jsx";

const RenderSteps = () => {
    // From slices
    const { step } = useSelector( (state) => state.course );

    const steps = [
        {
            id: 1,
            title: "Course Information"
        },
        {
            id: 2,
            title: "Course Builder"
        },
        {
            id: 3,
            title: "Publish"
        }
    ];

    return (
        <div className= "">
            {/* Circular Blobs */}
            <div className= "relative mb-2 flex w-full justify-center gap-x-10">
                {
                    steps.map((item) => {
                        return (
                            <div key= {item.id} className= "">
                                <div className= "flex flex-col items-center">
                                    <button
                                        className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border
                                                    ${step === item.id
                                                        ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                                                        : "border-richblack-700 bg-richblack-800 text-richblack-300"} 
                                                    ${step > item.id && "bg-yellow-50 text-yellow-50"}}`}
                                    >
                                        {step > item.id ? (<FaCheck className= "font-bold text-richblack-900" />) : (item.id)}
                                    </button>
                                </div>

                                {
                                    item.id !== steps.length &&
                                    (<div className= {`mx-auto h-[17px] w-[33%] border-b-2 ${step > item.id  ? "border-yellow-50" : "border-richblack-500"}`} />)
                                }
                            </div>
                        )
                    })
                }
            </div>

            <div className= "relative mb-16 flex w-full select-none justify-between">
                {
                    steps.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className= "flex min-w-[130px] flex-col items-center gap-y-2"
                            >                
                                <p className= {`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`}>
                                    {item.title}
                                </p>
                            </div>
                        )
                    })
                }
            </div>

            {/* Render specific component based on current step */}
            {/* Info about cource */}
            {step === 1 && <CourseInformationForm />}
            {/* Section & Subsection */}
            {step === 2 && <CourseBuilderForm />}
            {/* Publish */}
            {step === 3 && <PublishCourse />}
        </div>
    )
};

// Export
export default RenderSteps;
