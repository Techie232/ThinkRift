const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const resetPasswordTemplate = require("../mail/templates/resetPasswordTemplate");

// resetPassword token
exports.resetPasswordToken = async (req, res) => {
   try {
      // get email from req body
      const { email } = req.body;

      // check user for this email, email validation
      const user = await User.findOne({ email: email });

      if (!user) {
         return res.json({
            success: false,
            message: 'Your email is not registered with us',
         })
      }

      // generate a token
      const token = crypto.randomUUID();

      // update user by adding token and expiration time
      const updatedDetails = await User.findOneAndUpdate(
         { email: email },
         {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
         },
         { new: true }
      );

      // create url
      const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

      // send mail containing the url
      await mailSender(email,
         "Password Reset Link",
         resetPasswordTemplate(url),
      )

      // return response  
      return res.json({
         success: true,
         message: 'Email sent Successfully, Please check password and change the password',
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Something went wrong while resetting the password',
         error: error.message,
      })
   }
}

// resetPassword
exports.resetPassword = async (req, res) => {
   try {
      // data fetch
      const { password, confirmPassword, token } = req.body;

      // validation
      if (password != confirmPassword) {
         return res.json({
            success: false,
            message: 'Password not matching',
         })
      }

      // get user details from db using token
      const userDetails = await User.findOne({ token: token });

      // if no entry -> invalid token
      if (!userDetails) {
         return res.json({
            success: false,
            message: 'Token invalid',
         })
      }

      // token time check
      if (!(userDetails.resetPasswordExpires > Date.now())) {
         return res.json({
            success: false,
            message: 'Token is expired, please regenerate your token',
         })
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // password update
      await User.findOneAndUpdate(
         { token: token },
         { password: hashedPassword },
         { new: true }
      );

      // return response
      return res.json({
         success: true,
         message: 'Password Reset Successfully',
      })

   } catch (error) {
      return res.json({
         success: false,
         message: 'Something went wrong while resetting the password',
         error: error.message,
      })
   }
}

