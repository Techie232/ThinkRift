const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require('../models/User');
const Section = require('../models/Section')
const SubSection = require('../models/SubSection');
const CourseProgress = require('../models/CourseProgress');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { PiCurrencyDollarSimpleDuotone } = require("react-icons/pi");
const { convertSecondsToDuration } = require("../utils/secToDuration")

// create course handler function
exports.createCourse = async (req, res) => {

   try {
      //fetch data
      const { courseName, courseDescription, whatYouWillLearn, price, category, status = 'Draft' } = req.body;
      let { tag, instructions } = req.body;

      tag = JSON.parse(tag);
      instructions = JSON.parse(instructions);

      // get thumbnail
      const thumbnail = req.files.thumbnailImage;

      // validation
      if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !tag || !instructions) {
         return res.status(400).json({
            success: false,
            message: "All fields are required",
         })
      }

      // check for instructor
      const userId = req.user.id;
      const instructorDetails = await User.findById(userId);

      //todo TODO : Verify that userId and instructorDetails._id are same or not -> For this the answer is if someone by passes the middleware then the id will not be in the req.user.id so we have to explicity find it and that's why we have used db call here

      if (!instructorDetails) {
         return res.status(400).json({
            success: false,
            message: "instructor details are required",
         })
      }

      // check for given Category is valid or not
      const categoryDetails = await Category.findById(category);
      if (!categoryDetails) {
         return res.status(400).json({
            success: false,
            message: "Category details are required",
         })
      }

      // Upload image to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

      // create an entry for new course
      const newCourse = await Course.create({
         courseName,
         courseDescription,
         instructor: instructorDetails._id,
         whatYouWillLearn,
         price,
         tag,
         Category: categoryDetails._id,
         status,
         thumbnail: thumbnailImage.secure_url,
         instructions
      })

      // add the new course to the user schema of instructor
      await User.findByIdAndUpdate(
         { _id: instructorDetails._id },
         { $push: { courses: newCourse._id } },
         { new: true },
      )

      await Category.findByIdAndUpdate(
         { _id: category },
         { $push: { course: newCourse._id } },
         { new: true },
      );

      // return response
      return res.status(200).json({
         success: true,
         message: "Course created Successfully",
         data: newCourse,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Failed to create Course!',
         error: error.message,
      })
   }
}

exports.editCourse = async (req, res) => {
   try {

      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)

      if (!course) {
         return res.status(404).json({
            error: "Course not found"
         })
      }

      // If Thumbnail Image is found, update it
      if (req.files) {
         const thumbnail = req.files.thumbnailImage
         const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
         )
         course.thumbnail = thumbnailImage.secure_url
      }

      // Update only the fields that are present in the request body
      for (const key in updates) {
         if (updates.hasOwnProperty(key)) {
            if (key === "tag" || key === "instructions") {
               course[key] = JSON.parse(updates[key])
            }
            else if (key === 'Category') {
               // Remove the course from the old category
               await Category.findByIdAndUpdate(
                  { _id: course.Category },
                  { $pull: { course: courseId } }
               )

               const categoryDetails = await Category.findById(updates[key]);
               if (!categoryDetails) {
                  return res.status(400).json({
                     success: false,
                     message: "Category details are required",
                  })
               }
               course[key] = categoryDetails._id;

               // Add the course to the new category
               await Category.findByIdAndUpdate(categoryDetails._id, {
                  $push: { course: courseId }
               })
            }
            else {
               course[key] = updates[key]
            }
         }
      }

      await course.save()

      const updatedCourse = await Course.findOne({
         _id: courseId,
      })
         .populate({
            path: "instructor",
            populate: {
               path: "additionalDetails",
            },
         })
         .populate("Category")
         .populate("ratingAndReview")
         .populate({
            path: "courseContent",
            populate: {
               path: "subSection",
            },
         })
         .exec()

      res.json({
         success: true,
         message: "Course updated successfully",
         data: updatedCourse,
      })

   } catch (error) {
      console.error(error)
      res.status(500).json({
         success: false,
         message: "Failed to update course",
         error: error.message,
      })
   }
}

exports.getInstructorCourses = async (req, res) => {
   try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id;

      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
         instructor: instructorId,
      }).sort({ createdAt: -1 })

      // Return the instructor's courses
      res.status(200).json({
         success: true,
         data: instructorCourses,
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({
         success: false,
         message: "Failed to retrieve instructor courses",
         error: error.message,
      })
   }
}

// get all courses handler function
exports.getAllCourses = async (req, res) => {

   try {
      const allCourses = await Course.find({},
         {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true,
         })
         .populate('instructor').exec();

      return res.status(200).json({
         success: true,
         message: 'Data for all courses fetched Successfully',
         data: allCourses,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Cannot fetch all course data!',
         error: error.message,
      })
   }
}

// get course details
exports.getCourseDetails = async (req, res) => {
   try {

      const { courseId } = req.body
      const courseDetails = await Course.findOne({ _id: courseId, })
         .populate({
            path: "instructor",
            populate: {
               path: "additionalDetails",
            },
         })
         .populate("Category")
         .populate("ratingAndReview")
         .populate({
            path: "courseContent",
            populate: {
               path: "subSection",
               select: "-videoUrl",
            },
         })
         .exec()

      if (!courseDetails) {
         return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
         })
      }

      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }

      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
         content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
         })
      })

      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      return res.status(200).json({
         success: true,
         data: {
            courseDetails,
            totalDuration,
         },
      })
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not get course details',
         error: error.message,
      })
   }
}

exports.deleteCourse = async (req, res) => {
   try {
      const { courseId } = req.body;

      // Find the course
      const course = await Course.findById(courseId);

      if (!course) {
         return res.status(404).json({
            success: false,
            message: "Course not found"
         })
      }

      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled;
      for (const studentId of studentsEnrolled) {
         await User.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId }
         })
      }

      // Delete Sections and Sub-sections
      const courseSections = course.courseContent;
      for (const sectionId of courseSections) {
         // delete Sub-sections of the section
         const section = await Section.findById(sectionId);
         if (section) {
            const subSections = section.subSection;
            for (const subSectionId of subSections) {
               await SubSection.findByIdAndDelete(subSectionId);
            }
         }

         await Section.findByIdAndDelete(sectionId);
      }

      await Category.findByIdAndUpdate(
         { _id: course.Category },
         {
            $pull: { course: courseId }
         }
      )

      // Delete the course
      await Course.findByIdAndDelete(courseId);

      return res.status(200).json({
         success: true,
         message: "Course deleted successfully",
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Could not delete the Course",
         error: error.message,
      })
   }
}

exports.getFullCourseDetails = async (req, res) => {
   try {

      const { courseId } = req.body
      const userId = req.user.id

      const courseDetails = await Course.findOne({
         _id: courseId,
      })
         .populate({
            path: "instructor",
            populate: {
               path: "additionalDetails",
            },
         })
         .populate("Category")
         .populate("ratingAndReview")
         .populate({
            path: "courseContent",
            populate: {
               path: "subSection",
            },
         })
         .exec()

      let courseProgressCount = await CourseProgress.findOne({
         courseID: courseId,
         userId: userId,
      })

      if (!courseDetails) {
         return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
         })
      }

      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }

      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
         content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
         })
      })

      // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      return res.status(200).json({
         success: true,
         data: {
            courseDetails,
            // totalDuration,
            completedVideos: courseProgressCount?.completedVideos
               ? courseProgressCount?.completedVideos
               : [],
         },
      })
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not get full course details',
         error: error.message,
      })
   }
}