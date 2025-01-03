const Category = require("../models/Category");

function getRandomInt(max) {
   return Math.floor(Math.random() * max)
}

// create category ka handler function
exports.createCategory = async (req, res) => {

   try {
      // fetch data
      const { name, description } = req.body;

      // validation
      if (!name || !description) {
         return res.status(400).json({
            success: false,
            message: 'All fields are required',
         })
      }

      // create entry in DB
      const categoryDetails = await Category.create(
         {
            name: name,
            description: description,
         }
      );

      // return response
      return res.status(200).json({
         success: true,
         message: 'Category created Successfully',
         data: categoryDetails
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not create Category',
         error: error.message,
      })
   }
}

// get all categories
exports.showAllCategories = async (req, res) => {
   try {
      const allCategory = await Category.find({}).select('name description _id');

      res.status(200).json({
         success: true,
         message: 'All Categories fetched Successfully',
         data: allCategory,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Could not fetch Categories',
         error: error.message,
      })
   }
}

exports.categoryPageDetails = async (req, res) => {
   try {
      const { categoryId } = req.body;

      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
         .populate({
            path: "course",
            match: { status: "Published" },
            populate: {
               path: "ratingAndReview", // Ensure this is defined in the schema
            },
         });

      // Handle the case when the category is not found
      if (!selectedCategory) {
         return res.status(404).json({
            success: false,
            message: "Category not found",
         });
      }

      // Handle the case when there are no courses
      if (!selectedCategory.course || selectedCategory.course.length === 0) {
         return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
         });
      }

      // Get a random category except the selected one
      const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });
      let differentCategory = null;

      if (categoriesExceptSelected.length > 0) {
         const randomIndex = getRandomInt(categoriesExceptSelected.length);
         differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
            .populate({
               path: "course",
               match: { status: "Published" },
            });
      }

      // Get top-selling courses across all categories
      const allCategories = await Category.find()
         .populate({
            path: "course",
            match: { status: "Published" },
            populate: {
               path: "instructor",
            },
         });


      const allCourses = allCategories.flatMap((category) => category.course || []);
      const mostSellingCourses = allCourses
         .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Ensure sold field exists
         .slice(0, 10)


      // Respond with data
      return res.status(200).json({
         success: true,
         data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
         },
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Could not fetch category details",
         error: error.message,
      });
   }
};
