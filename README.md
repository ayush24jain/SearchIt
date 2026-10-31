# SearchIt – SVNIT Faculty Directory

A centralized faculty directory website for **Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat**.

SearchIt simplifies access to faculty information by providing a single platform where students and other users can search for faculty members across different departments.

---

## About the Project

Finding faculty information on an institute website can require navigating through multiple department pages.

SearchIt addresses this problem through a centralized search platform that allows users to find faculty members and access their available professional information.

The application follows a full-stack architecture using React, Node.js, Express and PostgreSQL.

## Features

- **Faculty Search:** Search faculty members using names and other available professional information.
- **Partial Search:** Find faculty members using partial keywords.
- **Department Filtering:** Filter faculty members by department.
- **Combined Search:** Combine keyword searches with department filters.
- **Autocomplete:** Receive faculty suggestions while typing.
- **Faculty Profiles:** View available professional details of faculty members.
- **Faculty Photographs:** Display official photographs where available, with an initials fallback.
- **Contact Information:** Access published official email addresses and office phone numbers.
- **Search History:** Access recent searches.
- **Responsive Interface:** Supports desktop, tablet and mobile layouts.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite 8
- CSS

### Backend

- Node.js
- Express 5
- TypeScript
- tsx
- PostgreSQL driver (`pg`)
- dotenv
- CORS

### Database

- PostgreSQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

## Project Architecture

SearchIt follows a three-layer architecture:

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
                | Parameterized SQL Queries
                v
            POSTGRESQL
              DATABASE
                |
                v
          FACULTY INFORMATION
```

The frontend communicates with the backend through REST API endpoints. The backend retrieves faculty and department information from PostgreSQL and returns JSON responses.

## Project Structure

```text
SearchIt/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── data/
│   │   │   └── faculty.ts
│   │   ├── services/
│   │   │   ├── facultyApi.ts
│   │   │   └── departmentApi.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── faculty.ts
│   │   │   └── departments.ts
│   │   ├── db.ts
│   │   ├── server.ts
│   │   └── test-db.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
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
| department_id | Reference to the department |
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

The faculty table maintains a foreign-key relationship with the departments table.

### Current Dataset

The development database currently contains:

- 258 faculty records.
- 12 departments.
- Department assignments maintained in the development database.
- Source URLs recorded for faculty records.

Some contact details and photographs are intentionally unavailable where they are not published by official institute sources.

**Note:** The local PostgreSQL database and faculty dataset are not included in this GitHub repository. Database schema initialization and data population must be completed separately.

## API Documentation

The backend exposes the following REST API endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/faculty` | Retrieve faculty records |
| GET | `/api/faculty?search=keyword` | Search faculty |
| GET | `/api/faculty?department=name` | Filter by department |
| GET | `/api/faculty/:id` | Retrieve an individual faculty profile |
| GET | `/api/departments` | Retrieve all departments |

The faculty endpoint supports combined search and department filtering.

### Example API Requests

Retrieve all faculty:

```http
GET http://localhost:3000/api/faculty
```

Search for faculty:

```http
GET http://localhost:3000/api/faculty?search=Mukesh
```

Filter by department:

```http
GET http://localhost:3000/api/faculty?department=DoChE
```

Retrieve an individual faculty profile:

```http
GET http://localhost:3000/api/faculty/1
```

Check backend health:

```http
GET http://localhost:3000/api/health
```

## Installation and Setup

Follow these instructions to run SearchIt locally.

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/ayush24jain/SearchIt.git
```

Navigate into the project:

```bash
cd SearchIt
```

### 2. Configure PostgreSQL

Install and start PostgreSQL.

Create a database named:

```sql
CREATE DATABASE searchit;
```

The `searchit` database must contain the `departments` and `faculty` tables with the schema described above.

The development dataset must also be populated separately.

For application runtime, configure a restricted PostgreSQL user with the required database connection and read permissions.

### 3. Setup the Backend

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Use the following configuration as a reference:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=searchit
DB_USER=your_database_user
DB_PASSWORD=your_database_password

FRONTEND_URL=http://localhost:5173
```

Replace the placeholder database credentials with your own local PostgreSQL application-user credentials.

Never commit `.env` files or expose database passwords.

Start the backend:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:3000
```

### 4. Setup the Frontend

Open a separate terminal from the project root:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

Keep PostgreSQL, the backend and the frontend running while using the application.

### 5. Build the Application

Build the frontend:

```bash
cd frontend
npm run build
```

Build the backend:

```bash
cd backend
npm run build
```

Type-check the backend:

```bash
npm run typecheck
```

## Security Considerations

SearchIt incorporates several security measures:

- Parameterized SQL queries to reduce SQL injection risks.
- Restricted CORS configuration using the `FRONTEND_URL` environment variable.
- JSON request body size limited to 10 KB.
- Environment variables used for database credentials.
- Git ignore rules to prevent accidental commits of environment files.

For production deployment, use a dedicated PostgreSQL application user with least-privilege permissions.

Database passwords and other sensitive configuration values must never be committed to the repository.

## Data Sources and Accuracy

SearchIt is designed to use official SVNIT faculty information.

Faculty information and photographs should be verified against official institute sources.

Where official sources do not publish specific information, the corresponding database fields remain empty rather than being populated with unverified details.

The project aims to maintain accurate and reliable faculty information.

## Future Improvements

Potential future improvements include:

- Production deployment and hosting.
- Further faculty data verification.
- Improved administrative information.
- Additional security and performance enhancements.
- Continued user-interface improvements.

## Project Status

**Development stage:** Working full-stack application.

The following components have been implemented and tested:

- React frontend.
- Express and TypeScript backend.
- PostgreSQL database integration.
- Faculty search and autocomplete.
- Department filtering.
- Individual faculty profiles.
- Responsive user interface.
- Backend API testing.

Documentation, deployment and final production verification are the remaining development stages.

## Author

**Ayush Jain**

Student, Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat.

## Repository

GitHub: https://github.com/ayush24jain/SearchIt

---

*SearchIt – Making faculty information easier to find.*
