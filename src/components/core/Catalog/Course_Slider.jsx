// Import
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import Course_Card from "./Course_Card.jsx"

const Course_Slider = ({ Courses }) => {

    return (
        <div className= "">
        {
            Courses?.length
            ? (
                <div className= "max-h-[30rem] overflow-visible">
                    <Swiper
                        slidesPerView= "auto"
                        spaceBetween= {25}
                        modules= {[FreeMode, Pagination]}
                        freeMode= {true}
                        autoplay= {{
                            delay: 2000,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            1024: {
                                slidesPerView: 3
                            }
                        }}
                        className= "max-h-[30rem]"
                    >
                    {
                        Courses?.map((course, index) => (
                            <SwiperSlide key= {index}>
                                <Course_Card course= {course} Height= {"h-[250px]"} />
                            </SwiperSlide>
                        ))
                    }
                    </Swiper>
                </div>
              )
            : (
                <p className= "text-xl text-richblack-5">No Course Found</p>
              )
        }
        </div>
    )
};

// Export
export default Course_Slider
