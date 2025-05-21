# 🚀 ThinkRift – A Full-Stack Learning Platform

**ThinkRift** is a full-fledged, responsive learning platform built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It is designed to offer a seamless educational experience with modern features such as secure authentication, media content management, and clean RESTful APIs.

---

## 🌟 Features

- 🔐 **Authentication & Authorization** using **JWT (JSON Web Tokens)**
- 🎥 **Media Management** for photos and videos via cloud-based services
- 📱 **Fully Responsive UI** for mobile, tablet, and desktop
- ⚙️ **RESTful APIs** following clean architectural practices
- 🧠 Built as a complete learning solution – scalable and production-ready

---

## 🧰 Tech Stack

### Frontend:
- React.js
- React Router
- Axios
- Tailwind CSS / CSS Modules (if used)
- Context API / Redux (if applicable)

### Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Multer / Cloudinary / Media service integration

---

## 📁 Folder Structure (Monorepo)

```
thinkrift/
├── client/         # React frontend
│   └── ...
├── server/         # Express backend
│   └── ...
└── README.md
```

---

## 🚀 Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com) / Netlify
- **Backend:** Deployed on [Render](https://render.com) / Railway / other hosting platforms
- **Media Storage:** Integrated with [Cloudinary](https://cloudinary.com) (or similar)

---

## 🔐 Authentication

- JWT-based token system
- Secure route protection middleware
- Role-based access control (if implemented)

---

## 📸 Media Handling

- Media files uploaded via the client or backend
- Managed using third-party services (e.g., Cloudinary)
- URLs stored in MongoDB and fetched on demand

---

## 🧪 API Testing

- All APIs tested using [DiceBear](https://www.dicebear.com) (for mock avatars) and Postman
- RESTful architecture with clearly defined endpoints

---

## 🤝 Contributing

Want to contribute? Feel free to fork the repo, open a PR, or raise issues!

---

## 📃 License

[MIT](LICENSE)
