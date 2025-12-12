# API Documentation

Base URL: `http://localhost:5001/api`

## Authentication

### Register User
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  { "token": "eyJhbGciOiJIUzI1Ni..." }
  ```

### Login User
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  { "token": "eyJhbGciOiJIUzI1Ni..." }
  ```

### Get Current User
- **Endpoint**: `GET /auth/user`
- **Headers**: `x-auth-token: <token>`
- **Response**: `200 OK`
  ```json
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
  ```

## Tasks

### Get Client Tasks
- **Endpoint**: `GET /tasks`
- **Headers**: `x-auth-token: <token>`
- **Response**: `200 OK` (Array of tasks)

### Create Task
- **Endpoint**: `POST /tasks`
- **Headers**: `x-auth-token: <token>`
- **Body**:
  ```json
  {
    "title": "Complete Assignment",
    "description": "Finish the MERN stack project",
    "status": "pending" // optional: pending, in-progress, completed
  }
  ```

### Update Task
- **Endpoint**: `PUT /tasks/:id`
- **Headers**: `x-auth-token: <token>`
- **Body**: (Any subset of fields)
  ```json
  { "status": "completed" }
  ```

### Delete Task
- **Endpoint**: `DELETE /tasks/:id`
- **Headers**: `x-auth-token: <token>`
- **Response**: `200 OK`
  ```json
  { "msg": "Task removed" }
  ```
