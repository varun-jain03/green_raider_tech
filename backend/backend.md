# Team Task Manager — Backend

A production-leaning REST API for managing team projects and tasks, built with **Node.js, Express, MongoDB, and JWT Authentication**.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Features

### Authentication

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication

### Role-Based Access Control (RBAC)

#### Admin

- Full CRUD access for:
  - Users
  - Projects
  - Tasks
- Add or remove project members

#### Member

- View only assigned projects
- View tasks assigned to them
- Update only the status of their own tasks

### Projects

- Create, update, delete projects
- Assign and remove project members
- Fetch all or single projects

### Tasks

- Create, update, delete tasks
- Filter tasks by:
  - Status
  - Priority
  - Project
  - Assignee
  - Overdue tasks

### Dashboard

- Total tasks by status
- Overdue tasks count
- Logged-in user's assigned tasks

---

# Live Deployment

- Backend Hosted On: **Render**
- Live API URL:  
  [Team Task Manager Backend API](https://teamtaskmanager-backend-cwun.onrender.com?utm_source=chatgpt.com)

---

# Folder Structure

```text
backend/
├── package.json
├── server.js
├── .env.example
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    │
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── role.middleware.js
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    │
    ├── utils/
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   └── asyncHandler.js
    │
    └── modules/
        ├── auth/
        │   ├── auth.controller.js
        │   ├── auth.service.js
        │   ├── auth.repository.js
        │   ├── auth.route.js
        │   └── auth.validation.js
        │
        ├── users/
        │   ├── user.model.js
        │   ├── user.controller.js
        │   ├── user.service.js
        │   ├── user.repository.js
        │   └── user.route.js
        │
        ├── projects/
        │   ├── project.model.js
        │   ├── project.controller.js
        │   ├── project.service.js
        │   ├── project.repository.js
        │   ├── project.route.js
        │   └── project.validation.js
        │
        ├── tasks/
        │   ├── task.model.js
        │   ├── task.controller.js
        │   ├── task.service.js
        │   ├── task.repository.js
        │   ├── task.route.js
        │   └── task.validation.js
        │
        └── dashboard/
            ├── dashboard.controller.js
            ├── dashboard.service.js
            └── dashboard.route.js
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1h

SALT_ROUNDS=10

NODE_ENV=development
```

## 4. Run the Development Server

```bash
npm run dev
```

---

# Environment Variables

| Variable            | Description               |
| ------------------- | ------------------------- |
| PORT                | Server port               |
| MONGO_URI           | MongoDB connection string |
| ACCESS_TOKEN_SECRET | JWT secret key            |
| ACCESS_TOKEN_EXPIRY | JWT token expiry          |
| SALT_ROUNDS         | bcrypt salt rounds        |
| NODE_ENV            | Environment mode          |

---

# API Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {}
}
```

---

# API Endpoints

## Authentication

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |

### Register Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "member"
}
```

### Login Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Users

| Method | Endpoint         | Access        | Description              |
| ------ | ---------------- | ------------- | ------------------------ |
| GET    | `/api/users/me`  | Authenticated | Get current user profile |
| GET    | `/api/users`     | Admin         | Get all users            |
| GET    | `/api/users/:id` | Admin         | Get user by ID           |
| DELETE | `/api/users/:id` | Admin         | Delete user              |

---

## Projects

| Method | Endpoint                            | Access        |
| ------ | ----------------------------------- | ------------- |
| GET    | `/api/projects`                     | Authenticated |
| GET    | `/api/projects/:id`                 | Authenticated |
| POST   | `/api/projects`                     | Admin         |
| PATCH  | `/api/projects/:id`                 | Admin         |
| DELETE | `/api/projects/:id`                 | Admin         |
| POST   | `/api/projects/:id/members`         | Admin         |
| DELETE | `/api/projects/:id/members/:userId` | Admin         |

### Create Project Body

```json
{
  "name": "Website Redesign",
  "description": "Frontend redesign project",
  "members": ["userId1", "userId2"]
}
```

---

## Tasks

| Method | Endpoint         | Access        |
| ------ | ---------------- | ------------- |
| GET    | `/api/tasks`     | Authenticated |
| GET    | `/api/tasks/:id` | Authenticated |
| POST   | `/api/tasks`     | Admin         |
| PATCH  | `/api/tasks/:id` | Authenticated |
| DELETE | `/api/tasks/:id` | Admin         |

### Create Task Body

```json
{
  "title": "Build Login Page",
  "description": "Create responsive login UI",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-10",
  "assignee": "userId",
  "project": "projectId"
}
```

### Task Filters

```http
GET /api/tasks?status=todo&priority=high
```

Available filters:

- status
- priority
- project
- assignee
- overdue=true

---

## Dashboard

| Method | Endpoint               | Access        |
| ------ | ---------------------- | ------------- |
| GET    | `/api/dashboard/stats` | Authenticated |

Returns:

- Task counts by status
- Overdue tasks
- Logged-in user's tasks

---

# Authentication

Protected routes require a Bearer Token.

Example:

```http
Authorization: Bearer <accessToken>
```

# Author

Built by Varun Jain
