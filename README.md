# 🚀 URL Shortener API

<p align="center">
  A high-performance, robust, and feature-rich <strong>URL Shortener REST API</strong> built to securely shrink links, track visitors, and manage user roles.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## ✨ Features

- 🔐 **JWT Authentication**: Highly secure login and token refresh flows.
- 🛡️ **Role-Based Access Control**: Route protections for authenticated users.
- 🔗 **Advanced URL Shortening**: Easily map long URLs to short codes. Built-in link regeneration.
- ⏳ **URL Expiration Policies**: Self-expiring short URLs with extension capabilities.
- 🌍 **Visitor Analytics**: Tracks IP addresses and converts them into geological data (City/Country) upon each visit using `geoip-lite`.
- 🗄️ **Robust Persistence**: Optimized schema managed through Prisma onto a robust PostgreSQL database.

---

## 🛠️ Tech Stack

- **Backend**: NestJS, Node.js, Express.js
- **Database Architecture**: PostgreSQL, Prisma ORM
- **Security**: Passport.js, JWT, bcrypt
- **Validation**: class-validator, class-transformer
- **Dev-Tools**: ESLint, Prettier, Jest (Testing)

---

## 📦 Dependency Setup Guide

Follow these simple steps directly after cloning the repository.

### 1. Prerequisites
Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/en/) (v16.x or newer)
- [PostgreSQL](https://www.postgresql.org/) (Running instances)
- [Git](https://git-scm.com/)

### 2. Install Project Dependencies
Run the installation command from the project root:

```bash
npm install
```

### 3. Environment Variables
Create a `.env` file mechanically mimicking your setup needs:

```env
# Server Target URLs
SHORT_URL_BASE="http://localhost:3000/"

# Database Engine Setup
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/url_shortner?schema=public"

# Credentials
JWT_SECRET="your_highly_secure_access_secret"
JWT_REFRESH_SECRET="your_highly_secure_refresh_secret"
```

### 4. Setup the Database
Migrate your PostgreSQL DB logic and generate the Prisma Client bindings:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## 🚀 How to Use the Project

### Running the Application

For the best development experience, run the application utilizing built-in watcher files natively provided by NestJS.

```bash
# 🟡 Local Development Mode
$ npm run start

# 🟢 Watch Mode (Recommended for testing features on the fly)
$ npm run start:dev

# 🔴 Production Deployment Node
$ npm run build
$ npm run start:prod
```

If utilizing standard routes, your local instance should operate correctly on: `http://localhost:3000/`.

---

## 📖 API Reference Endpoints

All major endpoints for the platform are listed below:

### 🔐 Authentication Endpoints (`/auth`)
*   `POST /auth/login` - Authenticate an existing user and return access/refresh tokens.
*   `POST /auth/refresh` - Swap a refresh token for a newly updated access token. *(Guarded)*
*   `POST /auth/logout` - Invalidate current session and log the user out. *(Guarded)*

### 👤 User Endpoints (`/user`)
*   `POST /user/register` - Create a brand new user profile within the database.
*   `GET /user/:id` - Fetch user details globally utilizing a standard UUID/Cuid. *(Guarded)*
*   `PATCH /user/:id` - Modify or update the target user password securely. *(Guarded)*
*   `DELETE /user/:id` - Wipe the target user entity entirely from the system. *(Guarded)*

### 🔗 URL Endpoints (`/url`)
*   `POST /url` - Shorten a fresh URL payload string context to a standard short URL code. *(Guarded)*
*   `GET /url/:shortCode` - Re-direct operation pointing `<domain>/url/<shortCode>` to actual URL. Tracks visits & analytics.
*   `PATCH /url/extend/:id` - Re-extend the timestamp validations to +24H from now for a given `Url`. *(Guarded)*
*   `PATCH /url/regenerate/:id` - Refresh the `<shortCode>` strings completely mapping to existing payload contexts. *(Guarded)*
*   `DELETE /url/:id` - Wipes context mapping parameters ensuring links drop explicitly completely. *(Guarded)*

---

This configuration structure is explicitly developed and structured via `@nestjs/core`, `@nestjs/common`, and custom components designed throughout current local workspaces mapped logically in `src/`.
