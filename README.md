# NovaLearn

An AI-powered e-learning platform built with React, Node.js, Express, and MongoDB.

## Features

- JWT authentication with student and admin roles
- AI-inspired course discovery and learning recommendations
- Student dashboard with enrollments, progress, and learning streaks
- Admin dashboard with course creation, editing, publishing, and analytics
- Responsive, modern interface

## Quick start

1. Copy `server/.env.example` to `server/.env`.
2. Ensure MongoDB is running locally, or set `MONGODB_URI` to a MongoDB Atlas URL.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Seed demo data:

   ```bash
   npm run seed
   ```

5. Run both apps:

   ```bash
   npm run dev
   ```

Client: `http://localhost:5173`  
API: `http://localhost:5000`

Demo accounts:

- Admin: `admin@novalearn.dev` / `admin123`
- Student: `student@novalearn.dev` / `student123`
