const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const { passwordUpdated } = require('../mail/templates/passwordUpdate');
const mailSender = require("../utils/mailSender");
const z = require('zod');

exports.sendOTP = async (req, res) => {

   const { email } = req.body;

   const emailSchema = z.object({
      email: z.string().email(),
   })

   try {
      const isCorrect = emailSchema.safeParse(req.body);

      if (!isCorrect.success) {
         return res.status(500).json({
            message: "Something went wrong",
            error: response.error
         })
      }

      const checkUserPresent = await User.findOne({ email });

      if (checkUserPresent) {
         return res.status(401).json({
            success: false,
            message: "User already registered",
         })
      }

      var otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets: false,
         specialChars: false,
      })

      let result = await OTP.findOne({ otp: otp });

      // do it until we get unique OTP { It is BAD practice coz here we are making again and again db calls which can take much time. In big companies, what happen is they use those services which will give them always unique OTP }
      if (result) {
         otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
         })
         result = await OTP.findOne({ otp: otp });
      }

      const otpPayload = { email, otp };

      const otpBody = await OTP.create(otpPayload);

      res.status(200).json({
         success: true,
         message: "OTP sent Successfully",
         otp,
      })

   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Could not Send OTP, Please try again later',
         error: error.message,
      })
   }
}

exports.signUp = async (req, res) => {

   const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

   const bodySchmema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
   })

   try {
      const isCorrect = bodySchmema.safeParse(req.body);

      if (!isCorrect.success) {
         return res.status(500).json({
            message: "Something went wrong",
            error: response.error
         })
      }

      // 2 password match krlo
      if (password != confirmPassword) {
         return res.status(400).json({
            success: false,
            message: "Password and Confirm Password does not match, Please try again!",
         })
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User is already Registered",
         })
      }

      // find most recent otp { createdAt: -1  -> here '-1' means in descending order }
      const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

      // validate OTP
      if (response.length === 0) {
         // OTP not found
         return res.status(400).json({
            success: false,
            message: 'The OTP is not valid',
         })
      } else if (otp !== response[0].otp) {
         // invalid otp 
         return res.status(400).json({
            success: false,
            message: 'The OTP is not valid',
         })
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const profileDetails = await Profile.create({
         gender: null,
         dateOfBirth: null,
         about: null,
         contactNumber: null,
      })

      const user = await User.create({
         firstName,
         lastName,
         email,
         contactNumber,
         password: hashedPassword,
         accountType,
         additionalDetails: profileDetails._id,
         image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
      });

      return res.status(200).json({
         success: true,
         message: 'User is registered Successfully',
         user,
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'User cannot be registered. Please try again later',
         error: error.message,
      })
   }
}

exports.login = async (req, res) => {

   const { email, password } = req.body;

   const bodySchmema = z.object({
      email: z.string().email(),
      password: z.string()
   })

   try {
      const isCorrect = bodySchmema.safeParse(req.body);

      if (!isCorrect.success) {
         return res.status(500).json({
            message: "Something went wrong",
            error: response.error
         })
      }

      const user = await User.findOne({ email }).populate('additionalDetails').exec();

      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'User is not registered, Please SignUp first',
         })
      }

      if (await bcrypt.compare(password, user.password)) {

         const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
         }

         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
         })

         user.token = token;
         user.password = undefined;

         const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
         }

         res.cookie('token', token, options).status(200).json({
            success: true,
            token,
            user,
            message: 'Logged in Successfully',
         })
      }
      else {
         return res.status(401).json({
            success: false,
            message: 'Email or Password is incorrect!',
         })
      }
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: 'Login Failure, Please try again!',
         error: error.message,
      })
   }

}

exports.changePassword = async (req, res) => {
   try {
      const { oldPassword, newPassword } = req.body

      if (oldPassword !== newPassword) {
         return res.status(500).json({
            success: false,
            message: "Passwords do not match",
            error: error.message,
         })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUserDetails = await User.findByIdAndUpdate(
         req.user.id,
         { password: hashedPassword },
         { new: true }
      )

      // Send notification email
      try {
         const emailResponse = await mailSender(
            updatedUserDetails.email,
            "Password for your account has been updated",
            passwordUpdated(
               updatedUserDetails.email,
               `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
         )
      } catch (error) {
         console.error("Error occurred while sending email:", error)
         return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
         })
      }
      return res
         .status(200).json({
            success: true,
            message: "Password updated successfully"
         })

   } catch (error) {
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
         success: false,
         message: "Error occurred while updating password",
         error: error.message,
      })
   }
}