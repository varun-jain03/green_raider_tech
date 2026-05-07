# Team Task Manager — Frontend

A responsive single-page frontend for the Team Task Manager assignment, built with **React + Redux Toolkit + Tailwind CSS** and integrated with the backend REST APIs using `fetch`.

## Stack

- React (Vite)
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Fetch API (no Axios)
- Feature-based modular architecture

## Features

- **Authentication**: Register/Login flow with JWT persistence in browser storage
- **Role-Based UI**
  - `admin`: project/task creation workflows visible in UI
  - `member`: restricted views/actions; backend enforces final RBAC rules
- **Dashboard**: status summary cards from `/api/dashboard/stats`
- **Projects**: list projects, create project (admin workflow)
- **Tasks**: list/filter tasks, create task (admin), status updates
- **Responsive Design**: mobile-first layout for auth, navigation, forms, and data sections

## Setup

```bash
# 1. Move to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start development server
npm run dev
```

## Environment Variables

| Key                 | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL including `/api` path            |

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Consumption

The app consumes these backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard/stats`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `GET /api/users`
- `GET /api/users/me`

All protected requests send:

```http
Authorization: Bearer <accessToken>
```

## Available Scripts

- `npm run dev`: start local development server
- `npm run build`: create production build
- `npm run preview`: preview production build
