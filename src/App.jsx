// Import
// Modules
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Catalog from "./pages/Catalog.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePAssword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import Error from "./pages/Error.jsx";

// Components
import Navbar from "./components/common/Navbar.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse.jsx"
import MyCourses from "./components/core/Dashboard/MyCourses.jsx";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse.jsx";
import Instructor from "./components/core/Dashboard/Instructor.jsx";
import Cart from "./components/core/Dashboard/Cart/Cart.jsx";
import Settings from "./components/core/Dashboard/Settings/Settings.jsx";
import VideoDetails from "./components/core/ViewCourse/VideoDetails.jsx";

// APIs
import { getUserDetails } from "./services/Operations/profileAPI.js";

// Utils
import { ACCOUNT_TYPE } from "./utils/constants.js";


const App = () => {
    // From slices
    const { user } = useSelector( (state) => state.profile );
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // User stays logged-in after closing website
    useEffect(() => {
        if (localStorage.getItem("token")) {
            const token = JSON.parse(localStorage.getItem("token"));
            dispatch(getUserDetails(token, navigate));
        }
    }, []);

    return (
        <div className= "w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar />
            <Routes>
                <Route path= {"/"} element= {<Home />} />
                <Route path= {"/about"} element= {<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route path="catalog/:catalogName" element={<Catalog />} />
                {/* For non-authenticated users */}
                <Route
                    path= {"signup"}
                    element= {
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>
                    }
                />
                <Route
                    path="verify-email"
                    element={
                        <OpenRoute>
                            <VerifyEmail />
                        </OpenRoute>
                    }
                />
                <Route
                    path= {"login"}
                    element= {
                        <OpenRoute>
                            <Login />
                        </OpenRoute>
                    }
                />
                <Route
                    path= "forgot-password"
                    element= {
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>
                    }
                />
                <Route
                    path="update-password/:id"
                    element={
                        <OpenRoute>
                            <UpdatePassword />
                        </OpenRoute>
                    }
                />

                {/* For authenticated users */}
                <Route
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    {/* Route authenticated users */}
                    <Route path="dashboard/my-profile" element= {<MyProfile />} />
                    <Route path="dashboard/Settings" element= {<Settings />} />

                    {/* For students only */}
                    {
                        user?.accountType == ACCOUNT_TYPE.STUDENT && (
                            <Route>
                                <Route path="dashboard/enrolled-courses" element= {<EnrolledCourses />} />
                                <Route path="dashboard/cart" element= {<Cart />} />
                            </Route>
                        )
                    }

                    {/* For instructors only */}
                    {
                        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                            <Route>
                                <Route path="dashboard/instructor" element={<Instructor />} />
                                <Route path="dashboard/my-courses" element={<MyCourses />} />
                                <Route path="dashboard/add-course" element={<AddCourse />} />
                                <Route
                                    path="dashboard/edit-course/:courseId"
                                    element={<EditCourse />}
                                />
                            </Route>
                        )
                    }
                </Route>

                {/* For the watching course lectures */}
                <Route
                    element={
                        <PrivateRoute>
                        <ViewCourse />
                        </PrivateRoute>
                    }
                >
                {
                    user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <Route
                        path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                        element={<VideoDetails />}
                    />
                )}
                </Route>

                {/* 404 Page */}
                <Route path="*" element={<Error />} />                
            </Routes>
        </div>
    )
};

// Export
export default App;
