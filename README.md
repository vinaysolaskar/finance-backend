  # Finance Backend System

A production-ready backend system built with **NestJS**, designed to handle authentication, user management, and financial data operations with scalability, security, and performance in mind.

---

## Live Deployment

**Base URL:**
`https://finance-backend-ho41.onrender.com`

**API Docs (Swagger):**
`https://finance-backend-ho41.onrender.com/api-docs`

---

## Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL (via Prisma ORM)
* **Caching:** Redis (Upstash)
* **Authentication:** JWT (Access Tokens)
* **Rate Limiting:** @nestjs/throttler
* **Logging:** Winston + Daily Rotate File
* **Validation:** class-validator + class-transformer
* **Deployment:** Render

---

## Architecture Overview

The application follows a **modular architecture**:

```
src/
│
├── auth/          → Authentication (JWT login/signup)
├── users/         → User management (roles, status)
├── finance/       → Financial operations & summaries
├── prisma/        → Database client (Prisma)
├── redis/         → Redis caching layer
├── common/        → Middleware, filters, utilities
│
├── app.module.ts  → Root module
└── main.ts        → App bootstrap
```

---

## Features

### Authentication & Authorization

* JWT-based login/signup
* Role-based access control (RBAC)
* Secure password handling

---

### User Management

* Fetch users
* Update roles
* Enable/disable user accounts

---

### Finance Module

* Create financial records
* Fetch all records
* Get financial summary
* Update & delete records

---

### Redis Caching

* Caches finance summary
* Reduces DB load
* TTL-based invalidation

---

### Rate Limiting

* Global API throttling
* Prevents abuse & brute-force attacks
* Configurable per route

---

### Logging System

* Console logs (dev-friendly)
* File logs with daily rotation
* Structured logging using Winston

---

### Validation & Error Handling

* Global validation pipe
* Custom error formatting
* Centralized exception filter

---

## Environment Variables

Create a `.env` file:

```
PORT=3000

DATABASE_URL=your_postgres_url

JWT_SECRET=your_secret

REDIS_URL=your_redis_url
```

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start development server
npm run start:dev
```

---

## Production Build

```bash
npm run build
npm run start:prod
```

---

## API Testing

### 🔹 Login

```bash
curl -X POST /auth/login
```

### 🔹 Signup

```bash
POST /auth/signup
```

### 🔹 Finance APIs

* `POST /finance`
* `GET /finance`
* `GET /finance/summary`

---

## Key Design Decisions

### 1. Modular Architecture

Each domain (Auth, Users, Finance) is isolated → improves scalability & maintainability.

---

### 2. Prisma ORM

* Type-safe queries
* Easy migrations
* Clean DB abstraction

---

### 3. Redis Integration

* Used for caching heavy computations (finance summary)
* Improves performance significantly

---

### 4. Rate Limiting Strategy

* Global throttling using NestJS Throttler
* Prevents API abuse
* Can be extended to per-user limits

---

### 5. Logging Strategy

* Winston used for structured logging
* Logs stored in rotating files for observability

---

## Future Improvements

* Refresh Tokens (Auth)
* Advanced analytics for finance data
* Smart cache invalidation strategies
* Distributed rate limiting using Redis
* Unit & E2E testing (Jest)
* Docker containerization

---

## Challenges Faced

* Handling Redis connection stability in production
* Configuring rate limiting correctly with latest NestJS version

---

## Author

**Vinay**
:Backend Developer

---

## Final Notes

This project demonstrates:

* Clean architecture
* Production-ready practices
* Strong backend fundamentals
* Real-world deployment experience

---