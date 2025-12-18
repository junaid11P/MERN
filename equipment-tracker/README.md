# Equipment Tracker 

Hi there! This is my submission for the Intern Assignment.

It's a simple web application to manage a list of equipment. I built this using the **MERN Stack** (MongoDB, Express, React, Node.js).

## Features

- **View Equipment**: See a clear table of all items.
- **Add Items**: Easy form to add new machinery.
- **Edit & Delete**: Manage existing records.
- **Search**: Filter items by name, type, or status (Added this as a bonus!).
- **Validation**: Ensures you don't submit empty forms.

## Tech Stack

- **Frontend**: React (Hooks, Functional Components)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose for schema validation)

## Database Details

If you are setting up your MongoDB Atlas, use these names:
- **Database Name**: `equipment-tracker`
- **Collection Name**: `equipment` (Created automatically by Mongoose)

## How to Run

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Make sure you have **Node.js** installed.

### 2. Backend Setup
The backend runs on port `5001`.

1.  Open a terminal and go to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Important**: Create a `.env` file in the `backend` folder with your MongoDB Atlas connection string:
    ```env
    MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/equipment-tracker
    PORT=5001
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    You should see: `Server is running on port 5001` and `MongoDB connected`.

### 3. Frontend Setup
The frontend runs on port `3000`.

1.  Open a **new** terminal (keep the backend running!) and go to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the app:
    ```bash
    npm start
    ```
    The browser should open automatically at `http://localhost:3000`.

## What I Learned

Building this project helped me verify my understanding of:
- **REST APIs**: How to structure routes properly.
- **State Management**: Managing `loading` and `error` states in React.
- **Database Design**: Using Mongoose schemas to enforce data types (like ensuring `status` is one of the allowed values).

## Assumptions

- I assumed we need a robust database, so I chose MongoDB over a local JSON file to better demonstrate backend skills.
- The app is currently single-user (no login required).

---
*Thank you for checking out my code!*
