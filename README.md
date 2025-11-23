# HRMS – Human Resource Management System
A full-stack Human Resource Management System built with Node.js, Express.js, PostgreSQL,
Sequelize, and React.js + Tailwind CSS.
This system allows organisations to manage employees, teams, assignments, activity logs, and
authentication securely.
##  Features
###  Authentication
- Organisation Registration
- Login with Email + Password + Organisation Name
- JWT-based authentication
- Protected routes
###  Employee Management
- Create, update, delete employees
- Fetch all employees
- Form modal for add/edit
- Auto-refresh UI
- Error handling + toast notifications
###  Team Management
- Create, update, delete teams
- List all teams
- Popup modal for create/edit
- View team description
###  Employee Assignments
- Assign employees to teams
- Remove employees from teams
- Modal with checkbox selection
- Fetch assigned employees
###  Activity Logging Module (NEW)
- Database-backed logs
- Records every key action (login, CRUD, assignments)
- Filter logs by User, Action, Date
- Pagination support
- GET `/api/logs` endpoint
###  Toast Notifications
- Custom global toast system (no external library)
- Supports **success** and **error**
- Auto-close after 3 seconds
###  Frontend
- React + Tailwind CSS
- Fully responsive
- Dashboard layout
- Smooth modals
##  Tech Stack
### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- CORS
- bcrypt
### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Lucide Icons
##  Project Folder Structure
```
hrms/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │   ├─ authController.js
│  │  │   ├─ employeeController.js
│  │  │   └─ teamController.js
│  │  ├─ middlewares/
│  │  │   └─ authMiddleware.js
│  │  ├─ models/
│  │  │   ├─ organisation.js
│  │  │   ├─ user.js
│  │  │   ├─ employee.js
│  │  │   ├─ team.js
│  │  │   ├─ employeeTeam.js
│  │  │   └─ log.js
│  │  └─ routes/
│  │      ├─ auth.js
│  │      ├─ employees.js
│  │      └─ teams.js
│  └─ server.js
│  ├─ package.json
│  └─ .env
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │   ├─ Login.jsx
│  │  │   ├─ RegisterOrg.jsx
│  │  │   ├─ Employees.jsx
│  │  │   └─ Teams.jsx
│  │  ├─ components/
│  │  │   ├─ EmployeeForm.jsx
│  │  │   └─ TeamForm.jsx
│  │  └─ services/
│  │      └─ api.js 
│  └─ package.json
└─ README.md

```

##  Environment Variables
### Backend `.env`
```
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=hrms
FRONT_END_URL=http://localhost:3000
```
##  API Endpoints
###  Auth Routes
| Method | Endpoint | Description |
|--------|--------------------------|--------------------------|
| POST | /api/auth/register | Register organisation |
| POST | /api/auth/login | Login & get JWT |
###  Employee Routes
| Method | Endpoint | Description |
|--------|-------------------------|------------------------|
| GET | /api/employees | Get all employees |
| POST | /api/employees | Create employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
###  Team Routes
| Method | Endpoint | Description |
|--------|-------------------------------|----------------------|
| GET | /api/teams | Get all teams |
| POST | /api/teams | Create team |
| PUT | /api/teams/:id | Update team |
| DELETE | /api/teams/:id | Delete team |
| POST | /api/teams/:teamId/assign | Assign employees |
| DELETE | /api/teams/:teamId/unassign | Unassign employee |
###  Logs Route
| Method | Endpoint | Description |
|--------|---------------|---------------------------|
| GET | /api/logs | Fetch logs with filters |

## Logs Table Schema
```
CREATE TABLE logs (
id SERIAL PRIMARY KEY,
organisation_id INT,
user_id INT,
action VARCHAR(255),
meta JSONB,
timestamp TIMESTAMP DEFAULT now()
);
```
##  Running Locally
### Backend
```
cd backend
npm install
npm start
```
### Frontend
```
cd frontend
npm install
npm start
```
## Author
**Sanjeevan Thangaraj**  
📧 [sanjeevan1122003@gmail.com]  
🔗 [GitHub Profile](https://github.com/Sanjeevan1122003/)
