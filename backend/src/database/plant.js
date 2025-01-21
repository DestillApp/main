/**
 * @module database/plant
 * @description Defines the Mongoose schema for the Plant model.
 */

// Importing mongoose module
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Defining the Plant schema
const plantSchema = new Schema({
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
  plantWeight: { type: Number, required: true },
  availableWeight: { type: Number, required: true },
  plantState: { type: String, required: true },
  dryingTime: { type: Number, required: false },
  plantAge: { type: Number, required: false },
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true },
});

// Exporting the Plant model based on the plantSchema
module.exports = mongoose.model("Plant", plantSchema);
