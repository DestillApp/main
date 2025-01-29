/**
 * @module database/settings
 * @description Defines the Mongoose schema for the User Settings model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Defining the Distiller schema
const distillerSchema = new Schema({
  material: { type: String, required: true },
  capacity: { type: Number, required: true },
  heating: { type: String, required: true },
});

// Defining the UserSettings schema
const userSettingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  listSettings: {
    plantListLength: { type: Number, default: 10 },
    distillationListLength: { type: Number, default: 10 },
    distillationArchivesListLength: { type: Number, default: 10 },
  },
  listSorting: {
    plantListSorting: { type: String, default: "createdAt" },
    distillationListSorting: { type: String, default: "createdAt" },
    archiveDistillationListSorting: { type: String, default: "createdAt" },
  },
  distillerList: { type: [distillerSchema], default: [] }, 
  updatedAt: { type: Date, default: Date.now },
});

// Exporting the UserSettings model based on the userSettingsSchema
module.exports = mongoose.model("UserSettings", userSettingsSchema);