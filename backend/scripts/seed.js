const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Request = require('../models/Request');
const Appointment = require('../models/Appointment');

dotenv.config({ path: '../.env' }); // Adjust if run from root

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appointment-scheduler');

        console.log('Clearing old data...');
        await User.deleteMany();
        await Doctor.deleteMany();
        await Request.deleteMany();
        await Appointment.deleteMany();

        console.log('Seeding new data...');
        const password = '123456';

        // Create Admin
        await User.create({ name: 'Admin User', email: 'admin@test.com', password, role: 'admin', age: 30 });

        // Create Doctors
        const dr1 = await User.create({ name: 'Dr. Smith', email: 'smith@test.com', password, role: 'doctor', age: 45 });
        const doc1 = await Doctor.create({ userId: dr1._id, name: 'Dr. Smith', specialization: 'Cardiology', availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM'] });

        const dr2 = await User.create({ name: 'Dr. Jones', email: 'jones@test.com', password, role: 'doctor', age: 50 });
        const doc2 = await Doctor.create({ userId: dr2._id, name: 'Dr. Jones', specialization: 'Neurology', availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'] });

        // Create Patients
        const p1 = await User.create({ name: 'John Doe', email: 'john@test.com', password, role: 'patient', age: 55 }); // Age > 50 gives priority
        const p2 = await User.create({ name: 'Jane Doe', email: 'jane@test.com', password, role: 'patient', age: 30 });
        const p3 = await User.create({ name: 'Alice', email: 'alice@test.com', password, role: 'patient', age: 25 });
        const p4 = await User.create({ name: 'Bob', email: 'bob@test.com', password, role: 'patient', age: 60 });

        // Create Requests 
        // John: high urgency
        await Request.create({ patientId: p1._id, patientAge: p1.age, urgency: 5, preferredSlots: ['10:00 AM', '11:00 AM'], requestTime: new Date(Date.now() - 2 * 60 * 60 * 1000) }); // 2 hours ago
        // Jane: low urgency
        await Request.create({ patientId: p2._id, patientAge: p2.age, urgency: 2, preferredSlots: ['09:00 AM'], requestTime: new Date(Date.now() - 1 * 60 * 60 * 1000) }); // 1 hour ago
        // Alice: med urgency
        await Request.create({ patientId: p3._id, patientAge: p3.age, urgency: 3, preferredSlots: ['11:00 AM', '12:00 PM'], requestTime: new Date(Date.now() - 3 * 60 * 60 * 1000) }); // 3 hours ago
        // Bob: high urgency
        await Request.create({ patientId: p4._id, patientAge: p4.age, urgency: 4, preferredSlots: ['10:00 AM'], requestTime: Date.now() }); // now

        console.log('Seed completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedDatabase();
