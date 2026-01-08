// Import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { deleteProfile } from "../../../../services/Operations/SettingsAPI.js";
import ConfirmationModal from "../../../common/ConfirmationModal.jsx";

const DeleteAccount = () => {
    // From slices
    const { token } = useSelector( (state) => state.auth );
    const dispatch = useDispatch();

    // To keep track of confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();

    return (
        <div className= "">
            {/* Delete Section */}
            <div className= "my-10 flex flex-row gap-x-5 rounded-md border border-pink-700 bg-pink-900 p-8 px-12">
                <div className= "flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
                    <FiTrash2 className= "text-3xl text-pink-200" />
                </div>

                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-richblack-5">
                        Delete Account
                    </h2>

                    <div className="w-3/5 text-pink-25">
                        <p className= "">Would you like to delete account?</p>
                        <p className= "">
                            This account may contain Paid Courses. Deleting your account is
                            permanent and will remove all the contain associated with it.
                        </p>
                    </div>

                    <button
                        type= "button"
                        className= "w-fit cursor-pointer italic text-pink-300"
                        onClick={() =>
                            setConfirmationModal({
                                text1: "Are you sure?",
                                text2: "Your account will be deleted permanently.",
                                btn1Text: "Delete Account",
                                btn2Text: "Cancel",
                                btn1Handler: () =>  dispatch(deleteProfile(token, navigate)),
                                btn2Handler: () => setConfirmationModal(null)
                            })
                        }
                    >
                        I want to delete my account.
                    </button>
                </div>
            </div>

            {/* Modal */}
            <div className= "">
                {confirmationModal && <ConfirmationModal modalData= {confirmationModal} />}
            </div>
        </div>
    )
};

// Export
export default DeleteAccount;
