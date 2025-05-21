const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate')

const otpSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
   },
   otp: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now(),
      expires: 5 * 60,
   }
})

// a function -> to send emails
async function sendVerificationEmail(email, otp) {

   const mailResponse = await mailSender(
      email,
      "Verification Email from Thinkrift",
      otpTemplate(otp)
   );
}

// here 'next' is just like of the middleware concept
otpSchema.pre('save', async function (next) {
   await sendVerificationEmail(this.email, this.otp);
   next();
})

module.exports = mongoose.model("OTP", otpSchema);