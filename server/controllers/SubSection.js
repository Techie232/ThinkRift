const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createSubSection = async (req, res) => {
   try {
      const { sectionId, title, description } = req.body
      const video = req.files.video;

      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || !video) {
         return res.status(404).json
            ({
               success: false,
               message: "All Fields are Required"
            })
      }

      // Upload the video file to Cloudinary
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create({
         title: title,
         timeDuration: uploadDetails.duration,
         description: description,
         videoUrl: uploadDetails.secure_url,
      })

      // Update the corresponding section with the newly created sub-section
      const updatedSection = await Section.findByIdAndUpdate(
         { _id: sectionId },
         { $push: { subSection: SubSectionDetails._id } },
         { new: true }
      ).populate("subSection").exec();

      // Return the updated section in the response
      return res.status(200).json({
         success: true,
         data: updatedSection
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "An error occurred while creating the sub-section",
         error: error.message,
      })
   }
}

exports.updateSubSection = async (req, res) => {
   try {
      const { sectionId, subSectionId, title, description } = req.body;
      const subSection = await SubSection.findById(subSectionId);

      if (!subSection) {
         return res.status(404).json({
            success: false,
            message: "SubSection not found",
         })
      }

      if (title !== undefined) {
         subSection.title = title
      }

      if (description !== undefined) {
         subSection.description = description
      }

      if (req.files && req.files.video !== undefined) {
         const video = req.files.video;
         const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
         )
         subSection.videoUrl = uploadDetails.secure_url
         subSection.timeDuration = `${uploadDetails.duration}`
      }

      await subSection.save()

      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate("subSection").exec();

      return res.json({
         success: true,
         message: "Section updated successfully",
         data: updatedSection,
      })

   } catch (error) {
      console.error(error)
      return res.status(500).json({
         success: false,
         message: "An error occurred while updating the section",
         error: error.message,
      })
   }
}

exports.deleteSubSection = async (req, res) => {

   try {
      const { subSectionId, sectionId } = req.body;

      await Section.findByIdAndUpdate(
         { _id: sectionId },
         {
            $pull: {
               subSection: subSectionId,
            }
         }
      );

      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

      if (!subSection) {
         return res.status(404).json({
            success: false,
            message: "Subsection not found",
         })
      }

      const updatedSection = await Section.findById(sectionId).populate('subSection').exec();

      return res.status(200).json({
         success: true,
         message: 'Sub-Section deleted Successfully!',
         data: updatedSection,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not delete Sub-Section',
         error: error.message,
      })
   }
}