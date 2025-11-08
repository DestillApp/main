/**
 * @module database/user
 * @description Mongoose schema for user records.
 * Stores user authentication data and profile information.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for user records with authentication credentials.
 */
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

// Exporting the User model
module.exports = mongoose.model("User", userSchema);
