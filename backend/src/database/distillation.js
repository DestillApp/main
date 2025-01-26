/**
 * @module database/distillation
 * @description Defines the Mongoose schema for the Distillation model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

const choosedPlantSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "Plant", required: true },
  name: { type: String, required: true },
  part: { type: String, required: true },
  availableWeight: { type: Number, required: true },
  harvestDate: { type: String, required: false },
  buyDate: { type: String, required: false },
});

const distillationTimeSchema = new Schema({
  distillationHours: { type: Number, required: false },
  distillationMinutes: { type: Number, required: false },
});

// Defining the Distillation schema
const distillationSchema = new Schema({
  choosedPlant: { type: choosedPlantSchema, required: true },
  weightForDistillation: { type: Number, required: true },
  isPlantSoaked: { type: Boolean, required: true },
  soakingTime: { type: Number, required: false },
  weightAfterSoaking: { type: Number, required: false },
  isPlantShredded: { type: Boolean, required: true },
  distillationType: { type: String, required: true },
  distillationDate: { type: String, required: true },
  distillationApparatus: { type: String, required: true },
  waterForDistillation: { type: Number, required: true },
  distillationTime: { type: distillationTimeSchema, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, required: true },
});

// Exporting the Distillation model based on the distillationSchema
module.exports = mongoose.model("Distillation", distillationSchema);
