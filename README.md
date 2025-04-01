# **🔥 Interview Whiz backend 🔥**  

## 🌍 Overview  
Welcome to **Dev Heat Backend** – the powerhouse behind our interview management system! This backend is responsible for **user authentication, interview data handling, and email notifications**, ensuring a smooth experience for all users.  

Built with **Node.js, Express, MongoDB, and JWT authentication**, this project efficiently manages interview-related data while maintaining security and scalability.  

---

## 📁 **Project Structure**  

```
Dev_Heat_Backend/
│── controllers/        # Handles request logic  
│   ├── mailController.js    # Manages email operations  
│   ├── userController.js    # Handles user-related operations  
│  
│── db/                 # Database connection setup (if required)  
│  
│── middleware/         # Middleware functions  
│   ├── authentication.js    # Auth middleware (JWT)  
│  
│── models/            # Database models  
│   ├── interview.js    # Schema for interview data  
│   ├── userModel.js    # Schema for user data  
│  
│── routes/            # API routes  
│   ├── getInterviewdata.js    # Fetch interview data  
│   ├── postInterviewdata.js   # Submit interview responses  
│   ├── user.js                # User-related routes  
│   ├── verify.js              # User verification logic  
│  
│── utils/             # Helper functions  
│   ├── randString.js    # Generates random strings  
│   ├── sendEmail.js     # Email sending logic  
│  
│── .env               # Environment variables (ignored in Git)  
│── .gitignore         # Files to exclude from version control  
│── package.json       # Project metadata & dependencies  
│── server.js          # Main server file (entry point)  
│── README.md          # Documentation  
```

---

## 🚀 **Getting Started**  

### **🔹 Prerequisites**  
Before you begin, ensure you have:  
✅ **Node.js** installed (v14+ recommended)  
✅ **MongoDB** installed (or use MongoDB Atlas)  
✅ A `.env` file with the necessary credentials  

### **🔹 Installation**  
Clone this repository and install dependencies:  
```sh
git clone https://github.com/your-repo/dev_heat_backend.git
cd Dev_Heat_Backend
npm install
```

### **🔹 Environment Variables**  
Create a `.env` file in the root directory and configure your environment:  
```env
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
EMAIL_SERVICE=your_email_service  
EMAIL_USER=your_email  
EMAIL_PASS=your_email_password  
```

### **🔹 Running the Server**  
Start the development server:  
```sh
npm run dev
```  
For production:  
```sh
npm start
```

---

## 🎯 **API Endpoints**  

### **🔑 Authentication & User Management**  
| Method | Endpoint              | Description            |
|--------|----------------------|------------------------|
| **POST** | `/api/user/register` | Register a new user   |
| **POST** | `/api/user/login`    | User login            |
| **GET**  | `/api/user/verify`   | Verify user account   |

### **📋 Interview Data Handling**  
| Method | Endpoint                 | Description                 |
|--------|-------------------------|-----------------------------|
| **GET**  | `/api/interview/data`   | Fetch interview questions  |
| **POST** | `/api/interview/post`   | Submit interview answers   |

---

## 🛠 **Built With**  

🚀 **Node.js & Express.js** - Backend Framework  
📦 **MongoDB & Mongoose** - Database & ORM  
🔐 **JWT** - Secure authentication  
📩 **Nodemailer** - Email service  
🛠 **dotenv** - Environment variable management  

---

## 👥 **Contributing**  
We welcome contributions! 💡 If you have ideas for improvement, feel free to:  
✅ Fork the repo  
✅ Create a new branch  
✅ Submit a pull request  

---

## 📜 **License**  
This project is open-source and available under the **MIT License**.  

---

💡 **Made with ❤️ for Dev Heat!** 🚀 Let’s build something awesome together!  
