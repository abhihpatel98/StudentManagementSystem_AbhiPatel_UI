# Student Management System

A modern, full-stack web application for managing students and classes. Built with React, TypeScript, and Vite, featuring authentication, CRUD operations, and CSV import functionality.

## Features

### Authentication
- Secure login system with JWT token-based authentication
- Protected routes for authenticated users only
- Automatic redirect for logged-in users attempting to access login page
- Token persistence in localStorage

### Student Management
- **View Students**: Display all students in a sortable table
- **Add Student**: Create new student records with validation
- **Edit Student**: Update existing student information
- **Delete Student**: Remove students with confirmation dialog
- **Search**: Real-time search functionality by student name
- **Sorting**: Sort by Name, Email, Phone, or Classes (ascending/descending)

### Class Management
- **View Classes**: Display all classes in a table
- **CSV Import**: Bulk import classes from CSV files
- **Error Handling**: Comprehensive error handling with retry functionality

### Form Validation
- **First Name**: Required field validation
- **Last Name**: Required field validation
- **Email**: Email format validation
- **Phone Number**: 
  - Numbers only
  - Maximum 10 digits
  - Required field validation
- Real-time validation feedback with error messages

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.12.0
- **HTTP Client**: Axios 1.13.2
- **Styling**: Tailwind CSS 4.1.18
- **Code Quality**: ESLint

## Project Structure

```
src/
├── api/
│   └── axios.ts              # Axios configuration with interceptors
├── auth/
│   └── AuthContext.tsx       # Authentication context provider
├── components/
│   └── Navbar.tsx            # Navigation component
├── interfaces/
│   ├── Class.ts              # Class interface definition
│   └── Student.ts            # Student interface definition
├── pages/
│   ├── Classes.tsx           # Classes management page
│   ├── Login.tsx             # Login page
│   ├── StudentForm.tsx       # Add/Edit student form
│   └── Students.tsx           # Students list page
├── App.tsx                   # Main app component with routing
├── App.css                   # App-specific styles
├── index.css                 # Global styles
└── main.tsx                  # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend API server running (see API Configuration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhihpatel98/StudentManagementSystem_AbhiPatel_UI.git
cd StudentManagementSystem_AbhiPatel_UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Configuration

The application expects a RESTful API with the following endpoints:

### Authentication
- `POST /auth/login` - Login endpoint
  - Request body: `{ username: string, password: string }`
  - Response: `{ token: string }`

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Classes
- `GET /classes` - Get all classes
- `POST /classes/import` - Import classes from CSV (multipart/form-data)

All API requests (except login) require authentication via Bearer token in the Authorization header.

## Features in Detail

### Authentication Flow
1. User enters credentials on login page
2. On successful login, JWT token is stored in localStorage
3. Token is automatically included in all subsequent API requests via Axios interceptor
4. Protected routes check for token and redirect to login if missing
5. Logout clears token and redirects to login

### Student Form Validation
- **Real-time validation**: Errors appear as user types
- **Visual feedback**: Invalid fields show red borders
- **Phone number**: Automatically filters non-numeric characters and limits to 10 digits
- **Email**: Validates proper email format using regex
- **Required fields**: First Name and Last Name cannot be empty

### Error Handling
- **Network errors**: Displayed with retry options
- **Validation errors**: Shown inline below form fields
- **Upload errors**: Displayed with clear error messages
- **User-friendly messages**: Clear, actionable error messages

## Author
Abhi Patel
