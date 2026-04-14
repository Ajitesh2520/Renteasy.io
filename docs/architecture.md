# Architecture

## Overview

Rent Management System is a full-stack web app for property owners to manage tenants, track rent cycles, record payments, and send automated SMS reminders.

---

## Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB (Mongoose ODM)               |
| Auth       | JWT (Bearer token)                   |
| SMS        | Twilio                               |
| Scheduler  | node-cron                            |
| Container  | Docker + Docker Compose              |

---

## Backend Structure

```
src/
├── config/         # DB connection, env vars, SMS provider
├── constants/      # Shared enums (RENT_STATUS, PAYMENT_METHOD)
├── controllers/    # Route handlers (thin layer)
├── middlewares/    # Auth guard, global error handler
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── services/       # Business logic
├── jobs/           # Cron jobs (daily rent reminders)
└── utils/          # Logger, helpers
```

### Data Models

**User** — Property owner/admin account.
**Tenant** — Tenant record linked to a User (owner).
**RentCycle** — One record per tenant per month. Tracks amount due, paid, status.
**Payment** — Each payment transaction, linked to a RentCycle.

### API Endpoints

| Method | Path                     | Description                  |
|--------|--------------------------|------------------------------|
| POST   | /api/auth/register       | Register owner               |
| POST   | /api/auth/login          | Login, receive JWT           |
| GET    | /api/auth/me             | Current user info            |
| GET    | /api/tenants             | List tenants                 |
| POST   | /api/tenants             | Create tenant                |
| PUT    | /api/tenants/:id         | Update tenant                |
| DELETE | /api/tenants/:id         | Deactivate tenant            |
| GET    | /api/rent                | List rent cycles (filtered)  |
| POST   | /api/rent                | Generate monthly cycles      |
| PATCH  | /api/rent/:id/status     | Update status                |
| GET    | /api/rent/summary        | Dashboard summary            |
| GET    | /api/payments            | Payment history              |
| POST   | /api/payments            | Record payment (+receipt)    |

---

## Frontend Structure

```
src/
├── api/        # Axios client + typed API functions
├── components/ # Reusable UI components
├── context/    # AuthContext (JWT management)
├── hooks/      # React Query hooks (useTenants, etc.)
├── layouts/    # DashboardLayout with sidebar nav
├── pages/      # Route-level page components
├── types/      # TypeScript interfaces
└── utils/      # Date + currency formatting
```

---

## Automated Jobs

The `rentReminderJob` runs daily at **9:00 AM IST** via `node-cron`:
1. Marks any past-due PENDING cycles as OVERDUE.
2. Sends SMS reminders (via Twilio) to tenants whose rent is due within 3 days or already overdue, if a reminder hasn't been sent yet.

---

## Docker Deployment

```
docker-compose up --build
```

- MongoDB: port 27017
- Backend API: port 5000
- Frontend (nginx): port 80
