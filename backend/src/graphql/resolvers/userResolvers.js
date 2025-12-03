/**
 * @module graphql/resolvers/userResolvers
 * @description User resolvers for GraphQL queries and mutations.
 * Handles user authentication, registration, password management, and user details.
 */

// Importing required modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../database/user");
const { requireAuth } = require("../../util/authChecking");
const { GraphQLError } = require("graphql");
const { escape, trim } = require("validator");

/**
 * @function generateToken
 * @description Generates a JWT token for a user with user ID and role information.
 * @param {Object} user - The user object containing user details.
 * @param {string} user._id - The user's unique identifier.
 * @param {string} [user.role] - The user's role (optional).
 * @returns {string} The generated JWT token that expires in 1 hour.
 * @throws {Error} When JWT signing fails.
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
     * @param {Object} parent - Unused parent parameter.
     * @param {Object} args - Unused arguments parameter.
     * @param {Object} context - The GraphQL context containing the request object.
     * @param {Object} context.req - The HTTP request object.
     * @param {Object} context.req.cookies - The request cookies.
     * @param {string} context.req.cookies.authToken - The authentication token from cookies.
     * @returns {Object} An object indicating whether the user is authenticated.
     * @returns {boolean} returns.isAuthenticated - True if token is valid, false otherwise.
     */
    verifyAuth: (parent, args, context) => {
      const token = context.req.cookies.authToken;
      if (!token) {
        return { isAuthenticated: false };
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        return { isAuthenticated: true };
      } catch (err) {
        return { isAuthenticated: false };
      }
    },

    /**
     * @async
     * @function checkUsernameExistence
     * @description Checks if the username exists in the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string} args.username - The username to check for existence.
     * @returns {Promise<boolean>} True if the username exists, false otherwise.
     * @throws {Error} When database query fails.
     */
    checkUsernameExistence: async (_, { username }) => {
      try {
        // Sanitize username using validator before querying the database
        const sanitizedUsername = escape(trim(username || ""));
        const user = await User.findOne({ username: sanitizedUsername });
        return !!user; // Return true if user exists, false otherwise
      } catch (error) {
        console.error("Error checking username existence:", error);
        throw new Error("Failed to check username existence");
      }
    },

    /**
     * @async
     * @function getUserDetails
     * @description Fetches the username and email of the authenticated user.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} __ - Unused arguments parameter.
     * @param {Object} context - The GraphQL context containing the authenticated user.
     * @param {Object} context.user - The authenticated user object.
     * @param {string} context.user.id - The authenticated user's ID.
     * @returns {Promise<Object>} An object containing the username and email.
     * @returns {string} returns.username - The user's username.
     * @returns {string} returns.email - The user's email address.
     * @throws {GraphQLError} When authentication fails or user is not found.
     */
    getUserDetails: async (_, __, { user }) => {
      requireAuth(user);

      try {
        const userDetails = await User.findById(user.id, "username email");
        if (!userDetails) {
          throw new Error("User not found");
        }
        return userDetails;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Error fetching user details:", error);
        throw new GraphQLError("Failed to fetch user details", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function registerUser
     * @description Registers a new user and saves it to the database with input validation and sanitization.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.userInput - Input data for the new user.
     * @param {string} args.userInput.username - The desired username.
     * @param {string} args.userInput.email - The user's email address.
     * @param {string} args.userInput.password - The user's password (will be hashed).
     * @returns {Promise<Object>} The created user object.
     * @returns {string} returns._id - The created user's ID.
     * @returns {string} returns.username - The created user's username.
     * @returns {string} returns.email - The created user's email.
     * @throws {GraphQLError} When email already exists or creation fails.
     */
    registerUser: async (_, { userInput }) => {
      let { username, email, password } = userInput;

      // Sanitize input data using validator
      const sanitizedUsername = escape(trim(username || ""));
      const sanitizedEmail = escape(trim(email || ""));
      const sanitizedPassword = escape(trim(password || ""));

      try {
        // Check if the email or username already exists in the database
        const existingEmail = await User.findOne({ email: sanitizedEmail });
        if (existingEmail) {
          throw new GraphQLError("Email already exists", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: { email: sanitizedEmail },
            },
          });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
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
        console.error("Error during user registration:", err);
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError("Failed to create user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    /**
     * @async
     * @function login
     * @description Logs in a user and returns a JWT token with secure cookie setting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.email - The user's email address.
     * @param {string} args.password - The user's password.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The HTTP request object.
     * @param {Object} context.res - The HTTP response object.
     * @returns {Promise<string>} The JWT token.
     * @throws {GraphQLError} When credentials are invalid or login fails.
     */
    login: async (_, { email, password }, { req, res }) => {
      // Sanitize input data using validator
      const sanitizedEmail = escape(trim(email || ""));
      const sanitizedPassword = escape(trim(password || ""));

      try {
        // Find user by email
        const user = await User.findOne({ email: sanitizedEmail });
        requireAuth(user);

        // Check if the password matches
        const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
        if (!isMatch) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        // Generate and return a JWT token
        const token = generateToken(user);

        // Setting cookie JWT
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        return token;
      } catch (err) {
        console.error("Error during login:", err);
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError("Failed to login", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    /**
     * @async
     * @function logout
     * @description Logs out a user by clearing the authentication cookie.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} __ - Unused arguments parameter.
     * @param {Object} context - The GraphQL context containing the request and response objects.
     * @param {Object} context.req - The HTTP request object.
     * @param {Object} context.res - The HTTP response object.
     * @returns {Promise<boolean>} A boolean indicating whether the logout was successful.
     */
    logout: async (_, __, { req, res }) => {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      });

      return true;
    },

    /**
     * @async
     * @function changePassword
     * @description Changes the user's password if the old password is correct.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.input - The input data containing the old and new passwords.
     * @param {string} args.input.oldPassword - The user's current password.
     * @param {string} args.input.newPassword - The user's new password.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.user - The authenticated user object.
     * @param {string} context.user.id - The authenticated user's ID.
     * @returns {Promise<boolean>} True if the password was changed successfully.
     * @throws {GraphQLError} When authentication fails, old password is invalid, or update fails.
     */
    changePassword: async (_, { input }, { user }) => {
      requireAuth(user);

      const { oldPassword, newPassword } = input;

      // Sanitize input data using validator
      const sanitizedOldPassword = escape(trim(oldPassword || ""));
      const sanitizedNewPassword = escape(trim(newPassword || ""));

      try {
        // Find user by ID
        const foundUser = await User.findById(user.id);
        if (!foundUser) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(
          sanitizedOldPassword,
          foundUser.password
        );
        if (!isMatch) {
          throw new GraphQLError("Invalid old password", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(sanitizedNewPassword, 10);

        // Update the user's password
        foundUser.password = hashedNewPassword;
        await foundUser.save();

        return true;
      } catch (err) {
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError("Failed to change password", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

// Exporting the user resolvers
module.exports = userResolver;
