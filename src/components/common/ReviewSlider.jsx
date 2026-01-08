// Import
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-stars";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import apiConnector from "../../services/apiConnector.js"
import { ratingsEndpoints } from "../../services/apis.js"


const ReviewSlider = () => {
    // States to keep track of reviews
    const [reviews, setReviews] = useState([]);
    const truncateWords = 15

    // To fetch reviews
    useEffect(() => {
        // API Call
        const reviewsAPI = async () => {
            const { data } = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API);
            if (data?.success) {
                setReviews(data?.data)
            }
        }

        reviewsAPI();
    }, []);

    return (
        <div className= "text-white">
            <div className= "my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
                {/* Swiper Config */}
                <Swiper
                    slidesPerView= {3}
                    spaceBetween= {25}
                    loop= {true} 
                    freeMode= {true}
                    autoplay= {{
                        delay: 2000,
                        disableOnInteraction: false
                    }}
                    modules= {[FreeMode, Pagination, Autoplay]}
                    className="w-full"
                >
                    {
                        reviews.map((review, index) => {
                            return (
                                // Each slice
                                <SwiperSlide key= {index}>
                                    <div className= "flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                                        <div className= "flex items-center gap-4">
                                            <img
                                                src= {
                                                    review?.user?.imageUrl
                                                    ? review.user.imageUrl
                                                    : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                                }
                                                alt= ""
                                                className= "h-9 w-9 rounded-full object-cover"
                                            />

                                            <div className= "flex flex-col">
                                                <h2 className= "font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h2>
                                                <h3 className= "text-[12px] font-medium text-richblack-500">
                                                    {review?.course?.courseName}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className= "font-medium text-richblack-25">
                                            {
                                                review?.review.split(" ").length > truncateWords
                                                ? `${review?.review
                                                   .split(" ")
                                                   .slice(0, truncateWords)
                                                   .join(" ")} ...`
                                                : `${review?.review}`
                                            }
                                        </p>

                                        <div className= "flex items-center gap-2 ">
                                            <h3 className= "font-semibold text-yellow-100">
                                                {review.rating.toFixed(1)}
                                            </h3>
                                            <ReactStars
                                                count= {5}
                                                value= {review.rating}
                                                size= {20}
                                                edit= {false}
                                                activeColor= "#ffd700"
                                                emptyIcon= {<FaStar />}
                                                fullIcon= {<FaStar />}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
};

// Export
export default ReviewSlider;
