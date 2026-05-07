# Team Task Manager — Backend

A simple yet production-leaning REST API for a team task manager built with **Express + MongoDB (Mongoose) + JWT**.

## Stack

- Node.js + Express
- MongoDB with Mongoose
- JWT (access token only)
- bcryptjs for password hashing
- express-validator for request validation
- Feature-based module structure (auth / users / projects / tasks / dashboard)

## Features

- **Authentication**: Register & Login with hashed passwords + JWT
- **Role-Based Access Control**
  - `admin`: full CRUD on projects, tasks, users; add/remove project members
  - `member`: view projects they are a member of; update only the `status` of tasks assigned to them
- **Projects**: create, list, fetch, update, delete + manage members
- **Tasks**: create, list (filterable), fetch, update, delete with project scoping
- **Dashboard**: aggregate stats — totals by status, overdue count, my tasks

## Live Deployment

- Platform: **Render**
- Live API URL: [https://teamtaskmanager-backend-cwun.onrender.com](https://teamtaskmanager-backend-cwun.onrender.com)

## Project Structure

```
backend-node/
├── package.json
├── server.js
├── .env.example
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── role.middleware.js
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    ├── utils/
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   └── asyncHandler.js
    └── modules/
        ├── auth/
        │   ├── auth.controller.js
        │   ├── auth.service.js
        │   ├── auth.repository.js
        │   ├── auth.route.js
        │   └── auth.validation.js
        ├── users/
        │   ├── user.model.js
        │   ├── user.controller.js
        │   ├── user.service.js
        │   ├── user.repository.js
        │   └── user.route.js
        ├── projects/
        │   ├── project.model.js
        │   ├── project.controller.js
        │   ├── project.service.js
        │   ├── project.repository.js
        │   ├── project.route.js
        │   └── project.validation.js
        ├── tasks/
        │   ├── task.model.js
        │   ├── task.controller.js
        │   ├── task.service.js
        │   ├── task.repository.js
        │   ├── task.route.js
        │   └── task.validation.js
        └── dashboard/
            ├── dashboard.controller.js
            ├── dashboard.service.js
            └── dashboard.route.js
```

## Setup

```bash
# 1. Install deps
npm install      

# 2. Create .env 
ni .env

# 3. Run with nodemon
npm run dev
```

## Environment Variables

| Key                   | Description                              |
| --------------------- | ---------------------------------------- |
| `PORT`                | Server port (default 5000)               |
| `MONGO_URI`           | MongoDB connection URL                |
| `ACCESS_TOKEN_SECRET` | access-token-seceret                      |
| `ACCESS_TOKEN_EXPIRY` | JWT lifetime (`1h`)           |
| `SALT_ROUNDS`         | 5
| `NODE_ENV`            | `development`

## API Endpoints

All responses follow:
```json
{ "success": true, "statusCode": 200, "message": "...", "data": {...} }
```

### Auth
| Method | Endpoint              | Access | Body                                          |
| ------ | --------------------- | ------ | --------------------------------------------- |
| POST   | `/api/auth/register`  | Public | `{ name, email, password, role? }`            |
| POST   | `/api/auth/login`     | Public | `{ email, password }` → `{ user, accessToken }` |

### Users
| Method | Endpoint         | Access | Description          |
| ------ | ---------------- | ------ | -------------------- |
| GET    | `/api/users/me`  | Auth   | Current user profile |
| GET    | `/api/users`     | Admin  | List all users       |
| GET    | `/api/users/:id` | Admin  | Fetch user by ID     |
| DELETE | `/api/users/:id` | Admin  | Delete user          |

### Projects
| Method | Endpoint                               | Access | Description                          |
| ------ | -------------------------------------- | ------ | ------------------------------------ |
| GET    | `/api/projects`                        | Auth   | Admin: all, Member: assigned only    |
| GET    | `/api/projects/:id`                    | Auth   | Must be admin or project member      |
| POST   | `/api/projects`                        | Admin  | `{ name, description?, members? }`   |
| PATCH  | `/api/projects/:id`                    | Admin  | `{ name?, description? }`            |
| DELETE | `/api/projects/:id`                    | Admin  |                                      |
| POST   | `/api/projects/:id/members`            | Admin  | `{ userId }`                         |
| DELETE | `/api/projects/:id/members/:userId`    | Admin  |                                      |

### Tasks
| Method | Endpoint         | Access | Description                                                    |
| ------ | ---------------- | ------ | -------------------------------------------------------------- |
| GET    | `/api/tasks`     | Auth   | Filters: `status`, `priority`, `project`, `assignee`, `overdue=true` |
| GET    | `/api/tasks/:id` | Auth   | Admin or project member/assignee                               |
| POST   | `/api/tasks`     | Admin  | `{ title, description?, status?, priority?, dueDate?, assignee?, project }` |
| PATCH  | `/api/tasks/:id` | Auth   | Admin: any field. Member: only `status` of own tasks           |
| DELETE | `/api/tasks/:id` | Admin  |                                                                |

### Dashboard
| Method | Endpoint              | Access | Description                              |
| ------ | --------------------- | ------ | ---------------------------------------- |
| GET    | `/api/dashboard/stats`| Auth   | Totals by status, overdue count, my tasks |

## Authentication Header

All protected routes expect:
```
Authorization: Bearer <accessToken>
```
