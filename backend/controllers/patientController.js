const Request = require('../models/Request');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const createRequest = async (req, res) => {
  try {
    const { urgency, preferredSlots, preferredDoctorId } = req.body;
    
    // Check if patient already has a pending request
    const existingRequest = await Request.findOne({ patientId: req.user._id, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending appointment request.' });
    }

    const request = await Request.create({
      patientId: req.user._id,
      patientAge: req.user.age,
      urgency,
      preferredDoctorId: preferredDoctorId || null,
      preferredSlots
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ assignedTime: -1 });
      
    const pendingRequest = await Request.findOne({ patientId: req.user._id, status: 'pending' });
    
    res.json({ appointments, pendingRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
      const doctors = await Doctor.find({});
      res.json(doctors);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

module.exports = { createRequest, getPatientAppointments, getDoctors };
