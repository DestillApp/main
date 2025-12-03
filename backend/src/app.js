/**
 * @module app
 * @description Entry point of the application.
 * Initializes the Express server with Apollo Server for handling GraphQL requests.
 * Connects to the MongoDB database.
 */

console.log("Hello from Node.js!");

// Importowanie pakietu dotenv
require("dotenv").config({ path: "./.env" });

// Importing required modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// Importing GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./graphql/index.js");

// Importing the User model
const User = require("./database/user");

// Creating an Express application
const app = express();

app.use(express.json());

// Using cookie parser
app.use(cookieParser());

// Read allowed origins from environment variable and split into array
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",")
//   : [];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, "") === normalizedOrigin);

    if (isAllowed) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));

// Passport.js configuration
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

app.use(passport.initialize());

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
  typeDefs: typeDefs,
  resolvers: resolvers,
});

// Connecting to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI) // Use the connection string from .env
  .then(async () => {
    await server.start();

    app.use(
      "/graphql",
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          return new Promise((resolve, reject) => {
            passport.authenticate(
              "jwt",
              { session: false },
              (err, user, info) => {
                if (err) {
                  console.log("Error in passport.authenticate:", err);
                  reject(err);
                }
                resolve({ req, res, user });
              }
            )(req, res);
          });
        },
      })
    );

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    // If there's an error in connecting to the database
    console.log("Failed to connect to MongoDB:", err);
  });

// Middleware Passport.js for authentication
const authenticate = passport.authenticate("jwt", { session: false });

//Routes protect middlewares
//Post protect middlewares
app.post("/add-plant", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.post("/edit-plant/:page/:id", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.post("/add-distillation/:id?", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.post(
  "/edit-distillation/:page/:distillId/:id?",
  authenticate,
  (req, res) => {
    res.send("This is a protected route");
  }
);

app.post("/add-results/:distillId", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.post(
  "/edit-archive-distillation/:page/:archiveId",
  authenticate,
  (req, res) => {
    res.send("This is a protected route");
  }
);

//Get protect middlewares
app.get("/my-account", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get(
  "/my-account/destillations-in-progress/:page",
  authenticate,
  (req, res) => {
    res.send("This is a protected route");
  }
);

app.get(
  "/my-account/distillation-details/:page/:distillId",
  authenticate,
  (req, res) => {
    res.send("This is a protected route");
  }
);

app.get("/my-account/plant-list/:page", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/plant-details/:page/:id", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get("/my-account/distillation-archives/:page", authenticate, (req, res) => {
  res.send("This is a protected route");
});

app.get(
  "/my-account/archive-distillation/:page/:archiveId",
  authenticate,
  (req, res) => {
    res.send("This is a protected route");
  }
);

app.get("/my-account/my-data", authenticate, (req, res) => {
  res.send("This is a protected route");
});
