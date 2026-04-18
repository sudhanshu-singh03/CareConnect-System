import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [doctors, setDoctors] = useState([]);
    
    // Form state
    const [urgency, setUrgency] = useState(1);
    const [preferredSlots, setPreferredSlots] = useState([]);
    const [preferredDepartment, setPreferredDepartment] = useState('');
    const availableTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [apptRes, docsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/patient/appointments', config),
                axios.get('http://localhost:5000/api/patient/doctors', config)
            ]);
            setAppointments(apptRes.data.appointments);
            setPendingRequest(apptRes.data.pendingRequest);
            setDoctors(docsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleSlotToggle = (slot) => {
        if (preferredSlots.includes(slot)) {
            setPreferredSlots(preferredSlots.filter(s => s !== slot));
        } else {
            if (preferredSlots.length < 3) setPreferredSlots([...preferredSlots, slot]);
        }
    };

    const submitRequest = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/patient/request', {
                urgency, preferredSlots, preferredDepartment: preferredDepartment || null
            }, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting request');
        }
    };

    const departments = [...new Set(doctors.map(doc => doc.specialization))].filter(Boolean);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Patient Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-blue-600" /> Book Appointment
                    </h2>
                    
                    <div className="mb-4">
                        <label className="block text-slate-700 font-medium mb-2">Available Departments</label>
                        <select 
                            value={preferredDepartment} 
                            onChange={(e) => setPreferredDepartment(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">No Preference (Any Department)</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {pendingRequest ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Clock className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You have a pending request waiting for the scheduler to run. Priorities will be calculated dynamically.
                                    </p>
                                    <p className="font-medium mt-2 text-sm text-yellow-800">
                                        Preferred Slots: {pendingRequest.preferredSlots.join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submitRequest}>
                            <div className="mb-4">
                                <label className="block text-slate-700 font-medium mb-2">Urgency Level (1-5)</label>
                                <div className="flex items-center space-x-2">
                                    <input type="range" min="1" max="5" value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="w-full" />
                                    <span className="font-bold text-lg">{urgency}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">1: Routine Checkup, 5: Critical/Immediate Need</p>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-slate-700 font-medium mb-2">Preferred Slots (Max 3)</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTimeSlots.map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => handleSlotToggle(slot)}
                                            className={`px-3 py-1 rounded-full text-sm border ${
                                                preferredSlots.includes(slot) 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={preferredSlots.length === 0}
                                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                Submit Request
                            </button>
                        </form>
                    )}
                </div>

                {/* My Appointments */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-indigo-600" /> Upcoming Scheduled Appointments
                        </h2>
                        
                        {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
                            <p className="text-slate-500 italic">No upcoming appointments.</p>
                        ) : (
                            <ul className="space-y-4">
                                {appointments.filter(a => a.status === 'scheduled').map(apt => (
                                    <li key={apt._id} className="border p-4 rounded bg-slate-50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                        <p className="font-bold text-lg text-slate-800">{apt.doctorId?.name}</p>
                                        <p className="text-sm text-slate-600">{apt.doctorId?.specialization}</p>
                                        <div className="mt-2 flex items-center text-sm font-medium text-slate-700 bg-white inline-block px-2 py-1 rounded shadow-sm border">
                                            <Clock className="w-4 h-4 mr-1 text-indigo-500 inline" /> {apt.slot}
                                        </div>
                                        <span className="absolute top-4 right-4 capitalize font-semibold text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                            {apt.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 opacity-80">
                        <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-600">
                            <Calendar className="mr-2 h-5 w-5 text-slate-400" /> Previous Appointment Records
                        </h2>
                        
                        {appointments.filter(a => a.status !== 'scheduled').length === 0 ? (
                            <p className="text-slate-500 italic">No past records found.</p>
                        ) : (
                            <ul className="space-y-4">
                                {appointments.filter(a => a.status !== 'scheduled').map(apt => (
                                    <li key={apt._id} className="border p-4 rounded bg-slate-100 relative overflow-hidden">
                                        <p className="font-bold text-lg text-slate-700">{apt.doctorId?.name}</p>
                                        <p className="text-sm text-slate-500">{apt.doctorId?.specialization}</p>
                                        <div className="mt-2 flex items-center text-sm font-medium text-slate-500 bg-white inline-block px-2 py-1 rounded shadow-sm border">
                                            <Clock className="w-4 h-4 mr-1 text-slate-400 inline" /> {apt.slot} - {new Date(apt.assignedTime).toLocaleDateString()}
                                        </div>
                                        <span className={`absolute top-4 right-4 capitalize font-semibold text-xs px-2 py-1 rounded ${apt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                            {apt.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
