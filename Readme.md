# 📚 StudyNotion

StudyNotion is a full-stack **EdTech platform** built using the **MERN stack**.  
It allows students to explore, enroll in, and track progress in courses, while instructors can create courses, manage content, and view analytics.

---

## 🚀 Features

### 🎓 Student
- Browse courses by category
- Enroll in free & paid courses
- Watch course videos
- Track course progress
- Rate & review courses
- View enrolled courses

### 👨‍🏫 Instructor
- Create & publish courses
- Upload sections & lectures
- View enrolled students
- Dashboard analytics (students & income)

### 💳 Payments
- Razorpay integration
- Auto-enrollment for free courses

---

## 🛠 Tech Stack

**Frontend**
- React
- Redux Toolkit
- Tailwind CSS
- Swiper.js
- Chart.js

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary
- Razorpay
- Nodemailer

---

## 📂 Project Structure

```text
StudyNotion/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── templates/
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   └── core/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── reducer/
│       ├── services/
│       │   └── Operations/
│       ├── slices/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── .gitignore
├── README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/NitinBhattar/StudyNotion.git
cd StudyNotion
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a .env file:
- env
```
PORT = 4000
FE_HOST = http://localhost:3000
FE_UPDATE_PASSWORD_URL = your_frontend's_update_password_url

MONGODB_URL = your_mongodb_url

JWT_SECRET = your_jwt_secret

RAZORPAY_KEY_ID = your_key
RAZORPAY_KEY_SECRET = your_secret

CLOUDINARY_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret

BREVO_API_KEY = your_brevo_api
BREVO_SENDER_EMAIL = your_email
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Create .env:
- env
```
VITE_BASE_URL = http://localhost:4000/api/v1
VITE_RAZORPAY_KEY = your_razorpay_key
```

Start frontend:
```bash
npm run dev
```


## 🔑 Core Concepts Implemented:
- Role-based authentication (Student / Instructor)
- Course & category management
- Course progress tracking
- Ratings & reviews
- Secure payment verification
- Protected routes
- Responsive UI


## 🧪 API Highlights:
- POST /auth/signup
- POST /auth/login
- GET /categories
- GET /catalog/:category
- PUT /courses/updateCourseProgress


## 📌 Future Improvements:
- Pagination in catalog
- Wishlist feature
- Admin dashboard
- Performance optimizations


## 👤 Author:
- Nitin Bhattar
- GitHub: https://github.com/NitinBhattar
- Vercel: https://study-notion-ashy-beta.vercel.app

## 📜 License
This project is licensed under the MIT License.
See the LICENSE file for details.

---

## 📄 `LICENSE` (MIT)

```txt
MIT License

Copyright (c) 2026 Nitin Bhattar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
