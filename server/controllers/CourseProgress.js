const SubSection = require('../models/SubSection');
const CourseProgress = require('../models/CourseProgress');

exports.updateCourseProgress = async (req, res) => {

   const { courseId, subSectionId } = req.body;
   const userId = req.user.id;

   try {
      // check if the subsection is valid
      const subsection = await SubSection.findById(subSectionId);

      if (!subsection) {
         return res.status(404).json({
            success: false,
            message: "Invalid Sub-Section",
         })
      }

      // check for Old Entry
      let courseProgress = await CourseProgress.findOne({
         courseID: courseId,
         userId: userId,
      })

      if (!courseProgress) {
         return res.status(404).json({
            success: false,
            message: "Course Progress does not Exist!",
         })
      }

      // check if user wants to mark complete that lecture which he has already marked as completed
      else {
         if (courseProgress.completedVideos.includes(subSectionId)) {
            return res.status(400).json({
               success: false,
               message: "Sub-Section already Completed",
            })
         }
         // pushed into completed video
         courseProgress.completedVideos.push(subSectionId);
      }
      await courseProgress.save();

      return res.status(200).json({
         success: true,
         message: "Course Progress Updated Successfully",
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Could not Update Course Progress",
         error: error.message
      })
   }
}