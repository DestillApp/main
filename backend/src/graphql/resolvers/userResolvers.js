/**
 * @module graphql/resolvers/userResolvers
 * @description User resolvers for GraphQL mutations.
 * Handles user registration.
 */

// Importing required modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../database/user");
const DOMPurify = require("../../util/sanitizer");
const { AuthenticationError } = require("apollo-server-express");

/**
 * @function generateToken
 * @description Generates a JWT token for a user.
 * @param {Object} user - The user object containing user details.
 * @returns {String} The generated JWT token.
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const options = {
    expiresIn: "1h", // Token expiry time
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const userResolver = {
  Query: {
    /**
     * @function verifyAuth
     * @description Verifies the user's authentication status based on the provided token.
     * @param {Object} parent - Unused.
     * @param {Object} args - Unused.
     * @param {Object} context - The GraphQL context containing the request object.
     * @returns {Object} An object indicating whether the user is authenticated.
     */
    verifyAuth: (parent, args, context) => {
      console.log("verifyAuth called");
      const token = context.req.cookies.authToken;
      console.log("Token:", token);
      if (!token) {
        console.log("No token found");
        return { isAuthenticated: false };
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token is valid");
        return { isAuthenticated: true };
      } catch (err) {
        console.log("Token verification failed:", err);
        return { isAuthenticated: false };
      }
    },
  },
  Mutation: {
    /**
     * @async
     * @function registerUser
     * @description Registers a new user and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} userInput - Input data for the new user.
     * @returns {Promise<Object>} The created user.
     */
    registerUser: async (_, { userInput }) => {
      const { username, email, password } = userInput;

      // Sanitizing input data
      const sanitizedUsername = DOMPurify.sanitize(username);
      const sanitizedEmail = DOMPurify.sanitize(email);
      const sanitizedPassword = DOMPurify.sanitize(password);

      // Hashing the password
      const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
      try {
        // Creating a new User instance
        const user = new User({
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: hashedPassword,
        });
        // Saving the user to the database
        const result = await user.save();
        return result;
      } catch (err) {
        throw new Error("Failed to create user");
      }
    },

    /**
     * @async
     * @function login
     * @description Logs in a user and returns a JWT token.
     * @param {Object} _ - Unused.
     * @param {String} email - The user's email.
     * @param {String} password - The user's password.
     * @returns {Promise<String>} The JWT token.
     * @throws {AuthenticationError} If the credentials are invalid.
     */
    login: async (_, { email, password }, { req, res }) => {
      // Sanitize input data
      const sanitizedEmail = DOMPurify.sanitize(email);
      const sanitizedPassword = DOMPurify.sanitize(password);

      //Find user by email
      const user = await User.findOne({ email: sanitizedEmail });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      //Check if the password matches
      const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
      if (!isMatch) {
        throw new AuthenticationError("Invalid credentials");
      }

      //Generate and return a JWT token
      const token = generateToken(user);

      // Setting cookie JWT
      res.cookie("authToken", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 3600000, //1 hour
        path: "/",
      });

      return token;
    },

    /**
     * @async
     * @function logout
     * @description Logs out a user by clearing the authentication cookie.
     * @param {Object} _ - Unused.
     * @param {Object} __ - Unused.
     * @param {Object} context - The GraphQL context containing the request and response objects.
     * @returns {Promise<Boolean>} A boolean indicating whether the logout was successful.
     */
    logout: async (_, __, { req, res }) => {
      res.clearCookie("authToken");
      return true;
    },
  },
};

// Exporting the user resolvers
module.exports = userResolver;
