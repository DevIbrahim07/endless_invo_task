# Simple Web App

A simple web application with user signup, login, question modal, and admin approval system.

## Features

- User signup and login (simple session-based authentication)
- 3-question modal after login
- Admin approval system
- Admin dashboard for user management
- Simple and clean UI

## Tech Stack

- **Frontend**: React.js (JavaScript)
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: Express sessions (no JWT)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update the `.env` file with your MongoDB connection string if needed:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/simple-webapp
   SESSION_SECRET=your-secret-key-here
   ```

4. Seed the database with questions and create admin user:

   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. **Signup**: Create a new account at `/signup`
2. **Login**: Login with your credentials at `/login`
3. **Questions**: After login, answer 3 questions in the modal
4. **Admin Approval**: Wait for admin approval
5. **Home Page**: Access the main website after approval

### Admin Access

- **Email**: admin@example.com
- **Password**: admin123
- **Admin Dashboard**: Available at `/admin` for approved admin users

## User Flow

1. User signs up → Creates account
2. User logs in → Redirected to home page
3. Question modal appears → User answers 3 questions
4. Status changes to "pending" → Waiting for admin approval
5. Admin approves/rejects → User gets access or rejection message
6. Approved users → Full access to the website

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js
│   │   │   └── QuestionsModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Signup.js
│   │   │   ├── Login.js
│   │   │   ├── Home.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Question.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seedQuestions.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Questions

- `GET /api/questions` - Get all questions

### User

- `POST /api/user/responses` - Submit user responses

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/approve` - Approve user (admin only)
- `PATCH /api/admin/users/:id/reject` - Reject user (admin only)

## Development

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- Database: MongoDB on default port `27017`

## Notes

- Simple authentication using Express sessions
- No JWT tokens used (as requested)
- Admin dashboard for easy user management
- Responsive design with clean CSS
- All code in JavaScript (no TypeScript)
