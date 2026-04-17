const express = require('express');
const router = express.Router();
const { getDoctorAppointments } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/appointments', protect, getDoctorAppointments);

module.exports = router;
