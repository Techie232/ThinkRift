import React from 'react';
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timelineImage from '../../../assets/Images/TimelineImage.png';

const timeline = [
   {
      Logo: Logo1,
      Heading: "Leadership",
      Description: "Fully committed to the success company",
   },
   {
      Logo: Logo2,
      Heading: "Responsibility",
      Description: "Students will always be our top priority",
   },
   {
      Logo: Logo3,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skills",
   },
   {
      Logo: Logo4,
      Heading: "Solve the problem",
      Description: "Code your way to a solution",
   },
]

const TimelineSection = () => {
   return (
      <div>
         <div className='flex flex-col md:flex-row md:gap-28 items-center'>

            <div className='w-[45%] flex flex-col mb-10 gap-5'>

               {
                  timeline.map((element, index) => {
                     return (
                        <div className='flex gap-6 mt-6' key={index}>
                           <div className='w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full'>
                              <img src={element.Logo} />
                           </div>

                           <div>
                              <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                              <p className='text-base'>{element.Description}</p>
                           </div>
                        </div>
                     )
                  })
               }

            </div>

            <div className='relative shadow-blue-200'>

               <img
                  src={timelineImage}
                  alt='timelineimage'
                  className='w-full max-w-[450px] h-auto rounded-md object-cover shadow-white'
               />


               <div className='absolute bg-caribbeangreen-700 flex text-white uppercase py-7 px-20
               left-[50%] translate-x-[-50%] translate-y-[-100%]'>
                  <div className='flex gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                     <p className='text-3xl font-bold'>10</p>
                     <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                  </div>

                  <div className='flex gap-5 items-center px-7'>
                     <p className='text-3xl font-bold'>250</p>
                     <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                  </div>

               </div>

            </div>

         </div>
      </div>
   )
}

export default TimelineSection