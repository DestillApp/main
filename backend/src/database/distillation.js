/**
 * @module database/distillation
 * @description Mongoose schema for distillation process records.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema for plant selected for distillation.
 */
const choosedPlantSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "Plant", required: true },
  name: { type: String, required: true },
  part: { type: String, required: true },
  availableWeight: { type: Number, required: true },
  harvestDate: { type: String, required: false },
  buyDate: { type: String, required: false },
});

/**
 * Schema for distillation time duration.
 */
const distillationTimeSchema = new Schema({
  distillationHours: { type: Number, required: false },
  distillationMinutes: { type: Number, required: false },
});

/**
 * Main schema for distillation process records.
 */
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
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("Distillation", distillationSchema);
