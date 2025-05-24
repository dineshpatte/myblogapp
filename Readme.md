# PaperQuill – A Simple Blog App

PaperQuill is a MERN stack-based blog application where users can read and share blog posts with images and comments.

## Features

- Create and explore blogs
- Add comments to blog posts
- Upload blog images
- Responsive frontend
- Persistent backend with MongoDB

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Image Upload:** Cloudinary
- **HTTP Client:** Axios

---

## Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/paperquill-blog.git
cd paperquill-blog
cd backend
npm install
PORT=5000
MONGODB_URI=your_mongo_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

npm srun dev

cd ../frontend
npm install

npm run dev

paperquill-blog/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── tailwind.config.js
│
└── README.md

![PaperQuill Screenshot](./src/assets/screenshot.png)

Made with ❤️ by dinesh


---
This project is open-source and free to use under the MIT License.
If you want me to package and send it as a downloadable file or integrate it into your project structure, just let me know!

