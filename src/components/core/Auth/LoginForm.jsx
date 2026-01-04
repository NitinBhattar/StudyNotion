import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { login } from "../../../services/Operations/authAPI.js";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Input Fields
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Runs on every re-render, so updates themselves
    const {email, password} = formData;
    const [showPassword, setShowPassword] = useState(false);

    // For req.body
    // Change handler
    const handleOnChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    };

    // Form submit
    const handleOnSubmit = (event) => {
        event.preventDefault();
        dispatch(login(email, password, navigate));
    };

    return (
        <form
            onSubmit= {handleOnSubmit}
            className= "mt-6 flex w-full flex-col gap-y-4"
        >   
            {/* Email */}
            <label className= "w-full">
                <p className= "mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Email Address <sup className= "text-pink-200">*</sup>
                </p>
                <input
                    required
                    type= "text"
                    name= "email"
                    value= {email}
                    onChange= {handleOnChange}
                    placeholder= "Enter email address"
                    className= "form-style w-full"
                />
            </label>

            {/* Password */}
            <label className= "relative">
                <p className= "mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Password <sup className= "text-pink-200">*</sup>
                </p>
                {/* Field */}
                <input
                    required
                    type= {showPassword ? "text" : "password"}
                    name= "password"
                    value= {password}
                    onChange= {handleOnChange}
                    placeholder= "Enter Password"
                    className= "form-style w-full pr-10!"
                />
                {/* EyeButton */}
                <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] z-10 cursor-pointer"
                >
                    {showPassword ? ( <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) 
                                  : (<AiOutlineEye fontSize={24} fill="#AFB2BF" /> )}
                </span>

                {/* Forgot Password Button */}
                <Link to= {"/forgot-password"}>
                    <p className= "mt-1 ml-auto max-w-max text-xs text-blue-100">
                        Forgot Password
                    </p>
                </Link>
            </label>

            {/* SignIn Button */}
            <button
                type= "submit"
                className= "mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
            >
                Sign In
            </button>

        </form>
    )
};

// Export
export default LoginForm;
