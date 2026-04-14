# Rent Management System

A full-stack web application for property owners to manage tenants, track monthly rent collection, record payments with receipt uploads, and send automated SMS reminders via Twilio.

---

## Features

- **Tenant Management** — Add, edit, and deactivate tenants with lease details
- **Rent Cycles** — Auto-generate monthly rent records for all active tenants
- **Payment Recording** — Record payments with method, transaction ID, and receipt upload
- **Dashboard** — Real-time summary of collections, pending, and overdue rent
- **SMS Reminders** — Automated daily reminders via Twilio for upcoming/overdue rent
- **JWT Auth** — Secure owner login with protected routes

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Twilio account (optional for SMS)

### Backend

```bash
cd backend
npm install
# Edit .env with your MongoDB URI, JWT secret, and Twilio credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## Docker

```bash
# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env

docker-compose up --build
```

- Frontend → http://localhost
- Backend API → http://localhost:5000
- MongoDB → localhost:27017

---

## Environment Variables

| Variable             | Description                         |
|----------------------|-------------------------------------|
| `MONGO_URI`          | MongoDB connection string           |
| `JWT_SECRET`         | Secret key for JWT signing          |
| `JWT_EXPIRES_IN`     | Token expiry (e.g. `7d`)            |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID                  |
| `TWILIO_AUTH_TOKEN`  | Twilio Auth Token                   |
| `TWILIO_PHONE_NUMBER`| Twilio sender phone number          |
| `FRONTEND_URL`       | Frontend origin for CORS            |

---

## Project Structure

See [docs/architecture.md](docs/architecture.md) for full architecture details.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Query
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JSON Web Tokens
- **SMS**: Twilio
- **Scheduler**: node-cron
- **Containerization**: Docker + Docker Compose
