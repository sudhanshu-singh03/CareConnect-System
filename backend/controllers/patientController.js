const Request = require('../models/Request');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { runScheduler } = require('../services/scheduler');

const createRequest = async (req, res) => {
  try {
    const { urgency, preferredSlots, preferredDepartment, preferredDate } = req.body;
    
    // Check if patient already has a pending request
    const existingRequest = await Request.findOne({ patientId: req.user._id, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending appointment request.' });
    }

    const request = await Request.create({
      patientId: req.user._id,
      patientAge: req.user.age,
      urgency,
      preferredDepartment: preferredDepartment || null,
      preferredDate,
      preferredSlots
    });

    await runScheduler();

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
    const notBookedRequest = await Request.findOne({ patientId: req.user._id, status: 'not booked' }).sort({ createdAt: -1 });
    
    res.json({ appointments, pendingRequest, notBookedRequest });
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

const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user._id });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.status !== 'scheduled') {
            return res.status(400).json({ message: 'Only scheduled appointments can be cancelled.' });
        }
        
        appointment.status = 'cancelled';
        await appointment.save();

        if (appointment.doctorId) {
            await Doctor.findByIdAndUpdate(appointment.doctorId, { $inc: { currentLoad: -1 } });
        }

        res.json({ message: 'Appointment cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRequest, getPatientAppointments, getDoctors, cancelAppointment };
