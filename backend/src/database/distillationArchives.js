/**
 * @module database/distillationArchives
 * @description Defines the Mongoose schema for the Distillation Archives model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

const distilledPlantSchema = new Schema({
  plantName: { type: String, required: true },
  plantPart: { type: String, required: true },
  plantOrigin: { type: String, required: true },
  plantBuyDate: { type: String, required: false },
  plantProducer: { type: String, required: false },
  countryOfOrigin: { type: String, required: false },
  harvestDate: { type: String, required: false },
  harvestTemperature: { type: Number, required: false },
  harvestStartTime: { type: String, required: false },
  harvestEndTime: { type: String, required: false },
  plantState: { type: String, required: true },
  dryingTime: { type: Number, required: false },
  plantAge: { type: Number, required: false },
});

const distillationTimeSchema = new Schema({
  distillationHours: { type: Number, required: false },
  distillationMinutes: { type: Number, required: false },
});

// Defining the DistillationData schema based on the distillation schema but without choosedPlant key
const distillationDataSchema = new Schema({
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
});

// Defining the Distillation Archives schema
const distillationArchivesSchema = new Schema({
  oilAmount: { type: Number, required: true },
  hydrosolAmount: { type: Number, required: true },
  hydrosolpH: { type: Number, required: true },
  oilDescription: { type: String, required: true },
  hydrosolDescription: { type: String, required: true },
  distillationData: { type: distillationDataSchema, required: true },
  distilledPlant: { type: distilledPlantSchema, required: true },
});

module.exports = mongoose.model(
  "DistillationArchives",
  distillationArchivesSchema
);
