# 🌌 Super Intelligent All-in-One Service Platform
### **The Future of Human ↔ AI ↔ Service Provider Ecosystem**

A premium, automated platform that connects users with local vendors, freelancers, and online APIs through an intelligent AI core.

---

## �️ System Architecture
The platform operates as a cohesive ecosystem of four specialized systems:

1.  **🧠 AI Brain (Backend)**: The "Invisible Assistant" that understands natural language, classifies tasks, and performs smart routing.
2.  **📱 User App**: A sleek, chat-based interface where users can ask for anything (e.g., "I need a carpenter to fix my door").
3.  **🛠️ Provider Dashboard**: A powerful management tool for service providers to update availability, accept jobs, and track earnings.
4.  **🛡️ Admin Control Center**: A bird's-eye view of the entire platform, featuring revenue analytics and provider oversight.

---

## 🛠️ Tech Stack & Aesthetics
-   **Core**: Node.js & Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Real-time**: Socket.io for instant booking & status notifications.
-   **AI Engine**: Google Gemini 1.5 Flash (NLP & Task Mapping).
-   **Frontend**: React (Vite) with **Premium Glassmorphism Aesthetics**.
-   **Motion**: Framer Motion for sleek micro-animations.

---

## 🚀 One-Click Setup & Launch

### **1. Prerequisites**
-   Ensure **Node.js** (v18+) is installed.
-   Have **MongoDB** running locally (`mongodb://localhost:27017`).
-   Obtain a **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### **2. Installation**
Run the following commands in the `service-platform` directory:

```bash
# Install core dependencies (concurrently)
npm install

# Install all sub-system dependencies in one go
npm run install-all
```

> [!NOTE]
> I've added a helper script `npm run install-all` to save you time!

### **3. Configuration**
Update `backend/.env` with your unique keys:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/service_platform
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_actual_gemini_key_here
```

### **4. Seeding the Engine**
Initialize the platform with top-tier mock providers:
```bash
cd backend && node seed.js && cd ..
```

### **5. Launching the Ecosystem**
Start all four systems with a single command:
```bash
npm start
```

---

## 🌐 Platform Access
Once running, the ecosystem is accessible at:

| Component | Default URL | Purpose |
| :--- | :--- | :--- |
| **Admin Panel** | `http://localhost:5173` | Analytics and Platform Oversight. |
| **User Chat App** | `http://localhost:5174` | Ask, Search, and Book services. |
| **Provider Portal** | `http://localhost:5175` | Manage jobs and availability. |
| **AI API Server** | `http://localhost:5001` | The system core. |

*Note: Ports may shift (e.g., 5174, 5175) if they are occupied. Check your terminal output for exact URLs.*

