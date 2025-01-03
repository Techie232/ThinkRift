import React from "react"
import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactPage/ContactDetails"
import ContactUsForm from "../components/ContactPage/ContactUsForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
   return (
      <div>
         <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
            {/* Contact Details */}
            <div className="lg:w-[40%]">
               <ContactDetails />
            </div>

            {/* Contact Form */}
            <div className="lg:w-[60%] border border-richblack-400 rounded-xl p-10">
               <h2 className="text-4xl font-semibold">Got a Idea? We've got the skills.<br /> Let's team up</h2>
               <p className="mt-3 mb-10 text-richblack-200 text-lg">Tell us more about yourself and what you're got in mind.</p>
               <ContactUsForm />
            </div>
         </div>
         <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Reviws from Other Learner */}
            <h1 className=" mt-8">
               <ReviewSlider />
            </h1>
         </div>
         <Footer />
      </div>
   )
}

export default Contact