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
│       ├── pages/
│       ├── redux/
│       │   └── slices/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── .gitignore
├── README.md
├── LICENSE


## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/NitinBhattar/StudyNotion.git
cd StudyNotion
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file:

env
Copy code
PORT=5000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAIL_HOST=smtp_host
MAIL_USER=your_email
MAIL_PASS=your_password
Start backend:

bash
Copy code
npm run dev
3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
Create .env:

env
Copy code
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key
Start frontend:

bash
Copy code
npm run dev
🔑 Core Concepts Implemented
Role-based authentication (Student / Instructor)

Course & category management

Course progress tracking

Ratings & reviews

Secure payment verification

Protected routes

Responsive UI

🧪 API Highlights
POST /auth/signup

POST /auth/login

GET /categories

GET /catalog/:category

PUT /courses/updateCourseProgress

📌 Future Improvements
Email verification

Pagination in catalog

Wishlist feature

Admin dashboard

Performance optimizations

👤 Author
Nitin Bhattar
GitHub: https://github.com/NitinBhattar

📜 License
This project is licensed under the MIT License.
See the LICENSE file for details.

sql
Copy code

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