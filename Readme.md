# Subscription Tracker API

A robust backend API for managing subscriptions with automated email reminders. Built with **Node.js**, **Express**, and **MongoDB**, this system provides secure authentication, subscription lifecycle management, and scheduled renewal notifications using Upstash workflows.

---

## 🚀 Features

- **User Authentication**
  - JWT-based authentication
  - Secure password hashing with bcrypt

- **Subscription Management**
  - Full CRUD operations for user subscriptions
  - Track renewal dates, pricing, and categories

- **Automated Email Reminders**
  - Scheduled notifications before subscription renewals
  - Background processing using Upstash Workflow

- **Workflow Automation**
  - Serverless scheduling for reminders
  - Reliable execution independent of API uptime

- **Email Notifications**
  - Nodemailer integration with Gmail
  - Customizable email templates

- **Security & Stability**
  - API rate limiting via ArcJet
  - Centralized error handling
  - Environment-based configuration

---

## 🛠 Tech Stack

### Core Technologies
- **Node.js** – JavaScript runtime
- **Express** – Web application framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM

### Authentication & Security
- **JWT** – Authentication and authorization
- **bcryptjs** – Password hashing
- **ArcJet** – Rate limiting and API protection

### Email & Scheduling
- **Nodemailer** – Email delivery
- **Upstash Workflow** – Scheduled background jobs
- **Day.js** – Date manipulation

### Development Tools
- **Nodemon** – Hot reloading during development
- **ESLint** – Code quality enforcement
- **dotenv** – Environment variable management

---

## 📁 Project Structure

subscription-tracker/
├── config/
│   ├── env.js                 # Environment configuration
│   ├── nodemailer.js          # Email configuration
│   └── upstash.js             # Upstash workflow setup
│
├── controllers/
│   ├── auth.controller.js     # Authentication logic
│   ├── subscription.controller.js # Subscription CRUD
│   └── workflow.controller.js # Reminder workflows
│
├── middlewares/
│   ├── auth.middleware.js     # JWT authentication
│   ├── error.middleware.js    # Centralized error handling
│   └── arcjet.middleware.js   # Rate limiting
│
├── models/
│   ├── user.model.js          # User schema
│   └── subscription.model.js  # Subscription schema
│
├── routes/
│   ├── auth.routes.js         # Auth routes
│   ├── subscription.routes.js # Subscription routes
│   └── workflow.routes.js     # Workflow triggers
│
├── utils/
│   ├── email-template.js      # Email templates
│   └── send-email.js          # Email utility
│
├── database/
│   └── mongodb.js             # MongoDB connection
│
├── app.js                     # Application entry point
├── package.json               # Dependencies and scripts
└── README.md

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` – Register a new user
- `POST /api/v1/auth/login` – User login
- `GET /api/v1/auth/me` – Get current user profile

### Subscriptions
- `GET /api/v1/subscriptions` – Get all user subscriptions
- `POST /api/v1/subscriptions` – Create a new subscription
- `GET /api/v1/subscriptions/:id` – Get subscription by ID
- `PUT /api/v1/subscriptions/:id` – Update subscription
- `DELETE /api/v1/subscriptions/:id` – Delete subscription

### Workflows
- `POST /api/v1/workflows/subscription/reminder` – Trigger subscription reminder workflow

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Upstash account
- Gmail account (App Password enabled)

---

### Installation

1. Clone the repository  
   `git clone https://""  
   `cd subscription-tracker`

2. Install dependencies  
   `npm install`

3. Set up environment variables  
   `cp .env.example .env`

4. Start the development server  
   `npm run dev`

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

# Server  
PORT=3000  
NODE_ENV=development  

# MongoDB  
MONGODB_URI=your_mongodb_uri  

# JWT  
JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN=30d  

# Email (Gmail)  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASSWORD=your_app_password  

# Upstash  
UPSTASH_REDIS_REST_URL=your_upstash_redis_url  
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token  

---

## 🧪 Testing

Run the test suite:

`npm test`

---

## 📝 License

This project is licensed under the **MIT License**.  
See the LICENSE file for details.

---

## 👏 Contributing

Contributions are welcome.  
Please follow standard GitHub workflow practices and submit a pull request with a clear description of your changes.

---

## 📧 Contact

Your Moses Njuguna  
your Email rosemoses765@gmail.com 



---

## 🔍 Key Technical Highlights

1. **Modular Architecture**
   - Clean separation of routes, controllers, models, and middleware

2. **Security**
   - JWT-based authentication
   - bcrypt password hashing
   - ArcJet rate limiting
   - Environment-based secrets

3. **Asynchronous Processing**
   - Upstash workflows for background reminders
   - Async/await with centralized error handling

4. **Developer Experience**
   - ESLint enforcement
   - Nodemon hot reload
   - Structured logging and readable errors

5. **Scalability**
   - Stateless authentication
   - MongoDB connection pooling
   - Queue-based email processing

