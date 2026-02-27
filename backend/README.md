# Ride Sharing API

This is the backend service for a Ride Sharing application, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (A running instance, either local or cloud-based)

### Installation

1.  Clone the repository:
    ```sh
    git clone <your-repository-url>
    ```
2.  Navigate to the backend directory:
    ```sh
    cd RideSharing/backend
    ```
3.  Install the required dependencies:
    ```sh
    npm install
    ```

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the `backend` directory and add the following variables.

```env
# .env.example

# Server port
PORT=5000

# Your MongoDB connection string
DB_URL=mongodb://localhost:27017/ridesharing

# Secret key for signing JSON Web Tokens
JWT_SECRET_KEY=your_super_secret_key
```

## Running the Application

To start the server, run the following command from the `backend` directory:

```sh
npm start
```

The server will start on the port specified in your `.env` file (defaults to `5000`).

## API Endpoints

### User Registration

Registers a new user in the system.

- **URL**: `/api/users/register`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Success Response (201 Created)**:

  Sets an `httpOnly` cookie with the JWT and returns a JSON object with the new user's information and the token.

  ```json
  {
    "message": "User registered successfully",
    "user": {
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com",
      "_id": "60d0fe4f5311236168a109ca",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **Error Responses**:
  - `400 Bad Request`: If validation fails (e.g., missing fields, invalid email, short password) or if the user already exists.
  - `500 Internal Server Error`: For any other server-side errors.

### User Login

Authenticates a user and returns a JWT token.

- **URL**: `/api/users/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Success Response (200 OK)**:

  Sets an `httpOnly` cookie with the JWT and returns a JSON object with the user's information and the token.

  ```json
  {
    "message": "User logged in successfully",
    "user": {
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com",
      "_id": "60d0fe4f5311236168a109ca",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **Error Responses**:
  - `400 Bad Request`: If validation fails, credentials are invalid, or user does not exist.
  - `500 Internal Server Error`: For any other server-side errors.