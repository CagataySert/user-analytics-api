# User Management & Analytics System

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in the correct values

# Start the app
npm run start:dev
```

### Seed Example Data
After setting up the environment, you can populate the database with example and admin data by running:

```bash
# Seed the database with example and admin data
npm run seed
```
This will populate the system with initial data, including an admin user and example users for testing purposes.


## Overview

This project is a **User Management and Analytics System** developed using **NestJS**, **PostgreSQL**, and **Redis**. The system supports user registration, login, profile management, and real-time analytics for admins. It includes robust role-based access control and background job processing for reporting and monitoring.


## Features

### ✅ User Registration and Authentication
- User registration with email and password
- Secure password hashing
- JWT-based authentication
- Simulated email activation (token-based)

### ✅ Role-Based Access Control (RBAC)
- Two roles: `user` and `admin`
- Admins can manage users and view analytics
- Users can log in and manage their profiles

### ✅ User Activity Tracking
- Tracks user logins, profile updates, and failed login attempts
- Activity logs stored in PostgreSQL
- Recent activity cached in Redis

### ✅ Admin Analytics Dashboard
- Metrics shown:
  - Total number of users
  - Active users (last 7 days)
  - Failed login attempts (last 24 hours)
  - New users registered (last 7 days)
- Dashboard data cached in Redis (TTL: 10 minutes)

### ✅ Background Jobs
- Daily reports on:
  - Number of logins
  - Failed login attempts
  - New user registrations
- Reports stored in PostgreSQL and cached in Redis

### 🧪 Additional Features (Implemented if time permits)
- Rate limiting (e.g., 5 login attempts per 15 minutes)
- Activity-based alerts for admins (e.g., spikes in failed logins)
- Dynamic filtering in dashboard by user role and time
- Cache invalidation strategy to ensure consistency
  

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache/Jobs**: Redis
- **Authentication**: JWT
- **Task Scheduler**: e.g., Bull or another job queue library // todo update tech
- **API Testing**: Postman
