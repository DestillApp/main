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
const { AuthenticationError, UserInputError } = require("@apollo/server/errors");

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

        /**
     * @function checkUsernameExistence
     * @description Checks if the username exists in the database.
     * @param {Object} _ - Unused.
     * @param {String} username - The username to check.
     * @returns {Promise<Boolean>} True if the username exists, false otherwise.
     */
        checkUsernameExistence: async (_, { username }) => {
          try {
            const sanitizedUsername = DOMPurify.sanitize(username);
            const user = await User.findOne({ username: sanitizedUsername });
            console.log("USER", user)
            return !!user; // Return true if user exists, false otherwise
          } catch (error) {
            console.error("Error checking username existence:", error);
            throw new Error("Failed to check username existence");
          }
        },

            /**
     * @function getUserDetails
     * @description Fetches the username and email of the authenticated user.
     * @param {Object} _ - Unused.
     * @param {Object} __ - Unused.
     * @param {Object} context - The GraphQL context containing the authenticated user.
     * @returns {Promise<Object>} An object containing the username and email.
     */
    getUserDetails: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      try {
        const userDetails = await User.findById(user.id, "username email");
        if (!userDetails) {
          throw new Error("User not found");
        }
        return userDetails;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
        console.error("Error fetching user details:", error);
        throw new Error("Failed to fetch user details");
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

      try {
        // Check if the email or username already exists in the database
        const existingEmail = await User.findOne({ email: sanitizedEmail });
        if (existingEmail) {
          throw new UserInputError("Email already exists", {
            invalidArgs: { email: sanitizedEmail },
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
        if (err instanceof UserInputError) {
          throw err;
        }
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

      try {
        // Find user by email
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
          throw new AuthenticationError("Invalid credentials");
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
        if (!isMatch) {
          throw new AuthenticationError("Invalid credentials");
        }

        // Generate and return a JWT token
        const token = generateToken(user);

        // Setting cookie JWT
        res.cookie("authToken", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        return token;
      } catch (err) {
        console.error("Error during login:", err);
        if (err instanceof AuthenticationError) {
          throw err;
        }
        throw new Error("Failed to login");
      }
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

    /**
     * @async
     * @function changePassword
     * @description Changes the user's password if the old password is correct.
     * @param {Object} _ - Unused.
     * @param {Object} input - The input data containing the old and new passwords.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Boolean>} True if the password was changed successfully, false otherwise.
     */
    changePassword: async (_, { input }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      const { oldPassword, newPassword } = input;

      // Sanitize input data
      const sanitizedOldPassword = DOMPurify.sanitize(oldPassword);
      const sanitizedNewPassword = DOMPurify.sanitize(newPassword);

      try {
        // Find user by ID
        const foundUser = await User.findById(user.id);
        if (!foundUser) {
          throw new Error("User not found");
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(sanitizedOldPassword, foundUser.password);
        if (!isMatch) {
          throw new AuthenticationError("Invalid old password");
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(sanitizedNewPassword, 10);

        // Update the user's password
        foundUser.password = hashedNewPassword;
        await foundUser.save();

        return true;
      } catch (err) {
        console.error("Error during password change:", err);
        if (err instanceof AuthenticationError) {
          throw err;
        }
        throw new Error("Failed to change password");
      }
    },
  },
};

// Exporting the user resolvers
module.exports = userResolver;
