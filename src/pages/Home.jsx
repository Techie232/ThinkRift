import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
   return (
      <div className=' overflow-x-hidden'>
         {/* Section 1 */}
         <div className='relaive overflow-hidden mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between
         '>
            <Link to={'/signup'}>

               <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
               transition-all duration-200 hover:scale-95 w-fit '>
                  <div className='flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200
                  group-hover:bg-richblack-900'>
                     <p>Become a Student </p>
                     <FaArrowRight />
                  </div>
               </div>

            </Link>

            <div className='text-center text-4xl font-semibold mt-7'>
               Empower Your Future with
               <HighlightText text={'Coding Skills'} />
            </div>

            <div className='mt-4 w-[85%] text-center text-lg  text-richblack-300'>
               With our online coding courses, you can learn at your own pace, from anywhere in the
               world, and get access to a wealth of resources, including hands-on projects, quizzes, and
               personalized feedback from instructors.
            </div>

            <div className='flex gap-7 mt-8'>
               <CTAButton active={true} linkto={'/signup'}>
                  Learn More
               </CTAButton>

               <CTAButton active={false} linkto={'/login'}>
                  Book a Demo
               </CTAButton>
            </div>

            <div className='mx-20 my-12 w-full md:w-[85%] shadow-[0_-20px_50px_rgba(8,_112,_0,_0.7)]'>
               <video
                  muted
                  loop
                  autoPlay
               >
                  <source src={Banner} type='video/mp4' />
               </video>
            </div>

            {/* Code section 1 */}
            <div>
               <CodeBlocks
                  position={'lg:flex-row'}
                  heading={
                     <div className='text-4xl font-semibold'>
                        Unlock Your <HighlightText text={'coding potential '} />
                        with our online Courses
                     </div>
                  }

                  subheading={'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'}
                  ctabtn1={
                     {
                        btnText: 'Try it Yourself',
                        linkto: '/signup',
                        active: true,
                     }
                  }
                  ctabtn2={
                     {
                        btnText: 'Learn More',
                        linkto: '/login',
                        active: false,
                     }
                  }
                  codeblock={`<!DOCTYPE html>\n<html lang='en'>\n<head>\n<title>This is Sameem's Page</title>\n<link rel='stylesheet'href='style.css'>\n</head>\n<body>\n<h1><a href='/'>Header</a></h1>\n</body>\n</html>`}
                  codeColor={'text-yellow-25'}
                  backgroundGradient={<div className='codeblocks1 absolute'></div>}
               />
            </div>

            {/* Code section 2 */}
            <div>
               <CodeBlocks
                  position={'lg:flex-row-reverse'}
                  heading={
                     <div className='text-4xl font-semibold'>
                        Start <HighlightText text={'coding in seconds '} />
                     </div>
                  }

                  subheading={'Go ahead, give it a try. Our hands-on learning environment means you\'ll be writing real code from your very first lesson.'}
                  ctabtn1={
                     {
                        btnText: 'Continue Lesson',
                        linkto: '/signup',
                        active: true,
                     }
                  }
                  ctabtn2={
                     {
                        btnText: 'Learn More',
                        linkto: '/login',
                        active: false,
                     }
                  }
                  codeblock={`import React from 'react';\nimport CTAButton from './Button';\nimport TypeAnimation from 'react-type'\nimport { FaArrowRight } from 'react-icons/fa';\n\nconst Home = () => {\nreturn(\n<div>Home</div>\n)\n}\nexport default Home;`}
                  codeColor={'text-white-50'}
                  backgroundGradient={<div className='codeblocks2 absolute'></div>}
               />
            </div>

            <ExploreMore />

         </div>

         {/* Section 2 */}
         <div className='bg-pure-greys-5 text-richblack-700'>

            <div className='homepage_bg h-[313px]'>

               <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                  <div className='h-[150px]'></div>
                  <div className='flex gap-7 text-white'>
                     <CTAButton active={true} linkto={'./signup'}>
                        <div className='flex items-center gap-3'>
                           Explore Full Catalog
                           <FaArrowRight />
                        </div>
                     </CTAButton>

                     <CTAButton active={false} linkto={'./signup'}>
                        <div>
                           Learn More
                        </div>
                     </CTAButton>
                  </div>
               </div>
            </div>


            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

               <div className='flex flex-col w-full md:flex-row gap-5 justify-between mb-10 mt-[95px]'>
                  <div className='text-4xl font-semibold w-full md:w-[45%]'>
                     Get the skills you need for a
                     <HighlightText text={'Job that is in demand.'} />
                  </div>

                  <div className='flex flex-col gap-10 w-full md:w-[40%] items-start'>
                     <div className='text-16px'>The modern Thinkrift is the dictates its own terms. Today, to be a competitive specialist
                        requires more than professional skills.
                     </div>
                     <CTAButton active={true} linkto={'/signup'}>
                        <div>
                           Learn More
                        </div>
                     </CTAButton>
                  </div>
               </div>

               <TimelineSection />

               <LearningLanguageSection />

            </div>

         </div>

         {/* Section 3 */}
         <div className='w-11/12 flex bg-richblack-900 mx-auto max-w-maxContent flex-col items-center justify-between 
         gap-8 first-letter text-white'>
            <InstructorSection />
            <h2 className='text-center text-4xl font-semibold mt-10 '>Reviews from other learners</h2>
            <ReviewSlider />
         </div>

         {/* Footer */}
         <Footer />

      </div>
   )
}

export default Home