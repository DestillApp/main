/**
 * @module database/user
 * @description Defines the Mongoose schema for the User model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Defining the User schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

// Exporting the User model based on the userSchema
module.exports = mongoose.model("User", userSchema);
