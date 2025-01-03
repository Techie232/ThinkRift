import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import Course_Card from './Course_Card';


const CourseSlider = ({ Courses }) => {
   return (
      <>
         {
            Courses?.length ? (
               <Swiper
                  slidesPerView={1}
                  loop={true}
                  spaceBetween={20}
                  autoplay={{
                     delay: 1500,
                     disableOnInteraction: false,
                  }}
                  modules={[Autoplay, Pagination, Navigation]}
               >
                  {
                     Courses?.map((course, index) => (
                        <SwiperSlide key={index}>
                           <Course_Card course={course} Height={'h-[250px]'} />
                        </SwiperSlide>
                     ))
                  }
               </Swiper>
            ) : (
               <p>No Course Found</p >
            )
         }
      </>
   )
}

export default CourseSlider