const Section = require("../models/Section");
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

exports.createSection = async (req, res) => {
   try {
      // data fetch
      const { sectionName, courseId } = req.body;

      // data validation
      if (!sectionName || !courseId) {
         return res.status(400).json({
            success: false,
            message: 'Missing Properties',
         })
      }

      // create section
      const newSection = await Section.create({ sectionName });

      // update course with section objectID
      const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
         {
            $push: { courseContent: newSection._id }
         },
         { new: true })
         .populate({
            path: 'courseContent',
            populate: {
               path: 'subSection',
            },
         })
         .exec();

      // return respone
      return res.status(200).json({
         success: true,
         message: 'Section created Successfully!',
         updatedCourse: updatedCourseDetails,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Unable to create Section, Please try again',
         error: error.message,
      })
   }
}

exports.updateSection = async (req, res) => {
   try {
      // data input
      const { sectionName, sectionId, courseId } = req.body;

      const section = await Section.findByIdAndUpdate(
         sectionId,
         { sectionName },
         { new: true }
      );

      const course = await Course.findById(courseId)
         .populate({
            path: "courseContent",
            populate: {
               path: "subSection",
            },
         })
         .exec();

      // return response
      return res.status(200).json({
         success: true,
         message: 'Section Updated Successfully!',
         data: course,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Unable to update Section, Please try again',
         error: error.message,
      })
   }
}

exports.deleteSection = async (req, res) => {
   try {
      const { sectionId, courseId } = req.body;

      await Course.findByIdAndUpdate(courseId, {
         $pull: {
            courseContent: sectionId,
         }
      })

      const section = await Section.findById(sectionId);
      if (!section) {
         return res.status(404).json({
            success: false,
            message: "Section not Found",
         })
      }

      //delete sub section
      await SubSection.deleteMany({ _id: { $in: section.subSection } });

      await Section.findByIdAndDelete(sectionId);

      //find the updated course and return 
      const course = await Course.findById(courseId).populate({
         path: "courseContent",
         populate: {
            path: "subSection"
         }
      })
         .exec();

      res.status(200).json({
         success: true,
         message: "Section deleted",
         data: course
      })

   } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({
         success: false,
         message: "Internal server error",
         error: error.message,
      });
   }
};    