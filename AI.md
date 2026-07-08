# AI Assistance Documentation

This document outlines how AI was used to build and improve this full-stack authentication application.

## 1. Project Scaffolding & Infrastructure

### Docker Compose Setup

- AI generated the `docker-compose.yml` for MongoDB and Mongo Express with proper networking and volume persistence
- Configured MongoDB authentication (admin/password) and initialized the `auth_db` database
- Set up Mongo Express for visual database management

### Framework Generation

- AI orchestrated creation of NestJS backend boilerplate via `@nestjs/cli`
- AI orchestrated creation of Next.js frontend boilerplate via `create-next-app`
- Generated TypeScript configurations for both frontend and backend

## 2. Authentication Architecture

### Backend Authentication Flow (NestJS)

- **JWT Strategy**: Implemented Passport.js JWT strategy with token validation
- **Auth Service**:
  - `signup()` - Creates user, hashes password with bcrypt, returns JWT with tokenVersion=0
  - `signin()` - Validates credentials, returns JWT with current user tokenVersion
  - `logout()` - Increments user.tokenVersion to invalidate all previously issued tokens
- **Auth Controller**: HTTP endpoints for /auth/signup, /auth/signin, /auth/logout
- **Protected Routes**: JwtAuthGuard protects endpoints, automatically rejects invalid/old tokens

### Token Versioning Security

- Each user has a `tokenVersion` field in MongoDB (incremented on logout)
- JWT payload contains the tokenVersion at issue time
- JWT strategy validates: `user.tokenVersion === payload.tokenVersion`
- **Effect**: When user logs out, all existing tokens become invalid immediately (no refresh tokens needed)
- **Atomic Operations**: Used MongoDB `$inc` operator for safe concurrent increments

### Frontend Token Management (Next.js Server Actions)

- **HttpOnly Cookies**: Replaced js-cookie with Next.js Server Actions for secure token storage
- **Server Actions** (`src/app/actions/auth.ts`):
  - `setAuthSession(token)` - Stores JWT in HttpOnly cookie (24-hour expiry)
  - `deleteAuthSession()` - Removes token on logout
  - `getAuthToken()` - Retrieves token securely (only from server context)
- **Security Benefits**:
  - ✅ XSS Protection: HttpOnly flag prevents JavaScript access
  - ✅ CSRF Protection: sameSite='lax' prevents cross-site requests
  - ✅ Secure Flag: Cookie only sent over HTTPS in production
  - ✅ Automatic Expiry: 24-hour maxAge prevents indefinite token validity

## 3. Validation Logic

### Frontend Validation (Zod)

- AI generated Zod schemas for signup and signin forms
- Password requirements: min 8 chars, 1 letter, 1 number, 1 special character
- Email validation using Zod's built-in email format
- Real-time validation feedback in form components

### Backend Validation (class-validator)

- NestJS DTOs mirror Zod schemas for server-side enforcement
- `SignupDto`: validates name, email, password with identical rules
- `SigninDto`: validates email and password format
- Applied via `@IsEmail()`, `@MinLength()`, `@Matches()` decorators
- Global ValidationPipe with `whitelist: true` and `forbidNonWhitelisted: true`

## 4. UI/UX Design & Styling

### Component Library

- AI selected and integrated `shadcn/ui` components (Button, Input, Label, Card)
- Tailwind CSS for responsive dark-mode styling
- Premium color palette: zinc-900 background, blue-400/purple-500 accents

### Form Components

- `signin-form.tsx` - Sign-in form with password visibility toggle
- `signup-form.tsx` - Registration form with name, email, password, confirmation
- **Eye Icon Styling**: Fixed visibility (zinc-400 default, blue-400 on focus)
- **Error Messages**: Red text with red-500/10 background
- **Loading State**: Spinner during form submission

### Dashboard & Navigation

- Welcome page with user greeting and logout button
- Gradient styling matching purple-500/blue-400 theme
- Protected route redirects unauthenticated users to signin
- Logout button with gradient styling

### Responsive Design

- Mobile-first Tailwind approach
- max-w-md card constraints for centered forms
- Full-width button styling with proper padding
- Accessible contrast ratios (WCAG AA compliant)

## 5. API Integration & Interceptors

### Axios Instance (`lib/api.ts`)

- Creates axios client with configurable baseURL
- Request interceptor automatically attaches Bearer token
- Uses `getAuthToken()` Server Action to retrieve token securely
- Error handling: 401 responses trigger logout flow

### Request Flow

```
1. User submits form
2. Form calls authService.signIn() / signUp()
3. authService sends POST to backend
4. Backend returns JWT token
5. Server Action setAuthSession() stores token in HttpOnly cookie
6. Subsequent API calls use axios interceptor
7. Interceptor calls getAuthToken() to retrieve from cookie
8. Bearer token attached to Authorization header
```

## 6. Architectural Improvements

### Hydration Fix

