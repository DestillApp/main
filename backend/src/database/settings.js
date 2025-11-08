/**
 * @module database/settings
 * @description Mongoose schema for user settings records.
 * Stores user preferences, list configurations, and distiller data.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema for distiller equipment information.
 */
const distillerSchema = new Schema({
  material: { type: String, required: true },
  capacity: { type: Number, required: true },
  heating: { type: String, required: true },
});

/**
 * Main schema for user settings with preferences and configurations.
 */
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
  isDarkTheme: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

// Exporting the UserSettings model
module.exports = mongoose.model("UserSettings", userSettingsSchema);