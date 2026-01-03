// Import
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
    return (
        <div className= "w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar />
            <Routes>
                <Route path= "/" element= {<Home />} />
            </Routes>
        </div>
    )
};

// Export
export default App;
