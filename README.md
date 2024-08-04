# Task Management API

This is a RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing tasks. It provides endpoints for user registration, authentication, and task CRUD (Create, Read, Update, Delete) operations, including search, filter and pagination.

## Features

- **User Management:**
  - Registration and login
  - Secure password storage (bcrypt)
  - JWT-based authentication
- **Task Management:**
  - Create, read, update, delete tasks
  - Prioritize, search, and filter tasks
  - Pagination for efficient task retrieval
- **Advanced Search:** Search by title, description, status, priority, and due date.
- **Input Validation:** Joi is used for robust input validation.
- **Error Handling:** Centralized error handling with clear error messages.
- **Containerized with Docker:** Easy deployment and development with Docker.


## Folder Structure

```
task-management-api/
├── src/
│   ├── controllers/       # API request handlers
│   ├── models/            # Mongoose data models (schemas)
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic for tasks and authentication
│   ├── middlewares/       # Middleware for authentication, error handling, etc.
│   ├── utils/             # Utility functions
│   ├── validations/       # Validate data input
│   ├── config/            # Configuration files (database, etc.)
│   ├── app.ts             # Express application setup
│   └── server.ts           # Server entry point
├── test/                 # Unit and integration tests
├── .gitignore
├── package.json
├── Dockerfile
├── .env
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js V20 and npm (or yarn)
- MongoDB instance running

### Manual Installation & Run

1. **Clone the Repository:**
   ```bash
   git clone git@github.com:ahmeddwaheed/task-management-api.github.io.git
   cd task-management-api
   ```

2. **Install Dependencies:**
   ```bash
   npm install 
   ```
3. **Environment Variables:**
   - Create a `.env` file in the project root directory and add the following:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Server:**
   ```bash
   npm run dev   
   ```

### Docker Installation & Run
1. **Build and Run:**
   ```bash
   docker-compose up --build
   ```
## API Endpoints

| Method | Endpoint       | Description                         | Authentication Required  | Request Body/Params Example    | Response Example             |
| :----- | :------------- | :---------------------------------- | :--------------------- | :---------------------------- | :------------------------- |
| POST   | `/auth/register` | Register a new user                 | No                      | `{ "username": "user123", "password": "password123" }` | `{ "user": { "_id": "...", "username": "user123" } }` |
| POST   | `/auth/login`    | Authenticate user and get JWT token | No                      | `{ "username": "user123", "password": "password123" }` | `{ "token": "eyJhbGciOi..." }` |
| GET    | `/tasks`        | Get all tasks (with pagination)      | Yes (Bearer JWT)               | `?page=1&limit=10`            | See Pagination Response     |
| POST   | `/tasks`        | Create a new task                   | Yes (Bearer JWT)               | `{ "title": "Task 1", "description": "Description...", "status": "pending", "priority": "medium", "dueDate": "2024-08-15" }` | `{ "_id": "...", "title": "Task 1", ... }` |
| GET    | `/tasks/:id`    | Get a task by ID                    | Yes (Bearer JWT)               | -                            | `{ "_id": "...", "title": "Task 1", ... }` |
| PUT    | `/tasks/:id`    | Update a task by ID                | Yes (Bearer JWT)               | `{ "title": "Updated Task" }` | `{ "_id": "...", "title": "Updated Task", ... }` |
| DELETE | `/tasks/:id`    | Delete a task by ID                | Yes (Bearer JWT)               | -                            | `{ "_id": "...", "title": "Task 1", ... }` (deleted task) |
| GET    | `/tasks/search` | Search tasks by title, description, etc. | Yes (Bearer JWT)       | `?title=meeting`             | `[{ "_id": "...", "title": "Team meeting", ... }]` |


**Pagination Response Example:**

```json
{
  "tasks": [
    { "_id": "...", "title": "Task 1", ... },
    { "_id": "...", "title": "Task 2", ... }
  ],
  "currentPage": 1,
  "totalPages": 3
}
```


## Error Handling

The API uses a centralized error handler. Error responses are in JSON format:

```json
{
  "status": 400,
  "message": "Validation Error",
  "errors": {
    "title": "Title is required"
  }
}
```
