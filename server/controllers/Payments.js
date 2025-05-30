const { instance } = require('../config/razorpay');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrolmentEmail");
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail')
const crypto = require('crypto');
const CourseProgress = require('../models/CourseProgress');

// initiate the razorpay order
exports.capturePayment = async (req, res) => {

   const { courses } = req.body;
   const userId = req.user.id;

   if (!courses || courses.length === 0) {
      return res.status(400).json({
         success: false,
         message: 'Please provide Course IDs',
      })
   }

   let totalAmount = 0;

   for (const course_id of courses) {
      let course;
      try {
         course = await Course.findById(course_id);

         if (!course) {
            return res.status(400).json({
               success: false,
               message: 'Could not find the Course',
            })
         }

         const uid = new mongoose.Types.ObjectId(userId);

         if (course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({
               success: false,
               message: 'Student is already Enrolled',
            })
         }

         totalAmount += course.price;

      } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
         })
      }
   }

   const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: Math.random(Date.now()).toString(),
   };

   try {
      // Initiate the payment using Razorpay instance
      const paymentResponse = await instance.orders.create(options);

      return res.status(200).json({
         success: true,
         data: paymentResponse,
         message: 'Order initiated Successfully'
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not Initiate Order',
         error: error.message,
      })
   }
}

// verify the payment
exports.verifyPayment = async (req, res) => {

   const razorpay_order_id = req.body?.razorpay_order_id;
   const razorpay_payment_id = req.body?.razorpay_payment_id;
   const razorpay_signature = req.body?.razorpay_signature;
   const courses = req.body?.courses
   const userId = req.user.id;

   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
      return res.status(500).json({
         success: false,
         message: "Payment Failed",
      })
   }

   let body = razorpay_order_id + "|" + razorpay_payment_id;

   const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');


   if (expectedSignature === razorpay_signature) {
      // enroll krwao student ko
      await enrollStudents(courses, userId);

      // return res
      return res.status(200).json({
         success: true,
         message: 'Payment Verified!',
      })
   }
   return res.status(500).json({
      success: false,
      message: "Payment Failed",
   })
}

const enrollStudents = async (courses, userId) => {

   if (!courses || !userId) {
      return res.status(400).json({
         success: false,
         message: 'You should provide the courses and userId'
      })
   }

   for (const courseId of courses) {

      try {
         // find the course and enroll student in that
         const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { studentsEnrolled: userId } },
            { new: true }
         )

         if (!enrolledCourse) {
            return res.status(500).json({
               success: false,
               message: "Course not Found",
            })
         }

         const courseProgress = await CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: [],
         })

         const enrolledStudent = await User.findByIdAndUpdate(userId,
            {
               $push: {
                  courses: courseId,
                  courseProgress: courseProgress._id,
               }
            },
            { new: true }
         )

         // send mail to the student
         const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName + enrolledStudent.lastName}`)
         )

      } catch (error) {
         console.log('error in enrolling student', error);
      }
   }
}

exports.sendPaymentSuccessEmail = async (req, res) => {

   const { orderId, paymentId, amount } = req.body;

   const userId = req.user.id;

   if (!orderId || !paymentId || !amount || !userId) {
      return res.status(404).json({
         success: false,
         message: "Please Provide all the details",
      })
   }

   try {
      // student ko dhundho 
      const enrolledStudent = await User.findById(userId);

      await mailSender(
         enrolledStudent.email,
         `Payment Received`,
         paymentSuccessEmail(enrolledStudent.firstName + enrolledStudent.lastName,
            amount / 100,
            orderId,
            paymentId
         )
      )

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Could not send Mail",
         error: error.message,
      })
   }
}