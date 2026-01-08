// Import
// Modules
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiConnector from "../../../services/apiConnector.js";
import { contactusEndpoint } from "../../../services/apis.js";

// Data
import CountryCode from "../../../data/countrycode.json";

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    // react-hook-form auto generates data
    const submitContactForm = async (data) => {
        try {
            setLoading(true);
            
            // Send Mail
            const res = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);

            // Reset form
            reset();
            setLoading(false);
        }
        catch(error) {
            console.error("Failed to send message", error.message);
            setLoading(false);
        }        
    };

    useEffect( () => {
        if(isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: ""
            })
        }
    }, [reset, isSubmitSuccessful]);

    return(
        <form 
            onSubmit= {handleSubmit(submitContactForm)}
            className= "flex flex-col gap-7"
        >
            <div className= "flex flex-col gap-5 lg:flex-row">
                {/* First Name */}
                <div className= "flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor= "firstname" className= "lable-style">
                        First Name
                    </label>

                    <input
                        type= "text"
                        name= "firstname"
                        id= "firstname"
                        placeholder= "Enter first name"
                        className= "form-style"
                        {...register("firstname", { required: true })}
                    />
                    {/*  */}
                    {errors.firstname && (
                                            <span className= "-mt-1 text-[12px] text-yellow-100">
                                                Please enter your Name
                                            </span>
                                        )
                    }
                </div>

                {/* Last Name */}
                <div className= "flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor= "lastname" className="lable-style">
                        Last Name
                    </label>

                    <input
                        type= "text"
                        name= "lastname"
                        id= "lastname"
                        placeholder= "Enter last name"
                        className= "form-style"
                        {...register("lastname")}
                    />
                </div>
            </div>
            
            {/* Email */}
            <div className= "flex flex-col gap-2">
                <label htmlFor= "email" className= "lable-style">
                    Email Address
                </label>
                <input
                    type= "email"
                    name= "email"
                    id= "email"
                    placeholder= "Enter email address"
                    className= "form-style"
                    {...register("email", { required: true })}
                />
                {errors.email && (
                                    <span className= "-mt-1 text-[12px] text-yellow-100">
                                        Please enter your Email Address
                                    </span>
                                )
                }
            </div>
            
            {/* Phone Number */}
            <div className= "flex flex-col gap-2">
                <label htmlFor= "phonenumber" className= "lable-style">
                    Phone Number
                </label>

                <div className= "flex gap-5">
                    {/* Country Codes */}
                    <div className= "flex w-[81px] flex-col gap-2">
                        <select
                            type= "text"
                            name= "firstname"
                            id= "firstname"
                            placeholder= "Enter first name"
                            className= "form-style"
                            {...register("countrycode", { required: true })}
                        >
                            {CountryCode.map((element, index) => {
                                return (
                                    <option key= {index} value= {element.code}>
                                        {element.code} - {element.country}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    
                    {/* Phone Number */}
                    <div className= "flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type= "tel"
                            name= "phonenumber"
                            id= "phonenumber"
                            placeholder= "12345 67890"
                            className= "form-style"
                            {...register("phoneNo", {
                                required: {
                                    value: true,
                                    message: "Please enter your phone number",
                                },
                                minLength: { value: 10, message: "Invalid Phone Number" },
                                maxLength: { value: 12, message: "Invalid Phone Number" }
                            })}
                        />
                    </div>
                </div>

                {errors.phoneNo && (
                                    <span className= "-mt-1 text-[12px] text-yellow-100">
                                        {/* Min, Max or Empty errors */}
                                        {errors.phoneNo.message}
                                    </span>
                                   )
                }
            </div>

            {/* Message */}
            <div className= "flex flex-col gap-2">
                <label htmlFor= "message" className= "lable-style">
                    Message
                </label>

                <textarea
                    name= "message"
                    id= "message"
                    cols= "30"
                    rows= "7"
                    placeholder= "Enter your message here"
                    className= "form-style"
                    {...register("message", { required: true })}
                />
                {errors.message && (
                                    <span className="-mt-1 text-[12px] text-yellow-100">
                                        Please enter your Message
                                    </span>
                                   )
                }
            </div>

            <button
                disabled= {loading}
                type= "submit"
                className= {`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black
                            shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] disabled:bg-richblack-500 sm:text-[16px]
                            ${!loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"}`}
            >
                Send Message
            </button>            
        </form>
    )
};

// Export
export default ContactUsForm;
