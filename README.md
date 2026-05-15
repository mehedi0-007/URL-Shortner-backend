# URL Shortener API

A feature-rich URL Shortener REST API built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), and [PostgreSQL](https://www.postgresql.org/).

## Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens), including Access and Refresh tokens.
- **Role-based Authorization**: Role-based access control (RBAC) separating "user" functionality from administrative features.
- **Advanced URL Shortening**: Create shortened URLs with expiration dates.
- **Analytics & Tracking**: Tracks URL visits including the IP address, country, and city (via `geoip-lite`).
- **Data Persistence**: Uses PostgreSQL for robust relational data modeling.
- **Secure Password Hashing**: Utilizes bcrypt to safely store user credentials.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js/TypeScript)
- **ORM / Database Tool**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Security**: Passport, JWT, bcrypt
- **Validation**: `class-validator` and `class-transformer`
- **Geolocation**: `geoip-lite`

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) database running
- npm, yarn, or pnpm

## Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (using `.env.example` if available) and add the following variables:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortner?schema=public"

# JWT Secrets for authentication
JWT_SECRET="your_jwt_access_secret_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_here"
```

### 3. Database Setup

Apply the Prisma migrations to set up your database schema and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Running the Application

```bash
# development mode
npm run start

# watch mode (recommended for development)
npm run start:dev

# production mode
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000` (by default).

## Scripts

- `npm run build`: Compile the application
- `npm run format`: Format code using Prettier
- `npm run lint`: Lint code using ESLint
- `npm run test`: Run automated tests

## API Concepts

- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- **URLs**: Users can authenticate and create short URLs, retrieve basic details, and URLs have built-in expiration policies.
- **Analytics**: Each click on a shortened URL is recorded with geographical data to help users track visit origins.
