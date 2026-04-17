import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Settings, BarChart2, CheckCircle, Activity, Users, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allAppointments, setAllAppointments] = useState([]);

    const fetchMetrics = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [metricsRes, apptsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/metrics', config),
                axios.get('http://localhost:5000/api/admin/appointments', config)
            ]);
            setMetrics(metricsRes.data);
            setAllAppointments(apptsRes.data);
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

    return (
        <div className="space-y-6">
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
        </div>
    );
};

export default AdminDashboard;
