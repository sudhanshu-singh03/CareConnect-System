import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('john@test.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Login to MediSchedule</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-slate-700 mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">
                    Sign In
                </button>
            </form>
            <div className="mt-6 text-sm text-slate-500">
                <p><strong>Demo Accounts (Pwd: 123456):</strong></p>
                <ul className="list-disc pl-5 mt-2">
                    <li>Patient: john@test.com</li>
                    <li>Doctor: smith@test.com</li>
                    <li>Admin: admin@test.com</li>
                </ul>
            </div>
        </div>
    );
};

export default Login;
