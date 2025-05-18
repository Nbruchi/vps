# Vehicle Parking System

![Vehicle Parking System](https://img.shields.io/badge/Vehicle%20Parking%20System-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Redux](https://img.shields.io/badge/Redux-2.8.2-764ABC?logo=redux)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.11-38B2AC?logo=tailwind-css)

A comprehensive vehicle parking management system that allows users to register vehicles, request parking slots, and administrators to manage parking slots and user requests.

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
  - [Authentication API](#authentication-api)
  - [User API](#user-api)
  - [Vehicle API](#vehicle-api)
  - [Parking Slot API](#parking-slot-api)
  - [Slot Request API](#slot-request-api)
  - [Logs API](#logs-api)
- [Project Structure](#-project-structure)
- [License](#-license)

## ✨ Features

### 🔐 Authentication
- User registration and login
- Role-based access control (Admin and User roles)
- Protected routes for authenticated users

### 👤 User Management
- User profile management
- Password change functionality
- Admin can view and manage all users

### 🚗 Vehicle Management
- Register multiple vehicles
- Update vehicle information
- Delete vehicles
- View all registered vehicles

### 🅿️ Parking Slot Management
- Create individual or bulk parking slots
- Assign slots based on vehicle type and size
- Update slot information
- View available and occupied slots

### 📝 Parking Request System
- Request parking slots for vehicles
- Approve or reject parking requests
- View request history and status

### 📊 Dashboard
- Overview of parking statistics
- Recent activities and logs
- Quick access to main features

## 🛠️ Technologies Used

### Frontend
- **React** (v18.3.1) - JavaScript library for building user interfaces
- **TypeScript** (v5.5.3) - Typed superset of JavaScript
- **React Router DOM** (v6.26.2) - Routing library for React
- **Redux Toolkit** (v2.8.2) - State management
- **React Query** (v5.56.2) - Data fetching and caching
- **React Hook Form** (v7.53.0) - Form handling
- **Zod** (v3.23.8) - Schema validation
- **TailwindCSS** (v3.4.11) - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library
- **Recharts** - Charting library
- **Sonner** - Toast notifications

### Development Tools
- **Vite** (v5.4.1) - Build tool and development server
- **ESLint** (v9.9.0) - Code linting
- **SWC** - Fast JavaScript/TypeScript compiler

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vehicle_parking_system.git
   cd vehicle_parking_system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### User Flow
1. Register a new account or login with existing credentials
2. Add your vehicles to the system
3. Request a parking slot for your vehicle
4. View the status of your requests
5. Manage your profile and vehicles

### Admin Flow
1. Login with admin credentials
2. Manage parking slots (create, update, delete)
3. Review and process parking requests
4. Manage users and view system logs
5. Monitor system through the dashboard

## 📡 API Documentation

### Authentication API

#### Register
- **URL**: `/api/v1/users/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "fullName": "John Doe",
    "password": "securepassword"
  }
  ```
- **Response**: User object with token

#### Login
- **URL**: `/api/v1/users/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token",
    "userId": "user-id",
    "role": "user"
  }
  ```

### User API

#### Get Current User Profile
- **URL**: `/api/v1/users/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User object

#### Update Profile
- **URL**: `/api/v1/users/me`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "fullName": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Response**: Updated user object

#### Change Password
- **URL**: `/api/v1/users/me/password`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "oldPassword": "currentpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response**: Success message

#### List Users (Admin only)
- **URL**: `/api/v1/users?page=1&pageSize=10&search=query`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Paginated list of users

#### Get User by ID (Admin only)
- **URL**: `/api/v1/users/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User object

#### Delete User (Admin only)
- **URL**: `/api/v1/users/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Success message

### Vehicle API

#### List Vehicles
- **URL**: `/api/v1/vehicles`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of vehicle objects

#### Get Vehicle by ID
- **URL**: `/api/v1/vehicles/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Vehicle object

#### Create Vehicle
- **URL**: `/api/v1/vehicles`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "plateNumber": "ABC-123",
    "vehicleType": "car",
    "size": "medium",
    "attributes": {
      "color": "Blue",
      "model": "Toyota Corolla",
      "year": 2020
    }
  }
  ```
- **Response**: Created vehicle object

#### Update Vehicle
- **URL**: `/api/v1/vehicles/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "plateNumber": "ABC-123",
    "attributes": {
      "color": "Red"
    }
  }
  ```
- **Response**: Updated vehicle object

#### Delete Vehicle
- **URL**: `/api/v1/vehicles/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Success message

### Parking Slot API

#### List Slots
- **URL**: `/api/v1/slots`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of parking slot objects

#### Get Slot by ID
- **URL**: `/api/v1/slots/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Parking slot object

#### Create Slot (Admin only)
- **URL**: `/api/v1/slots`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "slotNumber": "A-001",
    "vehicleType": "car",
    "size": "medium",
    "location": "north"
  }
  ```
- **Response**: Created parking slot object

#### Update Slot (Admin only)
- **URL**: `/api/v1/slots/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "vehicleType": "any",
    "status": "available"
  }
  ```
- **Response**: Updated parking slot object

#### Delete Slot (Admin only)
- **URL**: `/api/v1/slots/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Success message

### Slot Request API

#### List Requests
- **URL**: `/api/v1/requests`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of slot request objects

#### Get Request by ID
- **URL**: `/api/v1/requests/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Slot request object

#### Create Request
- **URL**: `/api/v1/requests`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "vehicleId": "vehicle-id",
    "slotId": "slot-id",
    "requestedDate": "2023-05-15T10:30:00Z"
  }
  ```
- **Response**: Created slot request object

#### Update Request (Approve/Reject)
- **URL**: `/api/v1/requests/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "status": "approved",
    "adminComment": "Approved for parking"
  }
  ```
- **Response**: Updated slot request object

#### Delete Request
- **URL**: `/api/v1/requests/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Success message

### Logs API

#### Get Action Logs (Admin only)
- **URL**: `/api/v1/logs?page=1&limit=10&search=query`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Paginated list of action logs

## 📂 Project Structure

```
vehicle_parking_system/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   └── dashboard/   # Dashboard pages
│   ├── services/        # API service functions
│   ├── store/           # Redux store
│   │   └── slices/      # Redux slices
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.