# Equipment Tracker

A simple web application to manage equipment items.

## Features
- View list of equipment.
- Add new equipment.
- Edit existing equipment.
- Delete equipment.
- Search equipment by name, type, or status.
- Data persistence using a local JSON file.

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: local JSON file (`backend/data/equipment.json`)

## Prerequisites
- Node.js installed

## Setup & Run

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   The backend server will run on `http://localhost:5000`.

3. **Frontend Setup**:
   Open a new terminal:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`.

## Assumptions
- No authentication required.
- Data is stored in a JSON file for simplicity and portability.
- Single user environment (concurrent writes might race in JSON file implementation, but acceptable for this scope).

## Future Improvements
- Add real database (MongoDB or PostgreSQL).
- Add user authentication.
- Add pagination for large datasets.
- Add comprehensive error handling and logging.
