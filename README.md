# SearchIt – SVNIT Faculty Directory

A centralized faculty information and directory website for **Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat**.

SearchIt makes it easier for students and other users to find faculty information without navigating through multiple department pages on the institute website.

---

## About the Project

Finding faculty information on an institute website can require navigating through several department pages.

SearchIt aims to simplify this process by providing a single platform where users can search for faculty members and access their available professional information.

The project uses a React frontend, Node.js and Express backend, and PostgreSQL database.

## Features

- **Faculty Search:** Search faculty using names and available professional information.
- **Department Filtering:** Filter faculty members by department.
- **Combined Search:** Search using a keyword along with a selected department.
- **Autocomplete:** Get faculty suggestions while typing.
- **Faculty Profiles:** View available faculty information in one place.
- **Faculty Photographs:** Display faculty photographs where available, with an initials fallback.
- **Contact Information:** Access available official email addresses and office phone numbers.
- **Search History:** Access recent searches.
- **Responsive Interface:** Designed to work across desktop and mobile screens.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- tsx
- PostgreSQL (`pg`)
- dotenv
- CORS

### Database
- PostgreSQL

### Development Tools
- Visual Studio Code
- Git and GitHub
- npm

## Project Architecture

SearchIt follows a frontend–backend–database architecture.

```text
              USER
                |
                v
       REACT FRONTEND
       (React + TypeScript)
                |
                | HTTP Requests
                v
       EXPRESS BACKEND
       (Node.js + TypeScript)
                |
                | SQL Queries
                v
          POSTGRESQL
            DATABASE
                |
                v
       FACULTY INFORMATION
```

The frontend sends requests to the backend API. The backend communicates with PostgreSQL and returns faculty and department information to the frontend.

## Project Structure

```text
SearchIt/
│
├── frontend/
│   ├── src/
│   │   ├── data/
│   │   │   └── faculty.ts
│   │   │
│   │   ├── services/
│   │   │   ├── facultyApi.ts
│   │   │   └── departmentApi.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── faculty.ts
│   │   │   └── departments.ts
│   │   │
│   │   ├── db.ts
│   │   ├── server.ts
│   │   └── test-db.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── .gitignore
└── README.md
```

## Database Design

SearchIt uses PostgreSQL with two primary tables.

### 1. Departments

Stores department information.

| Column | Description |
|---|---|
| id | Unique department ID |
| name | Department name |
| abbreviation | Department abbreviation |

### 2. Faculty

Stores faculty information.

| Column | Description |
|---|---|
| id | Unique faculty ID |
| full_name | Faculty member's name |
| department_id | Reference to department |
| designation | Academic designation |
| email | Official email address |
| office_phone | Office contact number |
| office_room | Office room information |
| administrative_position | Administrative role |
| source_url | Official profile source |
| photo_url | Faculty photograph URL |
| last_verified_at | Last verification date |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |

The faculty table uses a foreign-key relationship with the departments table.

## API Endpoints

The backend exposes REST API endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/faculty` | Retrieve faculty records |
| GET | `/api/faculty?search=keyword` | Search faculty |
| GET | `/api/faculty?department=department-name` | Filter by department |
| GET | `/api/departments` | Retrieve departments |

The faculty search endpoint supports searching across available faculty information, including names, designations, departments, administrative positions, emails, phone numbers and room information.

## Installation and Setup

Follow these instructions to run SearchIt locally.

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ayush24jain/SearchIt.git
```

Navigate into the project:

```bash
cd SearchIt
```

### 2. Setup the Database

Install PostgreSQL and create a database named:

```sql
CREATE DATABASE searchit;
```

The database tables must also be created using the project's database schema.

### 3. Setup the Backend

Open a terminal:

```bash
cd backend
npm install
```

Configure the backend environment variables in:

```text
backend/.env
```

Use the database configuration expected by `backend/src/db.ts`.

Never commit your `.env` file or expose database passwords.

Start the backend:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:3000
```

### 4. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

Make sure the backend and PostgreSQL database are running while using the application.

## Data Sources and Accuracy

SearchIt is intended to use official SVNIT faculty information.

Faculty information and photographs should be verified against official institute sources. Some records may have incomplete information, and the database requires continued verification before production use.

SearchIt does not claim that every faculty record is complete or currently verified.

## Future Improvements

Potential future improvements include:

- Further verification and completion of faculty records.
- Improved administrative-position information.
- Production deployment.
- Additional testing and performance improvements.
- Image-based faculty search, subject to appropriate data sourcing, authorization and technical feasibility.

## Project Status

**Development stage:** Working full-stack application.

The frontend, backend, PostgreSQL integration, faculty search, department filtering and faculty profile display have been implemented.

Further data verification, documentation, testing and deployment remain part of the project roadmap.

## Author

**Ayush Jain**

Student, National Institute of Technology, Surat (SVNIT).

## Repository

GitHub: https://github.com/ayush24jain/SearchIt

---

*SearchIt – Making faculty information easier to find.*