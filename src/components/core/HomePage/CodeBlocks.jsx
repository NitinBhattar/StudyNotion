// Import
// Modules
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";

// Components
import CTAButton from "./CTAButton";

const CodeBlocks = ( {position, heading, subheading, CTAbtn1, CTAbtn2, codeColour, codeBlock, backgroundGradient} ) => {
  return (
    <div className= {`flex ${position} my-20 justify-between gap-10`}>
        {/* Section1  */}
        <div className= "w-full lg:w-[50%] flex flex-col gap-8">
            {heading}

            <div className= "text-richblack-300 text-base w-[85%] -mt-3 font-bold">
                {subheading}
            </div>

            <div className= "flex gap-7 mt-7">
                    <CTAButton active= {CTAbtn1.active} linkto= {CTAbtn1.linkto}>
                        <div className= "flex gap-2 items-center">
                            {CTAbtn1.text}
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                <CTAButton active= {CTAbtn2.active} linkto= {CTAbtn2.linkto}>
                    {CTAbtn2.text}
                </CTAButton>
            </div>
        </div>

        {/* Section2 */}
        <div className= "code-border h-fit flex flex-row py-3 text-[10px] relative sm:text-sm leading-[18px] sm:leading-6 w-full lg:w-[470px]">
            {backgroundGradient}

            {/* Indexing */}
            <div className= "w-[10%] text-center z-10 flex flex-col select-none text-richblack-400 font-inter font-bold">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            {/* Codes */}
            <div className= {`w-[90%] z-10 flex flex-col gap-2 font-bold font-mono ${codeColour} pr-1`}>
                <TypeAnimation
                    sequence={[codeBlock, 1000, ""]}
                    cursor={true}
                    repeat={Infinity}
                    style={{
                    whiteSpace: "pre-line",
                    display: "block",
                    }}
                    omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
  )
};

// Export
export default CodeBlocks;
