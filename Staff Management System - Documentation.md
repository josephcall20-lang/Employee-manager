# Staff Management System - Documentation

## 1. Overview

The Staff Management System is a comprehensive web application designed to streamline the process of managing potential hires and employees. It provides a centralized platform for tracking candidates through the recruitment pipeline, managing employee information, and handling various administrative tasks.

**Key Features:**

*   **Candidate Management:** Track candidates from application to hiring, with clear pipeline statuses and admin approval workflows.
*   **Employee Management:** Maintain detailed employee records, including personal information, contracts, policy documents, and more.
*   **Indeed Integration:** (Mock) Seamlessly sync candidate data from Indeed to keep your hiring pipeline up-to-date.
*   **Authentication & Authorization:** Secure login system with role-based access control (admin vs. user) to protect sensitive data.
*   **File Management:** Upload and manage important documents such as resumes, contracts, and policy agreements.
*   **Modern UI:** A clean, responsive, and user-friendly interface built with React and modern UI components.

## 2. Application URL

The application is deployed and accessible at the following URL:

[https://ogh5izc6890p.manus.space](https://ogh5izc6890p.manus.space)

**Admin Credentials:**

*   **Username:** `admin`
*   **Password:** `admin123`

## 3. Technical Stack

*   **Backend:** Flask (Python)
*   **Frontend:** React (JavaScript)
*   **Database:** SQLite
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Deployment:** Manus Platform

## 4. Project Structure

### Backend (Flask)

```
/staff-management
├── src
│   ├── database
│   │   └── app.db
│   ├── models
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── candidate.py
│   │   ├── employee.py
│   │   └── user.py
│   ├── routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── candidate.py
│   │   ├── employee.py
│   │   ├── files.py
│   │   └── indeed.py
│   ├── static
│   │   └── ... (React build files)
│   └── main.py
├── requirements.txt
└── venv
```

### Frontend (React)

```
/staff-management-frontend
├── public
├── src
│   ├── components
│   │   ├── CandidateManagement.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EmployeeManagement.jsx
│   │   ├── Login.jsx
│   │   └── Navigation.jsx
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 5. API Endpoints

*   `/api/auth/register` (POST): Register a new user.
*   `/api/auth/login` (POST): Log in a user and get a token.
*   `/api/auth/logout` (POST): Log out a user.
*   `/api/auth/me` (GET): Get the current user's information.
*   `/api/candidates` (GET, POST): Get all candidates or add a new one.
*   `/api/candidates/<id>` (GET, PUT, DELETE): Get, update, or delete a candidate.
*   `/api/employees` (GET, POST): Get all employees or add a new one.
*   `/api/employees/<id>` (GET, PUT, DELETE): Get, update, or delete an employee.
*   `/api/indeed/sync-candidates` (POST): Sync candidates from Indeed.
*   `/api/files/upload` (POST): Upload a file.
*   `/api/files/download/<type>/<filename>` (GET): Download a file.

## 6. Getting Started Locally

To run the application locally, follow these steps:

1.  **Clone the repository.**
2.  **Backend Setup:**
    *   `cd staff-management`
    *   `python -m venv venv`
    *   `source venv/bin/activate`
    *   `pip install -r requirements.txt`
    *   `python src/main.py`
3.  **Frontend Setup:**
    *   `cd staff-management-frontend`
    *   `pnpm install`
    *   `pnpm dev`

## 7. Future Improvements

*   **Full Indeed API Integration:** Replace the mock Indeed API with a full implementation using real credentials.
*   **Email Notifications:** Implement email notifications for key events (e.g., new candidate, status change).
*   **Advanced Reporting:** Add more detailed reporting and analytics features.
*   **Testing:** Add comprehensive unit and integration tests for both the frontend and backend.


---
Update to force Vercel deployment.