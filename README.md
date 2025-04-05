# 💸 SendMate – A Paytm-like Money Transfer App

SendMate is a full-stack money transfer app where users can sign up, log in, view their balance, search for friends, and send money securely. Built using **React**, **TypeScript**, **Node.js**, and **MongoDB**, with secure JWT authentication and password encryption.

---

## 🚀 Features

- 🔐 **User Authentication** using **JWT**
- 🔑 **Secure Passwords** using **bcrypt**
- 💸 **Send Money** to registered users
- 🔍 **Debounced User Search**
- 🧾 **Dashboard** to view account balance and users
- 🧠 **Form validation** with **Zod**
- 🎨 **Tailwind CSS** powered UI

---

## 🛠️ Tech Stack

| Frontend       | Backend           | Database  |
|----------------|--------------------|-----------|
| React + TS     | Express.js + TS     | MongoDB   |
| Tailwind CSS   | Zod, JWT, Bcrypt   | Mongoose  |

---

## 📁 Project Structure

```
sendmate/
│
├── client/                     # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── bottom_warning.tsx
│   │   ├── button.tsx
│   │   ├── custom_input.tsx
│   │   ├── friendsTile.tsx
│   │   ├── heading.tsx
│   │   ├── subheading.tsx
│   │   └── userIcon.tsx
│   │
│   ├── pages/                  # Main pages
│   │   ├── dashboard.tsx
│   │   ├── sendMoney.tsx
│   │   ├── signin.tsx
│   │   ├── signup.tsx
│   │   └── redirect.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── server/                     # Express backend
│   ├── routes/
│   │   ├── user.ts             # Signup, Signin, Get users
│   │   └── account.ts          # Get balance, Transfer money
│   │
│   ├── middleware/
│   │   └── auth.ts             # JWT auth middleware
│   │
│   ├── models/
│   │   ├── User.ts
│   │   └── Account.ts
│   │
│   ├── config.ts
│   ├── index.ts                # App entry point
│   └── .env
│
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/sendmate.git
cd sendmate
```

---

### 2. Set up the backend

```bash
cd server
npm install
```

**Create a `.env` file in `/server`:**

```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_connection_string
PORT=3000
```

Start the server:

```bash
npm run dev
```

---

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

---

## 🧪 Sample API Endpoints

| Method | Endpoint                         | Description                  |
|--------|----------------------------------|------------------------------|
| POST   | `/api/v1/user/signup`            | Sign up a new user          |
| POST   | `/api/v1/user/signin`            | Login and get JWT token     |
| GET    | `/api/v1/user/me`                | Check login status          |
| GET    | `/api/v1/user/bulk?filter=John`  | Search users by name        |
| GET    | `/api/v1/account/balance`        | Get user balance            |
| POST   | `/api/v1/account/transfer`       | Send money to another user  |

---

## 🖼️ UI Screens

- ✅ Sign Up
- ✅ Sign In
- ✅ Dashboard with Balance and User List
- ✅ Search + Send Money Page

*(You can add screenshots here)*

---

## 🌱 Future Improvements

- ✅ Transaction history
- ✅ Logout option
- ✅ User profile update
- ✅ Mobile-responsive refinements
- ✅ Error handling and notifications

---

## 🧑‍💻 Author

Made with 💙 by [Your Name](https://github.com/your-username)

---

## 📜 License

This project is licensed under the MIT License.
