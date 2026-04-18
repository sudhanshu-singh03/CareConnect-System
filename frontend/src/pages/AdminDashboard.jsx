import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Settings, BarChart2, CheckCircle, Activity, Users, FileText, UserPlus, X } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allAppointments, setAllAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Form state
    const [docForm, setDocForm] = useState({ name: '', email: '', password: '', age: '', specialization: '' });
    const [formError, setFormError] = useState('');

    const fetchMetrics = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [metricsRes, apptsRes, docsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/metrics', config),
                axios.get('http://localhost:5000/api/admin/appointments', config),
                axios.get('http://localhost:5000/api/admin/doctors', config)
            ]);
            setMetrics(metricsRes.data);
            setAllAppointments(apptsRes.data);
            setDoctors(docsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [user.token]);

    const runAlgorithm = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/admin/schedule/run', {}, config);
            alert(data.message || 'Scheduler ran successfully!');
            fetchMetrics();
        } catch (error) {
            console.error(error);
            alert('Error running scheduler');
        }
        setLoading(false);
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const newDoc = {
                ...docForm,
                availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM']
            };
            await axios.post('http://localhost:5000/api/admin/doctors', newDoc, config);
            setShowAddModal(false);
            setDocForm({ name: '', email: '', password: '', age: '', specialization: '' });
            fetchMetrics(); // refresh data
        } catch (error) {
            setFormError(error.response?.data?.message || 'Failed to add doctor');
        }
    };

    const handleFormChange = (e) => {
        setDocForm({ ...docForm, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">System Overview & Optimization Engine</p>
                </div>
                <button 
                    onClick={runAlgorithm} 
                    disabled={loading}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
                >
                    <Settings className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} /> 
                    {loading ? 'Running Optimization...' : 'Run Scheduling Algorithm'}
                </button>
            </div>
            
            {/* Metrics Section */}
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <BarChart2 className="mr-2 text-indigo-600" /> Key Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Average Wait Time</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {metrics?.avgWaitTimeMinutes || 0} <span className="text-lg font-medium text-slate-500">mins</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded text-red-600">
                            <Activity className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Load Balance (Diff)</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{metrics?.loadBalance || 0}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded text-blue-600">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Max workload minus min workload</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Slot Utilization</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{metrics?.slotUtilization || '0%'}</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded text-green-600">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Appointments</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{metrics?.totalAppointments || 0}</h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded text-purple-600">
                            <FileText className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Doctors Section */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mt-8">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Platform Doctors</h2>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold flex items-center shadow-sm transition-colors"
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Add New Doctor
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doc => (
                        <div 
                            key={doc._id} 
                            onClick={() => setSelectedDoctor(doc)}
                            className="border border-slate-200 rounded-xl p-5 hover:shadow-md cursor-pointer transition-shadow bg-gradient-to-br from-white to-slate-50 group hover:border-indigo-300"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {doc.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{doc.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{doc.specialization}</p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 border-t pt-3 border-slate-100">
                                <span>Load: <strong className="text-slate-700">{doc.currentLoad}</strong></span>
                                <span>Age: <strong className="text-slate-700">{doc.userId?.age || 'N/A'}</strong></span>
                            </div>
                        </div>
                    ))}
                    {doctors.length === 0 && (
                        <p className="text-slate-500 italic col-span-3">No doctors currently registered on the platform.</p>
                    )}
                </div>
            </div>

            {/* All Appointments Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mt-8">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-800">All Scheduled Appointments</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot / Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allAppointments.map((apt) => (
                                <tr key={apt._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{apt.patientId?.name}</div>
                                        <div className="text-sm text-gray-500">Age: {apt.patientId?.age}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">{apt.doctorId?.name}</div>
                                        <div className="text-sm text-gray-500">{apt.doctorId?.specialization}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-semibold text-slate-800">{apt.slot}</div>
                                        {new Date(apt.assignedTime).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {allAppointments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No appointments scheduled yet. Run the algorithm.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modals --- */}
            
            {/* Add Doctor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">Add New Doctor</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {formError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{formError}</div>}
                            <form onSubmit={handleAddDoctor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                    <input type="text" name="name" required value={docForm.name} onChange={handleFormChange} className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Dr. John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                        <input type="email" name="email" required value={docForm.email} onChange={handleFormChange} className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="jane@hospital.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                                        <input type="password" name="password" required value={docForm.password} onChange={handleFormChange} className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Department / Specialization</label>
                                        <input type="text" name="specialization" required value={docForm.specialization} onChange={handleFormChange} className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Orthopedics" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                                        <input type="number" name="age" required value={docForm.age} onChange={handleFormChange} className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="45" min="20" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                                        Create Doctor Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Doctor Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative">
                            <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-inner mb-4">
                                {selectedDoctor.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{selectedDoctor.name}</h3>
                            <p className="text-indigo-100 font-medium">{selectedDoctor.specialization}</p>
                        </div>
                        <div className="p-8">
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email</p>
                                    <p className="text-slate-800">{selectedDoctor.userId?.email || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age</p>
                                        <p className="text-slate-800">{selectedDoctor.userId?.age || 'N/A'} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Load</p>
                                        <p className="text-slate-800">{selectedDoctor.currentLoad} Appointments</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Daily Slots</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDoctor.availableSlots.map(slot => (
                                            <span key={slot} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md">
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
