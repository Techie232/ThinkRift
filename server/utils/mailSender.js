const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
   try {
      let transporter = nodemailer.createTransport({
         host: process.env.MAIL_HOST,
         auth: {
            user: process.env.MAIL_USER, // id -> user It WORKED! 
            pass: process.env.MAIL_PASS,
         }
      })

      let info = await transporter.sendMail({
         from: 'Study-Notion || By Sameem',
         to: email,
         subject: title,
         html: body,
      })
      return info;

   } catch (error) {
      console.log(' *** ERROR while sending the mail *** :  ', error.message);
   }
}

module.exports = mailSender;