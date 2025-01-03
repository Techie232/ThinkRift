import React from 'react';
import HighlightText from './HighlightText';
import know_your_progress from '../../../assets/Images/Know_your_progress.png';
import compare_with_others from '../../../assets/Images/Compare_with_others.png';
import plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png';
import CTAButton from './Button';

const LearningLanguageSection = () => {
   return (
      <div className='mt-[130px] mb-32'>
         <div className='flex flex-col gap-5 items-center'>
            <div className='text-4xl font-semibold text-center'>
               <h2>Your swiss knife for
                  <HighlightText text={'learning any language'} />
               </h2>
            </div>

            <div className='text-center text-richblack-600 text-base mt-3 w-[80%] font-medium'>
               Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
               progress tracking, custom schedule and more.
            </div>

            <div className='flex items-center justify-center mt-5'>
               <img
                  src={know_your_progress}
                  alt='know your progress Image'
                  className='object-contain -mr-32'
               />
               <img
                  src={compare_with_others}
                  alt='compare with others Image'
                  className='object-contain'
               />
               <img
                  src={plan_your_lessons}
                  alt='plan your lessons Image'
                  className='object-contain -ml-32'
               />
            </div>


            <div className='-mt-10'>
               <CTAButton active={true} linkto={'/signup'}>
                  Learn More
               </CTAButton>
            </div>

         </div>
      </div>
   )
}

export default LearningLanguageSection