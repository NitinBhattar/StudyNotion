// Import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

// Defining a functional component ChipInput
const ChipInput = ({
    // Props to be passed to the component
    label,
    name,
    placeholder,
    register,
    errors,
    setValue
}) => {
    // From slices
    const { editCourse, course } = useSelector( (state) => state.course );
    
    // When tags are entered, chips sows them with yellow colour
    const [chips, setChips] = useState([]);

    useEffect(() => {
        if (editCourse) {
            setChips(course?.tags);
        }

        register(name, { required: true, validate: (value) => value.length > 0 });
    }, []);

    useEffect(() => {
        setValue(name, chips);
    }, [chips]);

    // Handle hey down chip 
    const handleKeyDown = (event) => {
        // Check if user presses "Enter" or ","
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const chipValue = event.target.value.trim();

            // Prevent duplicate
            if (chipValue && !chips.includes(chipValue)) {
                const newChips = [...chips, chipValue];
                setChips(newChips);

                // Reset to default
                event.target.value = "";
            }
        }
    }

    // Chip deletion
    const handleDeleteChip = (chipIndex) => {
        // Filter the chips array to remove the chip with the given index
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips)
    }

    // Rendering the component in the bar with cross
    return (
        <div className= "flex flex-col space-y-2">
            <label className= "text-sm text-richblack-5" htmlFor= {name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>

            {/* Preview Box */}
            <div className= "flex w-full flex-wrap gap-y-2">
                {
                    chips.map((chip, index) => {
                        return (
                            <div
                                key={index}
                                className= "m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                            >
                                {/* Value */}
                                {chip}

                                {/* Cross Button */}
                                <button
                                    type= "button"
                                    className= "ml-2 focus:outline-none"
                                    onClick= {() => handleDeleteChip(index)}
                                >
                                    <MdClose className= "text-sm" />
                                </button>
                            </div>
                        )
                    })
                }

                {/* Input Tab */}
                <input
                    id= {name}
                    name= {name}
                    type= "text"
                    placeholder= {placeholder}
                    onKeyDown= {handleKeyDown}
                    className= "form-style w-full"
                />
            </div>

            {errors[name] && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    {label} is required
                                </span>
                             )
            }
        </div>
    )
};

// Export
export default ChipInput;
