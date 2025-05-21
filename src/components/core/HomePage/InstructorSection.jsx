import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './Button'
import { FaArrowRight } from 'react-icons/fa6'

const InstructorSection = () => {
   return (
      <div className='mt-16'>
         <div className='flex flex-col w-full md:flex-row gap-28 items-center'>

            <div className='w-[40%] md:w-[50%] flex mx-auto'>
               <img src={Instructor}
                  alt='instructor'
                  className=' rounded-xl'
                  width={400}
               />
            </div>

            <div className=' flex flex-col w-full items-center md:w-[50%] gap-10'>
               <div className='text-4xl font-semibold w-[50%] text-center'>
                  Become an
                  <HighlightText text={'Instructor'} />
               </div>   

               <p className='font-medium text-[16px] w-[85%] text-richblack-300'>Instructors from around the world teach millions
                  of students on Thinkrift. We provide the tools and skills to teach what you love.
               </p>

               <div className='w-fit'>
                  <CTAButton active={true} linkto={'/signup'}>
                     <div className='flex gap-3 items-center'>
                        Start Teaching Today
                        <FaArrowRight />
                     </div>
                  </CTAButton>
               </div>
            </div>

         </div>
      </div>
   )
}

export default InstructorSection