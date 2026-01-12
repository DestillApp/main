# DestillationApp Backend

This is the backend API for DestillationApp, built with Node.js, Express, GraphQL (Apollo Server), and MongoDB.  
It provides a robust API for managing distillation processes, plants, results, user accounts, and settings.

---

## 🚀 Deployment / Live API

The backend API is deployed and accessible at:

🌐 **Live API:** [https://destillapp.onrender.com/graphql](https://destillapp.onrender.com/graphql)

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

The API is documented using **JSDoc** with auto-generated documentation.
You can also view the docs online: [DestillationApp Backend Docs](https://destillapp.github.io/destill-app-fullstack/backend/)

### Generate Documentation Locally

```sh
npm run docs:js
```

### View Documentation Locally

**Option 1: Direct file access**
```sh
# Open in browser
open docs/jsdoc/index.html
```

**Option 2: Serve documentation locally**
```sh
# Install serve globally (one time only)
npm install -g serve

# Serve documentation on localhost
npx serve docs/jsdoc
```

Then visit `http://localhost:3000` to browse the interactive documentation.

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
