// Import
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";

const App = () => {
    return (
        <div className= "w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Routes>
                <Route path= "/" element= {<Home/>} />
            </Routes>
        </div>
    )
};

// Export
export default App;
