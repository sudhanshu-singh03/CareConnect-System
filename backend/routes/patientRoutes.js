const express = require('express');
const router = express.Router();
const { createRequest, getPatientAppointments, getDoctors, cancelAppointment } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, createRequest);
router.get('/appointments', protect, getPatientAppointments);
router.put('/appointment/:id/cancel', protect, cancelAppointment);
router.get('/doctors', protect, getDoctors);

module.exports = router;
