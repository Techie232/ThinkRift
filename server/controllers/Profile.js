const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.updateProfile = async (req, res) => {
   try {
      const {
         firstName = "",
         lastName = "",
         dateOfBirth = "",
         about = "",
         contactNumber = "",
         gender = "",
      } = req.body;

      const id = req.user.id

      // Find the profile by id
      const userDetails = await User.findById(id)
      const profile = await Profile.findById(userDetails.additionalDetails)

      const user = await User.findByIdAndUpdate(
         id,
         {
            firstName,
            lastName,
         }
      )

      await user.save()

      // Update the profile fields
      profile.dateOfBirth = dateOfBirth
      profile.about = about
      profile.contactNumber = contactNumber
      profile.gender = gender

      // Save the updated profile
      await profile.save()

      // Find the updated user details
      const updatedUserDetails = await User.findById(id)
         .populate("additionalDetails")
         .exec()

      return res.json({
         success: true,
         message: "Profile updated successfully",
         updatedUserDetails,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Profile cannot be updated',
         error: error.message,
      })
   }
}

exports.deleteAccount = async (req, res) => {

   try {
      // get_id
      const id = req.user.id;

      // validation
      const userDetails = await User.findById(id);

      if (!userDetails) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
         })
      }

      // delete profile
      await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

      for (const courseId of userDetails.courses) {
         await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnroled: id } },
            { new: true }
         )
      }

      // delete user
      await User.findByIdAndDelete({ _id: id });

      // return reponse
      return res.status(200).json({
         success: true,
         message: 'User deleted Successfully',
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'User cannot be deleted',
         error: error.message,
      })
   }
}

exports.getAllUserDetails = async (req, res) => {

   try {
      // get id
      const id = req.user.id;

      // validation and get user details
      const userDetails = await User.findById(id).populate('additionalDetails').exec();

      // return response
      return res.status(200).json({
         success: true,
         message: 'User Data Fetched Successfully',
         userDetails,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'User Data cannot be fetched',
         error: error.message,
      })
   }
}

exports.updateDisplayPicture = async (req, res) => {
   try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;

      const imageUpload = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME);

      const updatedProfile = await User.findByIdAndUpdate(
         { _id: userId },
         {
            image: imageUpload.secure_url,
         },
         { new: true },
      );

      return res.status(200).json({
         success: true,
         message: "Image updated Successfully",
         data: updatedProfile,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Could not update dipaly picture",
         error: error.message,
      })
   }
}

exports.getEnrolledCourses = async (req, res) => {
   try {
      const userId = req.user.id
      let userDetails = await User.findOne({
         _id: userId,
      })
         .populate({
            path: "courses",
            populate: {
               path: "courseContent",
               populate: {
                  path: "subSection",
               },
            },
         })
         .exec()

      userDetails = userDetails.toObject();

      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
         let totalDurationInSeconds = 0
         SubsectionLength = 0
         for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
               j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
               totalDurationInSeconds
            )
            SubsectionLength +=
               userDetails.courses[i].courseContent[j].subSection.length
         }

         let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
         })

         courseProgressCount = courseProgressCount?.completedVideos.length
         if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
         } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
               Math.round(
                  (courseProgressCount / SubsectionLength) * 100 * multiplier
               ) / multiplier
         }
      }

      if (!userDetails) {
         return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
         })
      }

      return res.status(200).json({
         success: true,
         data: userDetails.courses,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not fetch Enrolled Courses',
         error: error.message,
      })
   }
}

exports.instructorDashboard = async (req, res) => {
   try {
      const courseDetails = await Course.find({
         instructor: req.user.id
      })

      const courseData = courseDetails.map((course) => {
         const totalStudentsEnrolled = course.studentsEnrolled.length
         const totalAmountGenerated = totalStudentsEnrolled * course.price

         // Create a new object with the additional fields
         const courseDataWithStats = {
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            totalStudentsEnrolled,
            totalAmountGenerated,
         }
         return courseDataWithStats
      })

      return res.status(200).json({
         success: true,
         courses: courseData
      })

   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Could not fetch data for Instructor Dashbaord",
         error: error.message,
      })
   }
}