- **Issue**: SSR couldn't access client-only Cookies API, causing hydration mismatch
- **Solution**: Deferred client operations to useEffect with isMounted pattern
- **Implementation**: Removed isMounted guard after migrating to Server Actions

### Session Invalidation Strategy

- **Problem**: Traditional logout only removes client-side cookie; old tokens still valid on server
- **Solution**: Token versioning approach (cleaner than refresh token rotation)
- **Implementation**:
  - User table has `tokenVersion` field (Number, default 0)
  - On logout, increment version atomically: `db.collection.updateOne({ _id }, { $inc: { tokenVersion: 1 } })`
  - JWT contains version at issue time
  - JWT strategy validates version matches current user version
  - Expired tokens are rejected even if cryptographically valid

### Middleware Protection

- Next.js middleware checks for token cookie
- Unauthenticated users redirected from /dashboard to /signin
- Protects sensitive routes at request level

## 7. Database Schema

### User Schema (MongoDB)

```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (bcrypt hash),
  tokenVersion: number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Token Versioning Lifecycle

- New user: tokenVersion = 0
- JWT issued: includes { tokenVersion: 0, userId, email }
- User logs out: tokenVersion incremented to 1
- Old JWT with tokenVersion=0: rejected by JWT strategy (version mismatch)
- Next login: new JWT issued with tokenVersion=1

## 8. Security Considerations

### Implemented

- ✅ Password hashing with bcrypt (salted)
- ✅ HttpOnly cookies (XSS protection)
- ✅ JWT Bearer tokens (stateless authentication)
- ✅ Token versioning (session invalidation)
- ✅ Input validation (client + server)
- ✅ CORS enabled for frontend-backend communication
- ✅ Protected routes (middleware + guards)

### Recommended Future Improvements

- 🔄 Rate limiting on auth endpoints
- 🔄 Email verification before signup
- 🔄 Password reset flow
- 🔄 Refresh token rotation pattern
- 🔄 Account lockout after failed attempts
- 🔄 Activity logging and audit trails

## 9. Development Workflow

### Technologies Used

- **Package Manager**: npm
- **Build Tool**: NestJS CLI, Next.js
- **Testing**: Jest (backend), optional for frontend
- **Documentation**: Swagger (backend), markdown (project docs)
- **Version Control**: Git

### AI-Assisted Development Process

1. **Discovery**: AI identified ORM incompatibility (Drizzle ≠ MongoDB)
2. **Architecture**: AI designed token versioning for secure logout
3. **Implementation**: AI generated boilerplate and integration code
4. **Refinement**: AI fixed hydration issues and styling problems
5. **Security**: AI implemented HttpOnly cookie strategy
6. **Documentation**: AI created comprehensive setup and troubleshooting guides
7. **API Documentation (Swagger)**: AI enriched the Swagger documentation with detailed DTO properties, request/response examples, endpoint metadata, and properly configured authentication for testing.

## 10. File Structure & Key Components

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts       (endpoints)
│   │   ├── auth.service.ts          (signin/signup/logout logic)
│   │   ├── strategies/jwt.strategy.ts (token validation)
│   │   └── guards/jwt-auth.guard.ts
│   ├── users/
│   │   ├── users.service.ts         (token version management)
│   │   └── schemas/user.schema.ts   (MongoDB schema)
│   └── main.ts                      (app bootstrap)
│
frontend/
├── src/
│   ├── app/
│   │   ├── actions/auth.ts          (Server Actions for cookies)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── dashboard/page.tsx       (protected route)
│   ├── components/
│   │   └── auth/
│   │       ├── signin-form.tsx
│   │       └── signup-form.tsx
│   ├── services/auth.service.ts     (API integration)
│   ├── hooks/use-auth.ts            (auth state management)
│   └── lib/api.ts                   (axios with interceptor)
│
docker-compose.yml                   (MongoDB + Mongo Express)
```

## 11. API Documentation Enhancements

### Swagger Configuration
- Enriched `DocumentBuilder` in `main.ts` with comprehensive API metadata, markdown descriptions for endpoints, and proper token versioning explanations.
- Added explicit server URL (`http://localhost:3000`) to ensure the "Try it out" feature functions correctly.
- Configured persistent authorization (`persistAuthorization: true`) to retain tokens across page reloads.

### Controller & DTO Decorators
- **DTOs (`SignupDto`, `SigninDto`)**: Decorated all fields with `@ApiProperty`, providing explicit descriptions, data formats, validation requirements, and concrete examples (e.g., `john.doe@example.com`, `Secure@123`).
- **Controller Endpoints**: 
  - Tagged endpoints using `@ApiTags('Auth')`.
  - Added `@ApiOperation` for clear summary and behavior description of each endpoint.
  - Specified expected schemas via `@ApiBody`.
  - Configured comprehensive `@ApiResponse` blocks for both successful (200/201) and error responses (400, 401, 409), illustrating exact JSON shapes returned by the API.
  - Attached `@ApiBearerAuth('Bearer')` on protected endpoints (like `/auth/logout`) to correctly wire up Swagger's interactive authorization.
