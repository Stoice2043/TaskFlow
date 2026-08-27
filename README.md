# TaskFlow

TaskFlow is a full-stack task and project management application built using a microservices-based architecture.

The application allows users to securely register and log in, create and manage projects, create tasks inside projects, track task progress, filter tasks, and view an overview of their work through a dashboard.

The backend is divided into independent Spring Boot services and all frontend requests are routed through an API Gateway.

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Password encryption
- Protected backend APIs
- Protected frontend routes
- Session expiration handling
- Automatic redirect to login when authentication expires

### Project Management

Users can:

- Create projects
- View their projects
- View individual project details
- Update projects
- Delete empty projects
- View tasks belonging to a project

Users can access only projects that belong to their authenticated account.

### Task Management

Users can:

- Create tasks
- View all their tasks
- View tasks belonging to a specific project
- Update tasks
- Delete tasks
- Assign task priority
- Track task status

Supported task statuses:

- TODO
- IN_PROGRESS
- COMPLETED

Supported priorities:

- LOW
- MEDIUM
- HIGH

### Dashboard

The dashboard displays:

- Total projects
- Total tasks
- To Do tasks
- In Progress tasks
- Completed tasks
- Recent tasks
- Recent projects

### Task Filtering

The My Tasks page supports filtering based on:

- Task status
- Task priority
- Search text

---

# Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- REST APIs
- Maven

## API Gateway

- Spring Cloud Gateway

## Database

- MySQL

## Frontend

- React
- JavaScript
- React Router
- Axios
- Bootstrap
- CSS

## Development Tools

- Spring Tool Suite / Eclipse
- Visual Studio Code
- Postman
- MySQL Workbench
- Git
- GitHub

---

# System Architecture

TaskFlow follows a microservices-based architecture.

```text
                    ┌───────────────────────┐
                    │     React Frontend    │
                    │   localhost:5173      │
                    └───────────┬───────────┘
                                │
                                │ HTTP / REST
                                ▼
                    ┌───────────────────────┐
                    │      API Gateway      │
                    │    localhost:8080     │
                    └───────────┬───────────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
       ┌────────────────────┐      ┌────────────────────┐
       │    Auth Service    │      │    Task Service    │
       │                    │      │                    │
       │ Register           │      │ Projects           │
       │ Login              │      │ Tasks              │
       │ JWT Generation     │      │ JWT Verification   │
       └─────────┬──────────┘      └──────────┬─────────┘
                 │                            │
                 ▼                            ▼
       ┌────────────────────┐      ┌────────────────────┐
       │   Auth Database    │      │    Task Database   │
       │       MySQL        │      │       MySQL        │
       └────────────────────┘      └────────────────────┘
```

The frontend communicates only with the API Gateway.

The API Gateway routes authentication requests to the Auth Service and project/task requests to the Task Service.

---

# Authentication Flow

TaskFlow uses JWT-based stateless authentication.

```text
User
 │
 │ Email + Password
 ▼
React Login Page
 │
 │ POST /api/auth/login
 ▼
API Gateway
 │
 ▼
Auth Service
 │
 ├── Find user by email
 │
 ├── Verify password
 │
 └── Generate JWT
 │
 ▼
JWT returned
 │
 ▼
React Frontend
 │
 └── Store JWT
```

For protected requests:

```text
React
 │
 │ Authorization: Bearer <JWT>
 ▼
API Gateway
 │
 ▼
Task Service
 │
 ▼
JwtAuthenticationFilter
 │
 ├── Extract JWT
 ├── Validate JWT
 ├── Extract email
 └── Set Authentication
 │
 ▼
Controller
 │
 ▼
Service
 │
 ▼
Repository
```

The authenticated user's email is obtained using:

```java
Authentication authentication;

String userEmail = authentication.getName();
```

The application does not trust a user email supplied by the frontend for authorization.

---

# Authorization and Data Isolation

TaskFlow implements ownership-based authorization.

For example, when retrieving a project, the application searches using both:

```text
Project ID
+
Authenticated user's email
```

Example repository logic:

```java
findByIdAndOwnerEmail(projectId, userEmail)
```

This prevents one authenticated user from accessing another user's projects.

The same principle is applied to tasks.

For security, unauthorized ownership access is treated as a resource not being available to the authenticated user.

---

# Backend Services

## 1. Auth Service

Responsibilities:

- User registration
- User login
- Password hashing
- Credential verification
- JWT generation
- Authentication-related exception handling

Typical flow:

```text
Controller
   ↓
AuthService
   ↓
UserRepository
   ↓
MySQL
```

---

## 2. Task Service

Responsibilities:

- Project management
- Task management
- JWT verification
- User ownership validation
- Project-task relationship management

Typical flow:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL
```

---

## 3. API Gateway

The API Gateway provides a single entry point for frontend requests.

Instead of calling individual services directly:

```text
Frontend → Auth Service
Frontend → Task Service
```

TaskFlow uses:

```text
Frontend
   ↓
API Gateway
   ↓
Backend Services
```

This keeps backend service addresses hidden from the frontend and centralizes routing.

---

# API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "Test User",
  "email": "test@gmail.com",
  "password": "password"
}
```

Successful response:

```text
201 Created
```

---

### Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "test@gmail.com",
  "password": "password"
}
```

Successful response:

```text
200 OK
```

A JWT is returned after successful authentication.

---

# Project APIs

All project APIs require:

```http
Authorization: Bearer <JWT>
```

### Create Project

```http
POST /api/projects
```

### Get Logged-in User's Projects

```http
GET /api/projects
```

### Get Project

```http
GET /api/projects/{projectId}
```

### Update Project

```http
PUT /api/projects/{projectId}
```

### Delete Project

```http
DELETE /api/projects/{projectId}
```

Successful deletion returns:

```text
204 No Content
```

### Get Tasks Inside Project

```http
GET /api/projects/{projectId}/tasks
```

---

# Task APIs

All task APIs require JWT authentication.

### Create Task

```http
POST /api/tasks
```

Example:

```json
{
  "projectId": 1,
  "title": "Build login page",
  "description": "Create login page for TaskFlow",
  "status": "TODO",
  "priority": "HIGH"
}
```

### Get Logged-in User's Tasks

```http
GET /api/tasks
```

### Get Task

```http
GET /api/tasks/{taskId}
```

### Update Task

```http
PUT /api/tasks/{taskId}
```

### Delete Task

```http
DELETE /api/tasks/{taskId}
```

Successful deletion:

```text
204 No Content
```

---

# HTTP Status Codes

TaskFlow uses meaningful HTTP status codes.

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource successfully created |
| 204 | Resource successfully deleted |
| 400 | Invalid request/validation error |
| 401 | Authentication failed |
| 403 | Access denied |
| 404 | Resource not found |
| 409 | Request conflicts with current resource state |
| 500 | Unexpected server error |

Examples:

```text
Duplicate registration
→ 409 Conflict

Incorrect login credentials
→ 401 Unauthorized

Non-existing project
→ 404 Not Found

Delete project containing tasks
→ 409 Conflict
```

---

# Exception Handling

Centralized exception handling is implemented using:

```java
@RestControllerAdvice
```

Examples include:

- ProjectNotFoundException
- TaskNotFoundException
- EmailAlreadyExistsException
- InvalidCredentialsException
- Validation exceptions

This prevents controllers from containing repetitive exception-handling logic.

---

# Project and Task Relationship

A project can contain multiple tasks.

Conceptually:

```text
USER
 │
 ├── PROJECT 1
 │      ├── TASK 1
 │      ├── TASK 2
 │      └── TASK 3
 │
 └── PROJECT 2
        ├── TASK 4
        └── TASK 5
```

Tasks store their associated project identifier.

Before creating a task, TaskFlow verifies that the requested project belongs to the authenticated user.

---

# Frontend Architecture

The React application is organized into reusable pages and components.

```text
src/
│
├── api/
│   └── axiosInstance.js
│
├── components/
│   ├── Sidebar.jsx
│   └── Sidebar.css
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── ProjectDetails.jsx
│   └── Tasks.jsx
│
├── App.jsx
└── main.jsx
```

---

# Axios Configuration

A centralized Axios instance is used for API communication.

It automatically attaches the JWT to protected requests:

```http
Authorization: Bearer <token>
```

This avoids manually adding the token in every React component.

Authentication failures can also be handled centrally.

When a session expires, the user is informed and redirected to the login page.

---

# Frontend Pages

## Login

Allows registered users to authenticate and obtain a JWT.

## Register

Allows new users to create an account.

## Dashboard

Provides an overview of project and task activity.

## Projects

Provides project creation, viewing, editing and deletion.

## Project Details

Displays project information and its associated tasks.

Users can create, update and delete tasks from this page.

## My Tasks

Displays tasks across all projects with:

- Search
- Status filtering
- Priority filtering

---

# Security

TaskFlow uses several security mechanisms.

### Password Security

Passwords are stored using password hashing rather than plain text.

### JWT Authentication

Protected endpoints require a valid JWT.

### Stateless Authentication

The backend does not maintain traditional server-side login sessions.

### Ownership Validation

Queries use both resource identifiers and the authenticated user's identity.

This prevents cross-user data access.

### Protected React Routes

Unauthenticated users cannot directly access application pages such as:

```text
/dashboard
/projects
/tasks
```

---

# Example Security Scenario

Suppose:

```text
User A owns Project 10
User B owns Project 20
```

If User B sends:

```http
GET /api/projects/10
Authorization: Bearer <USER_B_TOKEN>
```

the backend checks:

```java
findByIdAndOwnerEmail(10L, userBEmail);
```

Since Project 10 does not belong to User B, the project is not returned.

This prevents horizontal privilege escalation between users.

---

# Running the Application

The backend services should be started independently.

Start:

```text
Auth Service
Task Service
API Gateway
```

Then start the React frontend.

From:

```text
frontend/taskflow-ui
```

run:

```bash
npm install
npm run dev
```

The React application normally runs on:

```text
http://localhost:5173
```

Frontend API requests are sent through:

```text
http://localhost:8080
```

---

# Testing

Backend APIs were tested using Postman.

Testing includes:

- Registration
- Duplicate registration
- Login
- Invalid login
- JWT authentication
- Missing JWT
- Project CRUD
- Task CRUD
- Project-task mapping
- Validation failures
- Resource-not-found scenarios
- Project deletion conflicts
- Cross-user authorization
- JWT/session expiration

---

# Future Enhancements

Possible future improvements include:

- Task due dates
- Project members
- Task assignment
- Role-based authorization
- Notifications
- Activity history
- Docker containerization
- Service discovery
- Centralized configuration
- Refresh tokens
- Automated integration tests
- CI/CD pipeline

---

# Key Learning Outcomes

TaskFlow demonstrates practical implementation of:

- REST API development
- Microservices architecture
- API Gateway routing
- JWT authentication
- Spring Security
- Authorization and resource ownership
- Spring Data JPA
- MySQL
- Exception handling
- React
- Axios
- Protected routes
- CRUD operations
- Frontend-backend integration
- Multi-user data isolation
