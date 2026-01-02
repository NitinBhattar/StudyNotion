// Import
// Modules
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ( {cardData, currentCard, setCurrentCard} ) => {
    return (
        // For active card: yellow & white shadow
        <div
            onClick={() => setCurrentCard(cardData?.heading)}
            className= {`w-[360px] lg:w-[30%] text-richblack-25 h-[300px] box-border cursor-pointer
                        transition-all duration-200
                        ${currentCard === cardData?.heading ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
                        : "bg-richblack-800" }`
                    }
        >
            <div className="border-b-2 border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
                <div className={`font-semibold text-[20px] ${currentCard === cardData?.heading ? "text-richblack-800" : "text-white"}`} >
                    {cardData?.heading}
                </div>

                <div className="text-richblack-400">{cardData?.description}</div>
            </div>
            
            {/* Footer */}
            <div
                className={`flex justify-between px-6 py-3 font-medium
                            ${currentCard === cardData?.heading ? "text-blue-300" : "text-richblack-300"}`
                }
            >
                {/* Level */}
                <div className="flex items-center gap-2 text-[16px]">
                    <HiUsers />
                    <p>{cardData?.level}</p>
                </div>

                {/* Lessons */}
                <div className="flex items-center gap-2 text-[16px]">
                    <ImTree />
                    <p>{cardData?.lessionNumber} Lession</p>
                </div>
            </div>
        </div>
    )
};

// Export
export default CourseCard;
