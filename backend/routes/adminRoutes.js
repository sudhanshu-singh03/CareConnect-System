const express = require('express');
const router = express.Router();
const { triggerScheduler, getMetrics, getAllAppointments, getAllDoctors, addDoctor } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/schedule/run', protect, admin, triggerScheduler);
router.get('/metrics', protect, admin, getMetrics);
router.get('/appointments', protect, admin, getAllAppointments);
router.get('/doctors', protect, admin, getAllDoctors);
router.post('/doctors', protect, admin, addDoctor);
module.exports = router;
