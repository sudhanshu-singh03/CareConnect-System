const Request = require('../models/Request');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const runScheduler = async () => {
    // 1. Fetch pending requests
    const pendingRequests = await Request.find({ status: 'pending' }).populate('patientId');
    if (pendingRequests.length === 0) return { message: 'No pending requests', metrics: null };

    // Calculate priority for each request
    const currentTime = Date.now();
    pendingRequests.forEach(req => {
        const ageFactor = req.patientAge >= 50 ? 2 : 1;
        // waitingFactor in hours for meaningful impact, otherwise it will dominate
        const waitingHours = (currentTime - new Date(req.requestTime).getTime()) / (1000 * 60 * 60);
        const waitingFactor = Math.min(waitingHours, 10); // cap to prevent overwhelming score
        
        req.priorityScore = (3 * req.urgency) + ageFactor + waitingFactor;
    });

    // 2. Priority Sorting (Highest priority first)
    pendingRequests.sort((a, b) => b.priorityScore - a.priorityScore);

    // 3. Fetch Doctors and initialize loads
    const doctors = await Doctor.find({});
    // Create a working structure to track doctor availability during this run
    let drState = doctors.map(d => ({
        id: d._id,
        name: d.name,
        slots: [...d.availableSlots],
        currentLoad: d.currentLoad,
        assignedToSlot: {} // slot -> appointmentId
    }));

    const appointmentsCreated = [];
    const fulfilledRequests = [];

    // 4. Stable Matching & Load Balancing Integration
    // We try to match each patient (sorted by priority) to their highest preferred slot.
    for (let req of pendingRequests) {
        let assigned = false;
        
        for (let preferredSlot of req.preferredSlots) {
            // Find doctors who have this slot available
            let availableDoctors = drState.filter(d => d.slots.includes(preferredSlot) && !d.assignedToSlot[preferredSlot]);
            
            if (availableDoctors.length > 0) {
                let selectedDoctor;
                
                // First try to assign to preferred doctor if they are available
                if (req.preferredDoctorId) {
                    const prefDocIdStr = req.preferredDoctorId.toString();
                    const prefDocIndex = availableDoctors.findIndex(d => d.id.toString() === prefDocIdStr);
                    if (prefDocIndex !== -1) {
                        selectedDoctor = availableDoctors[prefDocIndex];
                    }
                }
                
                // If preferred doctor is not available or not chosen, use load balancing
                if (!selectedDoctor) {
                    // Load Balancing: Pick the doctor with the minimum currentLoad among available doctors
                    availableDoctors.sort((a, b) => a.currentLoad - b.currentLoad);
                    selectedDoctor = availableDoctors[0];
                }

                // Create appointment
                const apt = new Appointment({
                    requestId: req._id,
                    patientId: req.patientId._id,
                    doctorId: selectedDoctor.id,
                    slot: preferredSlot,
                    status: 'scheduled'
                });
                await apt.save();
                appointmentsCreated.push(apt);

                // Update Request status
                req.status = 'scheduled';
                await req.save();
                fulfilledRequests.push(req);

                // Update Doctor State
                selectedDoctor.assignedToSlot[preferredSlot] = apt._id;
                selectedDoctor.currentLoad += 1;
                
                // Also update the database doctor load
                await Doctor.findByIdAndUpdate(selectedDoctor.id, { $inc: { currentLoad: 1 } });
                
                assigned = true;
                break; // Patient is assigned, move to next patient
            }
        }
        // If assigned == false, no slots could be matched. Stays pending.
    }

    // Calculate Metrics
    return await calculateMetrics();
};

const calculateMetrics = async () => {
    const allAppointments = await Appointment.find({}).populate('requestId');
    const doctors = await Doctor.find({});
    
    // Average Waiting Time (from request to assignment)
    let totalWaitTime = 0;
    let appointedRequests = 0;
    
    allAppointments.forEach(apt => {
        if (apt.requestId && apt.assignedTime && apt.requestId.requestTime) {
            totalWaitTime += (new Date(apt.assignedTime) - new Date(apt.requestId.requestTime));
            appointedRequests += 1;
        }
    });
    
    const avgWaitTimeMinutes = appointedRequests > 0 ? (totalWaitTime / appointedRequests) / (1000 * 60) : 0;

    // Load Balance = max load - min load
    const loads = doctors.map(d => d.currentLoad);
    let loadBalance = 0;
    if (loads.length > 0) {
        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        loadBalance = maxLoad - minLoad;
    }

    // Slot Utilization = booked slots / total accessible slots
    let totalSlots = 0;
    let bookedSlots = 0;
    doctors.forEach(d => {
        totalSlots += d.availableSlots.length;
        bookedSlots += d.currentLoad; // assuming each currentLoad is 1 slot
    });
    
    const slotUtilization = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

    return {
        avgWaitTimeMinutes: avgWaitTimeMinutes.toFixed(2),
        loadBalance,
        slotUtilization: slotUtilization.toFixed(2) + '%',
        totalDoctors: doctors.length,
        totalAppointments: allAppointments.length
    };
};

module.exports = { runScheduler, calculateMetrics };
