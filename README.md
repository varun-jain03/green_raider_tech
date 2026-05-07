# Team Task Manager (Full Stack)

A full-stack Team Task Manager application where users can create projects, assign tasks, and track progress with role-based access control (**Admin** / **Member**).

## Project Overview

This repository contains:

- `backend`: REST API with authentication, RBAC, project/task management, and dashboard stats
- `frontend`: responsive React application that consumes backend APIs using `fetch`

## Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Fetch API

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Core Features

- User authentication (Signup / Login)
- Role-based access control
  - Admin: manage projects, tasks, users, members
  - Member: access assigned scope; update status of assigned tasks
- Project management
- Task creation, assignment, and status tracking
- Dashboard metrics (totals, statuses, overdue, personal tasks)
- Responsive web UI

## Repository Structure

```text
green_raider_tech/
├── backend/
│   └── README.md
└── frontend/
    └── README.md
```

## Prerequisites

- Node.js (18+ recommended)
- npm
- MongoDB instance (local or cloud)

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as reference.

Required keys:

- `PORT`
- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `SALT_ROUNDS`
- `NODE_ENV`

### Frontend (`frontend/.env`)

Use `frontend/.env.example` as reference.

Required key:

- `VITE_API_BASE_URL` (example: `http://localhost:5000/api`)

## Local Setup

### 1) Install dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 2) Configure environment files

```bash
# backend
cd backend
cp .env.example .env

# frontend
cd ../frontend
cp .env.example .env
```

### 3) Run both apps

```bash
# terminal 1 (backend)
cd backend
npm run dev

# terminal 2 (frontend)
cd frontend
npm run dev
```

## API and App Access

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173` (default Vite port)
  
### Backend service

- Build/install: `npm install`
- Start: `npm run dev` (or production start script if added)
- Set backend environment variables from `.env`

### Frontend service

- Build: `npm run build`
- Start: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Set `VITE_API_BASE_URL` to deployed backend URL + `/api`

## Additional Documentation

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`
  