# SECE Event Management System

A full-stack Event Management System for **Sri Eshwar College of Engineering (SECE)** built with the MERN stack.

## Tech Stack

| Layer           | Technology                                         |
| --------------- | -------------------------------------------------- |
| **Frontend**    | React 18, Tailwind CSS, Redux Toolkit, Lucide React |
| **Backend**     | Node.js, Express.js                                |
| **Database**    | MongoDB (Mongoose ODM)                             |
| **Auth**        | JWT (JSON Web Tokens)                              |
| **QR Codes**    | `qrcode` (backend) + `qrcode.react` (frontend)    |

## Features

- **JWT Authentication** with Student / Admin roles
- **Student Dashboard**: Browse events, register, view QR codes
- **Admin Dashboard**: CRUD events, view registrations table
- **Department Filtering**: CSE, ECE, AI&DS, MECH, etc.
- **Status Badges**: Yellow (Upcoming), Green (Ongoing), Blue (Completed)
- **QR Code**: Generated on registration for venue attendance
- **Responsive** design with SECE branding (Deep Blue + Gold)

## Project Structure

```
event-management/
├── backend/
│   ├── models/         # Mongoose schemas (User, Event)
│   ├── routes/         # Express routes (auth, events)
│   ├── middleware/      # JWT auth middleware
│   ├── server.js       # Entry point
│   ├── .env            # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar, EventCard
│   │   ├── pages/      # Hero, Login, Signup, Dashboards
│   │   ├── redux/      # Store, authSlice, eventSlice
│   │   ├── utils/      # Axios API instance
│   │   ├── App.jsx     # Router + Layout
│   │   ├── main.jsx    # Entry point
│   │   └── index.css   # Design system
│   ├── .env            # API URL
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

### 3. Environment Variables

**backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/sece-event-management
JWT_SECRET=your-secret-key
PORT=5000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Usage

1. Open **http://localhost:5173** to see the SECE landing page
2. **Sign up** as a Student or Admin
3. **Students** can browse events, register, and view QR codes under "My Events"
4. **Admins** can create/edit/delete events and view registration tables
