// Import
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const Upload = ({
    name,
    label,
    register,
    setValue,
    errors,
    video = false,
    viewData = null,
    editData = null
}) => {
    // States to keep track of seleected file and its preview
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "");

    // Preview file
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // State update
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    };

    // Trigger preview fle function
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if(file) {
            previewFile(file);
            setSelectedFile(file);
        }
    }

    // Dropzone config, decide formats
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
                ? { "image/*": [".jpeg", ".jpg", ".png"] }
                : { "video/*": [".mp4", ".mkv"] }, onDrop
    });

    // UI changes
    useEffect(() => {
        register(name, { required: true })
    }, [register]);

    // For videp
    useEffect(() => {
        setValue(name, selectedFile)
    }, [selectedFile, setValue]);

    return (
        <div className= "flex flex-col space-y-2">
            <label className= "text-sm text-richblack-5" htmlFor={name}>
                {/* View mode off */}
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>

            <div
                className= {`flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500
                ${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}`}
            >
                {   
                    // View or Edit mode
                    previewSource
                    ? (
                        <div className= "flex w-full flex-col p-6">
                            {
                                !video
                                // Image is placed in drop zone
                                ? (
                                    <img
                                        src= {previewSource}
                                        alt= "Preview"
                                        className= "h-full w-full rounded-md object-cover"
                                    />
                                  )
                                // Video is placed in drop zone
                                : (
                                    <div style= {{ aspectRatio: "16 / 9" }}>
                                        <video
                                            src={previewSource}
                                            controls
                                            className="w-full h-full rounded-md"
                                            playsInline
                                        />
                                    </div>
                                  )
                            }
                            {
                                !viewData && (  
                                                // Cancel Button
                                                <button
                                                    type= "button"
                                                    onClick= {() => {
                                                        // Reset dropzone 
                                                        setPreviewSource("")
                                                        setSelectedFile(null)
                                                        setValue(name, null)
                                                    }}
                                                    className= "mt-3 text-richblack-400 underline"
                                                >
                                                    Cancel
                                                </button>
                                              )
                            }
                        </div>
                      ) 
                    :
                    // Upload in dropzone, no file currently
                    (
                        <div
                            className= "flex w-full flex-col items-center p-6"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />

                            <div className= "grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                                <FiUploadCloud className= "text-2xl text-yellow-50" />
                            </div>

                            <p className= "mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                                Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                                <span className= "font-semibold text-yellow-50">Browse{" "}</span>
                                a file
                            </p>

                            <ul className= "mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                                <li className= "">Aspect ratio 16:9</li>
                                <li className= "">Recommended size 1024x576</li>
                            </ul>
                        </div>
                    )
                }
            </div>
            {errors[name] && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    {label} is required
                                </span>
                             )}
        </div>
    )
};

// Export
export default Upload;
