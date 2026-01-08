// Import
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import { updateDisplayPicture } from "../../../../services/Operations/SettingsAPI.js";
import IconBtn from "../../../common/IconBtn.jsx";

const ChangeProfilePicture = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth );
    const { user } = useSelector( (state) => state.profile );
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewSource, setPreviewSource] = useState(null);

    // Triggers file picker, ref is used for that
    const fileInputRef = useRef(null);

    const handleSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Change both
        if(file) {
            setProfileImage(file);
            previewFile(file);
        }
    };

    // Side Preview
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        // Set preview
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    // Call API on submit, setLoading for uploading...
    const handleFileUpload = () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("profileImage", profileImage);
            
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false);
            });
        } 
        catch(error) {
            console.error("Failed uploading new Display Picture: ", error);
        }
    };

    // previewFile runs again when profileImage is changed
    useEffect(() => {
        // Re-render
        if(profileImage) {
            previewFile(profileImage)
        }
    }, [profileImage]);

    return (
        <div className= "flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
            <div className= "flex items-center gap-x-4">
                <img
                    src= {previewSource || user?.image}
                    alt= {`profile-${user?.firstName}`}
                    className= "aspect-square w-[78px] rounded-full object-cover"
                />

                <div className= "space-y-2">
                    <p>Change Profile Picture</p>

                    <div className= "flex flex-row gap-3">
                        <input
                            type= "file"
                            ref= {fileInputRef}
                            onChange= {handleFileChange}
                            className= "hidden"
                            accept= "image/png, image/gif, image/jpeg"
                        />

                        <button
                            onClick= {handleSelect}
                            disabled={loading}
                            className= "cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                        >
                            Select
                        </button>

                        <IconBtn
                            text= {loading ? "Uploading..." : "Upload"}
                            onclick= {handleFileUpload}
                            disabled= {loading}
                        >
                            {!loading && (<FiUpload className= "text-lg text-richblack-900" />)}
                        </IconBtn>
                    </div>
                </div>
            </div>
        </div>
    )
};

// Export
export default ChangeProfilePicture;
