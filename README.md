# DevHire — AI-Powered Developer Hiring Platform

> A full-stack developer hiring platform that connects talented developers with top companies. Built with modern technologies and powered by Google Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-DevHire-6366f1?style=for-the-badge)](https://devhire-client-app.vercel.app)
[![API](https://img.shields.io/badge/API-Render-10b981?style=for-the-badge)](https://devhire-server.onrender.com/api/v1/health)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Role-Based Access](#-role-based-access)
- [AI Features](#-ai-features)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)

---

## 🌟 Overview

DevHire is a full-stack web application designed to streamline the technical hiring process. It provides a dedicated platform where:

- **Developers (USERs)** can discover jobs, apply with cover letters, write reviews, analyze their resumes with AI, and manage their professional profiles.
- **Recruiters** can post job listings, review and manage applicants, use AI to auto-generate job descriptions, and track hiring pipelines.
- **Admins** have full platform control including user management, analytics dashboards with live charts, and content moderation.

The platform integrates Google Gemini AI to power four distinct features: a job-search chatbot, an AI resume analyzer, a smart search assistant, and an AI review summarizer.

---

## ✨ Features

### For Developers (USER)
- Browse and search thousands of developer job listings
- Advanced filters — category, job type, salary range, location
- One-click job application with optional cover letter
- AI Resume Analyzer — paste resume text and receive a score, skill gaps, strengths, and job suggestions
- AI Job Chatbot — conversational career advice powered by Gemini
- Write, edit, and delete job reviews with star ratings
- Personal dashboard with application tracking and status updates
- Public developer profile with skills, GitHub, bio, and avatar

### For Recruiters
- Post, edit, and manage job listings
- AI Job Description Generator — provide a title and company, get a professional description instantly
- Applicant management dashboard with status pipeline (Pending → Reviewed → Shortlisted → Rejected → Hired)
- View applicant profiles including skills, GitHub, and cover letters

### For Admins
- Full user management — search, filter, change roles, delete accounts
- Platform-wide job management with delete capability
- Analytics dashboard — bar, line, and pie charts with live data
- Dashboard statistics — total users, jobs, applications, and reviews
- Recent activity feed

### Platform-Wide
- JWT-based authentication with role-based access control
- Dark mode / Light mode with system preference detection
- Fully responsive design — mobile, tablet, and desktop
- AI Review Summary — generate a Gemini-powered summary of all reviews for any job listing

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Google Gemini API | AI features |
| express-validator | Input validation |
| Morgan + Helmet | Logging and security |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| next-themes | Dark mode |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| Lucide React | Icons |

### Infrastructure
| Service | Purpose |
|---|---|
| Render | Backend deployment |
| Vercel | Frontend deployment |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
devhire/
├── devhire-server/                 # Express.js Backend
│   └── src/
│       ├── config/
│       │   ├── database.ts         # MongoDB connection manager
│       │   └── env.ts              # Environment variable validation
│       ├── controllers/            # Request/response handlers
│       │   ├── auth.controller.ts
│       │   ├── user.controller.ts
│       │   ├── job.controller.ts
│       │   ├── application.controller.ts
│       │   ├── review.controller.ts
│       │   ├── dashboard.controller.ts
│       │   └── ai.controller.ts
│       ├── services/               # Business logic layer
│       │   ├── auth.service.ts
│       │   ├── user.service.ts
│       │   ├── job.service.ts
│       │   ├── application.service.ts
│       │   ├── review.service.ts
│       │   ├── dashboard.service.ts
│       │   └── ai.service.ts
│       ├── models/                 # Mongoose schemas
│       │   ├── user.model.ts
│       │   ├── job.model.ts
│       │   ├── application.model.ts
│       │   └── review.model.ts
│       ├── middleware/             # Express middleware
│       │   ├── auth.middleware.ts  # JWT protect + role guards
│       │   ├── validate.middleware.ts
│       │   ├── errorHandler.ts
│       │   └── requestLogger.ts
│       ├── routes/                 # API route definitions
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   ├── user.routes.ts
│       │   ├── job.routes.ts
│       │   ├── application.routes.ts
│       │   ├── review.routes.ts
│       │   ├── dashboard.routes.ts
│       │   └── ai.routes.ts
│       ├── types/
│       │   └── auth.types.ts
│       ├── app.ts                  # Express app factory
│       └── server.ts               # HTTP server + graceful shutdown
│
└── devhire-frontend/               # Next.js 15 Frontend
    ├── app/
    │   ├── (auth)/                 # Public auth pages
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (main)/                 # Pages with Navbar + Footer
    │   │   ├── page.tsx            # Home / Landing
    │   │   ├── jobs/
    │   │   │   ├── page.tsx        # Jobs listing
    │   │   │   └── [id]/page.tsx   # Job details
    │   │   ├── ai-tools/page.tsx
    │   │   ├── about/page.tsx
    │   │   ├── contact/page.tsx
    │   │   └── blog/
    │   │       ├── page.tsx
    │   │       └── [slug]/page.tsx
    │   └── dashboard/              # Protected dashboard
    │       ├── page.tsx            # Overview (role-aware)
    │       ├── applications/
    │       ├── reviews/
    │       ├── profile/
    │       ├── my-jobs/            # Recruiter only
    │       ├── post-job/           # Recruiter only
    │       ├── users/              # Admin only
    │       ├── jobs/               # Admin only
    │       └── analytics/          # Admin only
    ├── components/
    │   ├── layout/                 # Navbar, Footer
    │   ├── home/                   # Landing page sections
    │   ├── jobs/                   # Job cards, filters, pagination
    │   ├── ai/                     # AI tool components
    │   ├── dashboard/              # Dashboard layout + sidebar
    │   ├── auth/                   # ProtectedRoute HOC
    │   └── providers/              # ThemeProvider
    ├── contexts/
    │   └── AuthContext.tsx         # Global auth state + hooks
    ├── services/                   # API service layer
    │   ├── auth.service.ts
    │   ├── job.service.ts
    │   ├── user.service.ts
    │   ├── application.service.ts
    │   ├── review.service.ts
    │   ├── ai.service.ts
    │   └── dashboard.service.ts
    ├── lib/
    │   ├── axios.ts                # Axios instance + JWT interceptors
    │   └── utils.ts                # Helper functions
    └── types/
        └── index.ts                # Shared TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([Get one free](https://aistudio.google.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devhire.git
cd devhire
```

### 2. Backend Setup

```bash
cd devhire-server
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section)
npm run dev
```

### 3. Frontend Setup

```bash
cd devhire-frontend
npm install
cp .env.local.example .env.local
# Add your API URL
npm run dev
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:4000`

---

## 🔑 Environment Variables

### Backend (`devhire-server/.env`)

```env
# Server
NODE_ENV=development
PORT=4000
HOST=localhost
CORS_ORIGIN=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net
DB_NAME=devhire

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`devhire-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 📡 API Documentation

### Base URL
```
Production:  https://devhire-server.onrender.com/api/v1
Development: http://localhost:4000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Protected | Get current user profile |
| PATCH | `/auth/role` | ADMIN | Change a user's role |

#### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | ADMIN | Get all users with search & pagination |
| GET | `/users/:id` | Protected | Get user by ID |
| PATCH | `/users/:id` | Own / ADMIN | Update profile |
| DELETE | `/users/:id` | ADMIN | Delete user |
| PATCH | `/users/:id/role` | ADMIN | Change role |

#### Jobs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Public | List jobs with search, filter, sort, pagination |
| GET | `/jobs/:id` | Public | Get single job |
| POST | `/jobs` | RECRUITER / ADMIN | Create job |
| PATCH | `/jobs/:id` | Owner / ADMIN | Update job |
| DELETE | `/jobs/:id` | Owner / ADMIN | Delete job |

**Query Parameters for `GET /jobs`:**
```
search     — Search title, description, category
category   — Filter by category
location   — Filter by location
jobType    — Filter by type (Full-time, Remote, etc.)
salaryMin  — Minimum salary
salaryMax  — Maximum salary
sort       — salary | -salary | createdAt | -createdAt
page       — Page number (default: 1)
limit      — Results per page (default: 10, max: 50)
```

#### Applications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/applications` | USER | Apply for a job |
| GET | `/applications/my` | USER | Get own applications |
| GET | `/applications/job/:jobId` | RECRUITER / ADMIN | Get applicants for a job |
| GET | `/applications` | ADMIN | Get all applications |
| PATCH | `/applications/:id/status` | RECRUITER / ADMIN | Update application status |
| DELETE | `/applications/:id` | USER (own) / ADMIN | Withdraw application |

#### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reviews/job/:jobId` | Public | Get reviews for a job |
| POST | `/reviews` | Protected | Submit a review |
| PATCH | `/reviews/:id` | Owner | Update own review |
| DELETE | `/reviews/:id` | Owner / ADMIN | Delete review |

#### Dashboard (ADMIN only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Overview statistics |
| GET | `/dashboard/chart-data/bar` | Monthly bar chart data |
| GET | `/dashboard/chart-data/line` | Daily line chart data |
| GET | `/dashboard/chart-data/pie` | Pie chart breakdowns |
| GET | `/dashboard/recent-activity` | Recent activity feed |

#### AI
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/ai/chat` | Protected | Job search chatbot |
| POST | `/ai/search-assistant` | Protected | Smart search suggestions |
| POST | `/ai/generate-description` | Protected | Generate job description |
| POST | `/ai/review-summary` | Protected | Summarize job reviews |
| POST | `/ai/analyze-resume` | Protected | Analyze resume text |

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 120,
    "totalPages": 12
  }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Something went wrong"
}
```

---

## 🔐 Role-Based Access

DevHire uses three roles with distinct permissions:

| Feature | USER | RECRUITER | ADMIN |
|---|:---:|:---:|:---:|
| Browse & search jobs | ✅ | ✅ | ✅ |
| Apply for jobs | ✅ | ❌ | ❌ |
| View own applications | ✅ | ❌ | ❌ |
| Write job reviews | ✅ | ❌ | ❌ |
| Post job listings | ❌ | ✅ | ✅ |
| Manage own jobs | ❌ | ✅ | ✅ |
| View applicants | ❌ | ✅ (own jobs) | ✅ |
| Update application status | ❌ | ✅ (own jobs) | ✅ |
| Manage all users | ❌ | ❌ | ✅ |
| Access analytics | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |

> **Note:** ADMIN role cannot be assigned during public registration. It must be assigned manually via the database or by an existing ADMIN through the `/api/v1/auth/role` endpoint.

---

## 🤖 AI Features

All AI features are powered by **Google Gemini 1.5 Flash** and require a valid `GEMINI_API_KEY`.

### 1. AI Job Chatbot
```
POST /api/v1/ai/chat
Body: { "message": "string", "history": [...] }
```
Conversational assistant that provides job recommendations, career advice, and salary insights based on the DevHire platform context.

### 2. AI Search Assistant
```
POST /api/v1/ai/search-assistant
Body: { "query": "string" }
```
Takes a natural language query and returns a suggestion paragraph, keyword tags, and recommended job categories to improve search results.

### 3. AI Job Description Generator
```
POST /api/v1/ai/generate-description
Body: { "title": "string", "company": "string", "skills": [], "location": "string" }
```
Generates a professional, structured job description from minimal input. Used by recruiters in the Post Job dashboard.

### 4. AI Review Summarizer
```
POST /api/v1/ai/review-summary
Body: { "jobId": "string" }
```
Fetches all reviews for a job and returns a sentiment analysis, summary paragraph, and key highlights.

### 5. AI Resume Analyzer
```
POST /api/v1/ai/analyze-resume
Body: { "resumeText": "string", "jobTitle": "string" }
```
Analyzes pasted resume text and returns an overall score (0–100), detected skills, experience summary, strengths, areas for improvement, and suggested job titles.

---

## 🎭 Demo Credentials

Use these accounts to explore the platform without registering:

| Role | Email | Password |
|---|---|---|
| Developer (USER) | `user@devhire.com` | `user123` |
| Recruiter | `recruiter@devhire.com` | `recruiter123` |
| Admin | `admin@devhire.com` | `admin123` |

> These accounts must be created in your database before use.

---

## 🚢 Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
5. Add all environment variables from the `.env` section above
6. Deploy

### Frontend → Vercel

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy — Vercel auto-detects Next.js

### Keep Backend Alive (Free Tier)

Render free instances sleep after 15 minutes of inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping your health endpoint every 5 minutes:

```
Monitor URL: https://your-backend.onrender.com/api/v1/health
Interval: Every 5 minutes
```

---

<div align="center">
  <p>Built By Kabir Hossain</p>
  <p>
    <a href="https://devhire-frontend.vercel.app">Live Demo</a> ·
    <a href="https://devhire-server.onrender.com/api/v1/health">API Health</a> ·
    <a href="mailto:nerob2308@gmail.com">Contact</a>
  </p>
</div>