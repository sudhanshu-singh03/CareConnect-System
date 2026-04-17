const { runScheduler, calculateMetrics } = require('../services/scheduler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const triggerScheduler = async (req, res) => {
    try {
        const result = await runScheduler();
        res.json({ message: 'Scheduler completed', ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMetrics = async (req, res) => {
    try {
        const metrics = await calculateMetrics();
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('patientId', 'name email age')
            .populate('doctorId', 'name specialization')
            .sort({ assignedTime: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { triggerScheduler, getMetrics, getAllAppointments };
