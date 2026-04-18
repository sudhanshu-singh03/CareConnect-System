const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientAge: { type: Number, required: true },
  urgency: { type: Number, required: true, min: 1, max: 5 }, // 1 is least, 5 is most urgent
  preferredDepartment: { type: String },
  preferredSlots: [{ type: String }],
  requestTime: { type: Date, default: Date.now },
  priorityScore: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'scheduled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
