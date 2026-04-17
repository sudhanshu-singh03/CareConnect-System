const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availableSlots: [{ type: String }], // e.g., "10:00 AM", "11:00 AM"
  currentLoad: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
