# 🎓 Campus Sarthi: Placement Support System

A premium, full-stack MERN application designed to streamline and automate the college placement process. Built with a modern SaaS-style architecture, it handles everything from student portfolios to recruiter interviews and administrative analytics.

---

## 🚀 Overview

**Campus Sarthi** is designed for secure, localized deployment on university networks. It provides dedicated portals for Students, Company Recruiters, and College Administrators, ensuring a seamless hiring pipeline.

---

## 🔑 Demo Login Credentials

You can use the following demo accounts to explore the localized system, or create your own via the Registration portal.

* **Admin Portal**
  Email: admin@gmail.com
  Password: 123456

* **Company Portal**
  Email: company@gmail.com
  Password: 123456

---

## 👨‍💻 Roles & Features

### 🧑‍🎓 Student
* Build a comprehensive academic and professional portfolio.
* Submit applications with resume & cover letter attachments (stored securely on the local server).
* Track live application statuses across multiple placement drives.
* Receive email notifications for shortlists and updates.
* Attend technical/HR rounds via integrated **Jitsi Meet video conferencing**.

### 🏢 Company Recruiter
* Browse active placement drives and post detailed job openings.
* Manage corporate profiles and organizational details.
* Review incoming student applications and seamlessly download resumes.
* Update applicant statuses (automatically triggering email notifications).
* Schedule interviews, provide detailed scorecard feedback, and conduct live video interviews via the **Jitsi integration**.

### 👨‍💼 Administrator
* Create, manage, and oversee all university Placement Drives.
* Monitor global student registries and company directories.
* Generate and view visual analytics (Success Rates, Pipeline Funnels) via **Recharts**.
* Export official drive reports as downloadable PDFs.

---

## ⚙️ Tech Stack

* **Frontend:** React.js, TailwindCSS v4, React Router v7
* **State Management:** Redux Toolkit (Slices & Async Thunks)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Local)
* **Authentication:** JWT (JSON Web Tokens) & bcrypt
* **File Storage:** Local Disk Storage (Multer API)
* **Video Conferencing:** Jitsi Meet React SDK
* **Email Notifications:** Nodemailer
* **Charts & Reports:** Recharts, html2pdf.js

---

## 🗂️ Project Structure

```text
/Campus-Sarthi
 ├── server    # Express.js API, MongoDB configurations, Local Uploads
 ├── client    # React.js Frontend, Tailwind v4 UI, Redux State
 └── README.md

 🛠️ Getting Started (Local Development)

1️⃣ Clone the repository
Bash
git clone [https://github.com/YourUsername/Campus-Sarthi.git](https://github.com/YourUsername/Campus-Sarthi.git)
cd Campus-Sarthi

2️⃣ Setup Backend (Server)
Ensure MongoDB is running locally on your machine.

Bash
cd server
npm install
npm run dev

3️⃣ Setup Frontend (Client)
Open a new terminal window:

Bash
cd client
npm install
npm run dev
The application will boot up at http://localhost:5173.

4️⃣ Environment Variables
Create a .env file in the server directory with the following secure local configuration:

Code snippet
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campussarthi
JWT_SECRET=campussarthi_super_secret_local_key

# Email Config (Add your details for Nodemailer)
EMAIL=your_email@example.com
EMAIL_PASS=your_app_password

# File Uploads (System is configured for local disk storage. Dummy keys bypass external cloud requirements)
CLOUDINARY_CLOUD_NAME=dummy_name
CLOUDINARY_API_KEY=dummy_key
CLOUDINARY_API_SECRET=dummy_secret

📊 Reports & Analytics
Track participant volume, total interviews, generated offers, and successful placements.

Visualize placement statistics with interactive bar and pie charts.

Export high-fidelity PDF results for official university records.

📜 License
Developed as a Final Year Academic Project.
