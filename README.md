# Full-Stack Authentication Application

This repository contains a full-stack web application featuring user authentication (sign-up and sign-in) with secure token management and session invalidation.

**Stack:**

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, MongoDB, Mongoose ODM, JWT + Passport.js
- **Database**: MongoDB with Docker Compose

## Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Install Docker & Docker Compose

Ensure Docker and Docker Compose are installed on your machine:

```bash
docker --version
docker compose version
```

### 2. Start MongoDB with Docker Compose

A `docker-compose.yml` file is provided at the root to spin up MongoDB and Mongo Express.

```bash
# Start MongoDB and Mongo Express services
docker compose up -d

# Verify containers are running
docker compose ps
```

**Services:**

- **MongoDB**: `mongodb://admin:password@localhost:27017/auth_db`
  - Admin Username: `admin`
  - Admin Password: `password`
  - Database: `auth_db`
- **Mongo Express UI**: `http://localhost:8081`
  - Username: `admin`
  - Password: `password`
  - Access to browse and manage collections

### 3. Configure Backend Environment

The backend automatically connects to MongoDB using the default credentials in the docker-compose.yml.

Navigate to the `backend` directory and ensure `.env` is configured (if needed):

```bash
cd backend
# Default MongoDB connection is hardcoded in app.module.ts
# Update if using different credentials
```

### 4. Run Backend

```bash
cd backend
npm install
npm run start:dev
```

**Backend runs on**: `http://localhost:3000`

- **Swagger API Docs**: `http://localhost:3000/api`
- **API Endpoints**:
  - `POST /auth/signup` - Register new user
  - `POST /auth/signin` - Login user
  - `POST /auth/logout` - Logout user (invalidates token)
  - `GET /app/welcome` - Protected route (requires JWT token)

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

**Frontend runs on**: `http://localhost:3001` (or `3000` if available)

- **Sign In**: `http://localhost:3001/signin`
- **Sign Up**: `http://localhost:3001/signup`
- **Dashboard**: `http://localhost:3001/dashboard` (protected route)

## Database Connection Details

### Backend to MongoDB Connection

The NestJS backend connects to MongoDB via Mongoose in `src/app.module.ts`:

```typescript
MongooseModule.forRoot("mongodb://admin:password@localhost:27017/auth_db");
```

The connection uses credentials from `docker-compose.yml`:

- **Host**: `localhost` (or `mongodb` service name within Docker network)
- **Port**: `27017`
- **Username**: `admin`
- **Password**: `password`
- **Database**: `auth_db`

### Verify Database Connection

1. **Via Mongo Express** (UI):
   - Open `http://localhost:8081`
   - Navigate to `auth_db` database
   - View collections: `users`, `_prisma_migrations`

2. **Via MongoDB CLI**:
   ```bash
   mongosh "mongodb://admin:password@localhost:27017/auth_db"
   ```

## Features

- ✅ **Secure JWT Authentication** with token versioning for session invalidation
- ✅ **HttpOnly Cookies** for secure token storage (Next.js Server Actions)
- ✅ **Password Hashing** using bcrypt
- ✅ **Logout with Token Invalidation** - old tokens rejected server-side
- ✅ **Request Interceptor** - auto-attaches Bearer token to API calls
- ✅ **Protected Routes** - middleware redirects unauthenticated users
- ✅ **Input Validation** - client (zod) and server (class-validator)
- ✅ **Premium UI** - dark mode, gradients, animations, responsive design
- ✅ **Rich API Documentation** - Fully detailed Swagger UI with schemas, example values, endpoint descriptions, and testing capabilities

## Docker Compose Commands

```bash
# Start services in background
docker compose up -d

# View running containers
docker compose ps

# View logs
docker compose logs -f mongodb
docker compose logs -f mongo-express

# Stop all services
docker compose down

# Remove containers and volumes (reset database)
docker compose down -v
```

## Troubleshooting

### Backend can't connect to MongoDB

- Ensure `docker compose up -d` completed successfully
- Check MongoDB is running: `docker compose ps`
- Verify credentials in `src/app.module.ts` match docker-compose.yml
- Check firewall isn't blocking port 27017

### MongoDB connection refused

```bash
# Reset MongoDB
docker compose down -v
docker compose up -d
```

### Can't access Mongo Express

- Ensure it started: `docker compose ps`
- If failed, check logs: `docker compose logs mongo-express`
- Try accessing `http://localhost:8081` (not `127.0.0.1`)

### Backend won't start

```bash
# Check logs
cd backend
npm run start:dev

# Verify dependencies
npm install

# Clear node_modules if needed
rm -rf node_modules package-lock.json
npm install
```
