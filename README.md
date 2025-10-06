This is the backend service for the Task Management System.
It provides REST APIs for user authentication, task management, collaboration (comments, file attachments), and analytics.
Built with Node.js, Express, and MongoDB for a secure and scalable architecture.

## Features

User Authentication & Authorization (JWT-based)

Task CRUD Operations (Create, Read, Update, Delete)

Collaboration via Comments

Analytics & Insights (status, priority, trends, performance)

Secure API with CORS, Cookies & Environment Config

## Technologies Used

Express 5 → Fast and minimal Node.js framework for building APIs.

Mongoose 8 → Elegant MongoDB object modeling for schema and queries.

bcrypt 6 → Secure password hashing for authentication.

jsonwebtoken 9 → JWT-based authentication and authorization.

cors 2 → Enables secure cross-origin requests.

## Env Details

MONGODB_URI = mongodb://localhost:27017/taskmanagement

ACCESS_TOKEN_SECRET = accessTokenSecret

REFRESH_TOKEN_SECRET = refreshTokenSecret
