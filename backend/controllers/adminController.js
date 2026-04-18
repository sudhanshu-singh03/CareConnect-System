const { runScheduler, calculateMetrics } = require('../services/scheduler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

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

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).populate('userId', 'email age');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, age, specialization, availableSlots } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'doctor',
            age
        });

        const doctor = await Doctor.create({
            userId: user._id,
            name,
            specialization,
            availableSlots
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { triggerScheduler, getMetrics, getAllAppointments, getAllDoctors, addDoctor };
