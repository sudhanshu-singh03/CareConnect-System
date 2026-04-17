const express = require('express');
const router = express.Router();
const { triggerScheduler, getMetrics, getAllAppointments } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/schedule/run', protect, admin, triggerScheduler);
router.get('/metrics', protect, admin, getMetrics);
router.get('/appointments', protect, admin, getAllAppointments);

module.exports = router;
