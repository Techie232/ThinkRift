# ThinkRift

ThinkRift is a full-stack online learning platform. Students can discover and enrol in courses, watch course content, track their learning progress, and leave reviews. Instructors can create and manage courses from their dashboard.

The project consists of a React frontend and an Express/MongoDB API. The Express server also serves the compiled frontend in production.

## Tech stack

- React 18, React Router, Redux Toolkit, Tailwind CSS
- Node.js and Express
- MongoDB with Mongoose
- JWT authentication, Cloudinary uploads, Razorpay payments, and Nodemailer email delivery

## Prerequisites

Before starting, install or prepare:

- Node.js 18 or newer (the current LTS version is recommended)
- npm (included with Node.js)
- A MongoDB database (local or MongoDB Atlas)
- Cloudinary, Razorpay, and SMTP credentials if you need uploads, payments, and email features

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone <repository-url>
cd ThinkRift
npm install
cd server && npm install
cd ..
```

## Environment variables

Create local environment files from the supplied examples:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Set the following values before running the application. Do not commit either `.env` file.

### Frontend (`.env`)

```dotenv
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=your_razorpay_key_id
```

### Backend (`server/.env`)

```dotenv
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

FRONTEND_URL=http://localhost:3000

MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_username
MAIL_PASS=your_smtp_password

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

FOLDER_NAME=thinkrift
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

For a production-style local run, set `FRONTEND_URL` to the URL at which the frontend is served. The example value above is for the hot-reload frontend server.

## Start the project

### Production-style local run

Build the React app, then start the Express server. The server hosts both the UI and API on port `4000` by default.

```bash
npm run build
npm start
```

Open [http://localhost:4000](http://localhost:4000).

### Development with hot reload

Start the API in one terminal:

```bash
npm run server
```

In a second terminal, start the React development server:

```bash
npx react-scripts start
```

Open [http://localhost:3000](http://localhost:3000). Make sure `REACT_APP_BASE_URL` is set to `http://localhost:4000/api/v1` and `FRONTEND_URL` is set to `http://localhost:3000`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the Express server, which serves the existing production build. |
| `npm run build` | Creates an optimized React build in `build/`. |
| `npm run server` | Starts the backend with Nodemon for automatic restarts. |
| `npm run dev` | Runs the repository's configured concurrent processes. For frontend hot reload, use the two-terminal workflow above. |

## Project structure

```text
.
├── src/                 # React application
├── public/              # Static frontend files
├── server/
│   ├── config/          # Database, Cloudinary, and Razorpay configuration
│   ├── controllers/     # API business logic
│   ├── middlewares/     # Authentication middleware
│   └── routes/          # API routes
├── .env.example         # Frontend environment variable template
└── server/.env.example  # Backend environment variable template
```

## API base path

The backend exposes its API under `http://localhost:4000/api/v1` by default. Route groups include:

- `/auth` for authentication and password management
- `/profile` for user profiles and dashboards
- `/course` for courses, categories, sections, progress, and reviews
- `/payment` for Razorpay payment processing

## Notes

- Build the frontend again with `npm run build` whenever you change React source code before using `npm start`.
- A valid MongoDB connection is required for the server to start successfully.
- Payment, email, and media-upload functionality requires valid provider credentials.
