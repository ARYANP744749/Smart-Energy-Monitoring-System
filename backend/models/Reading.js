const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  meterId: { type: String, default: 'MFM384-1' },
  timestamp: { type: Date, default: Date.now },
  voltage: Number,       // V
  current: Number,       // A
  activePower: Number,   // kW
  reactivePower: Number, // kVAR
  apparentPower: Number, // kVA
  energy: Number,        // kWh (cumulative or incremental)
  powerFactor: Number,
  thd: Number
});

module.exports = mongoose.model('Reading', ReadingSchema);
