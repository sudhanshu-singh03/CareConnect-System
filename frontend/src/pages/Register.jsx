import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'patient', age: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Register</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-slate-700 mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 mb-2">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 mb-2">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Register;
