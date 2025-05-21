require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // by which i can make by backend to entertain request from the front-end
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 4000;

// db connect
database.connect();

// middlewares
app.use(express.static(path.join(__dirname, "../build")));

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
   })
)


app.use(
   fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
   })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);

// default route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.get('/', (req, res) => {
   return res.json({
      success: true,
      message: `Your Server is up and running`
   })
})

app.listen(PORT, () => {
   console.log(`Your app is running at ${PORT}`);
})