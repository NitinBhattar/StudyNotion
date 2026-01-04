// Import
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePAssword.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.js";

const App = () => {
    return (
        <div className= "w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar />
            <Routes>
                <Route path= {"/"} element= {<Home />} />
                <Route path= {"/about"} element= {<About />} />
                <Route path="/contact" element={<Contact />} />

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

            </Routes>
        </div>
    )
};

// Export
export default App;
