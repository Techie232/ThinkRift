const jwt = require('jsonwebtoken');
const { roles } = require('../ common/roles');

// auth
exports.auth = async (req, res, next) => {
   try {
      // extract token
      const token = req.cookies.token || req.body.token || req.header('Authorization').replace('Bearer ', "");

      if (!token) {
         return res.status(401).json({
            success: false,
            message: 'Token is missing',
         })
      }

      // verify the token
      try {
         const decode = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decode;

      } catch (error) {

         // verification issue
         return res.status(401).json({
            success: false,
            message: 'Token is invalid',
         })
      }

      next();

   } catch (error) {
      return res.status(401).json({
         success: false,
         message: 'Something went wrong while validating the token',
         error: error.message,
      })
   }
}

// isStudent
exports.isStudent = async (req, res, next) => {
   try {

      if (req.user.accountType !== roles.STUDENT) {
         return res.status(401).json({
            success: false,
            message: 'This is a protected route for students only',
         })
      }

      next();

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "User role cannot be verified, please try again",
         error: error.message,
      })
   }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
   try {

      if (req.user.accountType !== roles.INSTRUCTOR) {
         return res.status(401).json({
            success: false,
            message: 'This is a protected route for Instructor only',
         })
      }

      next();

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "User role cannot be verified, please try again",
         error: error.message,
      })
   }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
   try {

      if (req.user.accountType !== roles.ADMIN) {
         return res.status(401).json({
            success: false,
            message: 'This is a protected route for Admin only',
         })
      }

      next();

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "User role cannot be verified, please try again",
         error: error.message,
      })
   }
}