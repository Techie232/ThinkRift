import React, { useEffect, useState } from "react"
import ReactStars from "react-stars"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
   const [reviews, setReviews] = useState([])
   const truncateWords = 15

   useEffect(() => {
      ; (async () => {
         const { data } = await apiConnector(
            "GET",
            ratingsEndpoints.REVIEWS_DETAILS_API
         )
         if (data?.success) {
            setReviews(data?.data)
         }
      })()
   }, [])

   return (
      <div className="text-white">
         <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
            <Swiper
               slidesPerView={reviews.length >= 3 ? 3 : 2}
               loop={true}
               spaceBetween={20}
               autoplay={{
                  delay: 1500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter : true,
               }}
               modules={[Autoplay, Pagination, Navigation]}
            >
               {reviews.map((review, i) => {
                  return (
                     <SwiperSlide key={i} className="flex items-center justify-center">
                        <div className="w-[320px] h-[220px] border border-yellow-100 bg-richblack-800 rounded-lg p-4 flex items-center justify-center text-richblack-25">
                           <div className="flex flex-col items-center justify-center gap-3 text-center">
                              <img
                                 src={
                                    review?.user?.image
                                       ? review?.user?.image
                                       : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                 }
                                 alt=""
                                 className="h-9 w-9 rounded-full object-cover"
                              />
                              <div>
                                 <h1 className="font-semibold text-richblack-5">
                                    {`${review?.user?.firstName} ${review?.user?.lastName}`}
                                 </h1>
                                 <h2 className="text-[12px] font-medium text-richblack-500">
                                    {review?.course?.courseName}
                                 </h2>
                              </div>
                              <p className="font-medium text-richblack-25">
                                 {review?.review.split(" ").length > truncateWords
                                    ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                                    : `${review?.review}`}
                              </p>
                              <div className="flex items-center gap-2">
                                 <h3 className="font-semibold text-yellow-100">
                                    {review.rating.toFixed(1)}
                                 </h3>
                                 <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                 />
                              </div>
                           </div>
                        </div>
                     </SwiperSlide>

                  )
               })}
               {/* <SwiperSlide>Slide 1</SwiperSlide> */}
            </Swiper>

         </div>
      </div>
   )
}

export default ReviewSlider