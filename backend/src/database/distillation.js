/**
 * @module database/distillation
 * @description Defines the Mongoose schema for the Distillation model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Defining the Distillation schema
const distillationSchema = new Schema({
  isPlantSoaked: { type: Boolean, required: true },
  soakingTime: { type: Number, required: false },
  weightAfterSoaking: { type: Number, required: false },
});

// Exporting the Distillation model based on the distillationSchema
module.exports = mongoose.model("Distillation", distillationSchema);
