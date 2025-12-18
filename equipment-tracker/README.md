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
- **Database**: MongoDB

## Prerequisites
- Node.js installed

## Setup & Run

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with your MongoDB URI
   echo "MONGO_URI=mongodb+srv://..." > .env
   echo "PORT=5001" >> .env
   node server.js
   ```
   The backend server will run on `http://localhost:5001`.

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

## Future Improvements
- Add user authentication.
- Add pagination for large datasets.
- Add comprehensive error handling and logging.
