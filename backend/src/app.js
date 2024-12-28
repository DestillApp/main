/**
 * @module app
 * @description Entry point of the application.
 * Initializes the Express server with Apollo Server for handling GraphQL requests.
 * Connects to the MongoDB database.
 */

console.log("Hello from Node.js!");

// Importowanie pakietu dotenv
require("dotenv").config({path: './.env'});
console.log("JWT!", process.env.JWT_SECRET);

// Importing required modules
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authenticate = require("./util/authenticate.js");
const cors = require("cors");

// Importing GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./graphql/index.js");

// Creating an Express application
const app = express();

app.use(express.json());

//Using cookie parser
app.use(cookieParser());

// Enable CORS with specific options
const corsOptions = {
  origin: "http://localhost:8080", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// Middleware to set x-public-route header for specific operations
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  if (req.body && req.body.operationName) {
    const publicOperations = ["registerUser", "Login"];
    if (publicOperations.includes(req.body.operationName)) {
      req.headers["x-public-route"] = "true";
    }
  }
  next();
});

// Creating an Apollo Server instance
const server = new ApolloServer({
  typeDefs: typeDefs, // GraphQL schema definitions
  resolvers: resolvers, // GraphQL schema definitions
  playground: true, // Enables GraphQL Playground for interactive exploration
  context: ({ req, res }) => {
    return { req, res };
  },

  formatResponse: (response, requestContext) => {
    requestContext.response.http.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:8080"
    );
    requestContext.response.http.headers.set(
      "Access-Control-Allow-Credentials",
      "true"
    );
    return response;
  },
});

//Routes protect middlewares
app.post("/add-plant", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.post("/add-destillation", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/destillations-in-progress", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/plant-list", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/saved-destillations", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/my-data", authenticate, (req, res) => {
  res.send("This is a protected route");
});

// Connecting to MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/destillit") // MongoDB connection string
  .then((result) => {
    // If connection is successful
    // Starting the Apollo Server
    server
      .start()
      .then(() => {
        // Once the server is started
        // Applying Apollo Server middleware to the Express app
        server.applyMiddleware({ app });
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
          console.log(
            `Server ready at http://localhost:${PORT}${server.graphqlPath}`
          ); // Starting the Express app to listen on port 3000
        });
      })
      .catch((err) => {
        // If there's an error in connecting to the database
        console.log("Failed to connect to MongoDB:", err);
      });
  });
