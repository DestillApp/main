# DestillationApp Backend

This is the backend API for DestillationApp, built with Node.js, Express, GraphQL (Apollo Server), and MongoDB.  
It provides a robust API for managing distillation processes, plants, results, user accounts, and settings.

---

## 🚀 Features

- **GraphQL API**: Modern GraphQL API with Apollo Server
- **MongoDB Integration**: Database operations with Mongoose ODM
- **JWT Authentication**: Secure user authentication and authorization
- **Input Sanitization**: Comprehensive data sanitization using validator package
- **Error Handling**: Centralized error handling with GraphQL errors
- **Data Validation**: Input validation and sanitization for security
- **Modular Architecture**: Well-organized resolver and schema structure

---

## 🛠️ Project Setup

```sh
npm install
```

### Running the Server

```sh
npm start
```

---

## 📚 Documentation

Generate API documentation using JSDoc:

```sh
npx jsdoc -c jsdoc.json
```

View documentation: `docs/index.html`

---

## 📦 Directory Structure

```
backend/
├── src/
│   ├── app.js                    # Express server setup
│   ├── database/                 # Mongoose models
│   ├── graphql/
│   │   ├── resolvers/           # GraphQL resolvers
│   │   └── schemas/             # GraphQL type definitions
│   └── util/                    # Utility functions
│       ├── sanitization/        # Input sanitization
│       ├── authChecking.js      # Authentication middleware
│       ├── dataformating.js     # Data formatting utilities
│       └── dateformater.js      # Date formatting utilities
├── docs/                        # JSDoc documentation
├── triggers/                    # Database triggers
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
# Database
# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=3000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

---

## 🔒 Security Features

- **Input Sanitization**: All user inputs sanitized using validator library
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Secure error messages with GraphQL errors
- **User Data Isolation**: User-specific data protection

---

## 📝 API Overview

The API provides GraphQL endpoints for:

- **Plants**: Create, read, update, delete plant entries
- **Distillations**: Manage distillation processes  
- **Results**: Store and retrieve distillation results
- **Users**: Authentication and profile management
- **Settings**: User preferences and configurations

Example query:
```graphql
query GetPlants {
  getPlants {
    _id
    plantName
    plantPart
    availableWeight
  }
}
```

---