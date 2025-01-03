const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

// create rating
exports.createRating = async (req, res) => {

   try {
      // get user id
      const userId = req.user.id;

      // fetch data from req body
      const { rating, review, courseId } = req.body;

      // check if user is enrolled or not
      const courseDetails = await Course.findOne(
         {
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
         }
      );

      if (!courseDetails) {
         return res.status(404).json({
            success: false,
            message: "Student is not enrolled in this course",
         })
      }

      // check if user already reviewed the course
      const alreadyReview = await RatingAndReview.findOne(
         {
            user: userId,
            course: courseId,
         }
      );

      if (alreadyReview) {
         return res.status(403).json({
            success: false,
            message: "Course is already reviewed by the User",
         })
      }

      // create rating and review
      const ratingReview = await RatingAndReview.create({
         rating,
         review,
         user: userId,
         course: courseId,
      })

      // update course with this rating and review
      const updatedCourseDetails = await Course.findByIdAndUpdate(
         { _id: courseId },
         {
            $push: { ratingAndReview: ratingReview._id }
         },
         { new: true },
      )

      // return response
      return res.status(200).json({
         success: true,
         message: "Rating and Review Created Successfully",
         ratingReview,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Rating and Review cannot be created',
         error: error.message,
      })
   }
}

// get average rating
exports.getAverageRating = async (req, res) => {
   try {
      // get course id
      const courseId = req.body.courseId;

      // calculate avg rating
      const result = await RatingAndReview.aggregate(
         // finding criteria
         {
            $match: {
               //  new mongoose.Types.ObjectId(courseId) -> from string to objectId
               course: new mongoose.Types.ObjectId(courseId),
            }
         },
         // grouping criteria
         {
            $group: {
               _id: null, // by this i grouped all the entries in single group
               averageRating: { $avg: "$rating" },
            }
         }
      )

      // return rating
      if (result.length > 0) {
         return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,
         })
      }

      // if no rating/review exist
      return res.status(200).json({
         success: true,
         message: 'Average Rating is 0, no ratings given till now',
         averageRating: 0,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: error.message,
      })
   }
}

// get all rating and review
exports.getAllRatingAndReviews = async (req, res) => {

   try {
      const allReview = await RatingAndReview.find({}).sort({ rating: 'desc' })
         .populate({
            path: 'user',
            select: "firstName lastName email image", // populating specified fields from the obj. true true method is just same like this but with different syntax
         }).populate({
            path: 'course',
            select: 'courseName',
         }).exec();

      return res.status(200).json({
         success: true,
         message: 'All reviews fetched Successfully',
         data: allReview,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not fetch reviews',
         error: error.message,
      })
   }
}