const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const getDoctorAppointments = async (req, res) => {
  try {
    // Find doctor profile for the current user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email age')
      .sort({ assignedTime: -1 });

    res.json({ appointments, currentLoad: doctor.currentLoad });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctorAppointments };
