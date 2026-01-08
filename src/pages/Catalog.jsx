// Import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import apiConnector from "../services/apiConnector.js";
import { categories } from "../services/apis.js";
import getCatalogPageData from "../services/Operations/pageAndComponentDatas.js";
import Footer from "../components/common/Footer.jsx";
import Course_Card from "../components/core/Catalog/Course_Card.jsx";
import Course_Slider from "../components/core/Catalog/Course_Slider.jsx";
import Spinner from "../components/common/Spinner.jsx";
import Error from "./Error.jsx";

const Catalog = () => {
    // From slices
    const { loading } = useSelector( (state) => state.profile );

    // Using params
    const { catalogName } = useParams();

    // States to keep track of active, catalog page data, categoryId
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    // Fetch all categories
    useEffect(() => {
        const allCategoriesAPI = async () => {
            try {
                // API Call
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                
                if(result) {
                    // Filter's out the _id of required category
                    const category_id = result.data.allCategories.filter((category) => category.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
                    setCategoryId(category_id);
                }
            }
            catch(error) {
                console.error("Could not fetch Categories: ", error);
            }
        };

        allCategoriesAPI();
    }, [catalogName]);

    useEffect(() => {
        if(categoryId) {
            const getCtPageData = async () => {
                try {  
                    // API Call
                    const result = await getCatalogPageData(categoryId);

                    console.log("catalog", result);

                    if(result) {
                        setCatalogPageData(result);
                    }
                }
                catch(error) {
                    console.error("Could not fetch catalog page data: ", error);
                }
            }

            getCtPageData();
        }
    }, [categoryId]);

    // When loading
    if (loading || !catalogPageData) {
        return (
            <div className= "grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        );
    }
    if (!loading && !catalogPageData.success) {
        return <Error />
    }

    return (
        <div className= "">
            {/* Hero Section */}
            <div className= "box-content bg-richblack-800 px-4">
                <div className= "mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className= "text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className= "text-yellow-25">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>

                    <p className= "text-3xl text-richblack-5">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </p>

                    <p className= "max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className= "mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>

                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 cursor-pointer
                                    ${active === 1
                                      ? "border-b border-b-yellow-25 text-yellow-25"
                                      : "text-richblack-50"}`}
                        onClick= {() => setActive(1)}
                    >
                        Most Populer
                    </p>

                    <p
                        className={`px-4 py-2 cursor-pointer
                                    ${active === 2
                                      ? "border-b border-b-yellow-25 text-yellow-25"
                                      : "text-richblack-50"}`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>

                <div className= "">
                    <Course_Slider Courses= {catalogPageData?.data?.selectedCategory?.courses}/>
                </div>
            </div>

            {/* Section 2 */}
            <div className= "mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className= "section_heading">
                    Top courses in other categories
                </div>

                <div className= "py-8">
                    <Course_Slider Courses= {catalogPageData?.data?.differentCategories?.filter(category => category.courses?.length > 0)?.flatMap(category => category.courses)} />
                </div>
            </div>

            {/* Section 3 */}
            <div className= "mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className= "section_heading">Frequently Bought</div>

                <div className= "py-8">
                    <div className= "grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {
                            catalogPageData?.data?.topSellingCourses?.slice(0, 4).map((course, index) => (
                                <Course_Card course= {course} key= {index} Height= {"h-[400px]"} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
};

// Export
export default Catalog
