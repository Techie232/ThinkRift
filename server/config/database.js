const mongoose = require('mongoose');

exports.connect = () => {
   mongoose.connect(process.env.MONGODB_URL, {})
      .then(() => {
         console.log("DB connected Successfully");
      })
      .catch((error) => {
         console.log("DB connection failed!");
         console.log(error);
         process.exit(1);
      })
}