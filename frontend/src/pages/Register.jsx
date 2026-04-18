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
        <div className="min-h-screen flex bg-slate-50 shadow-inner">
            {/* Left side Image with overlay */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                <img 
                    src="/register-bg.png" 
                    alt="Healthcare Network Creation" 
                    className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/60 to-transparent flex flex-col justify-end p-16 text-white pb-24">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            Join CareConnect Today
                        </h1>
                        <p className="text-xl text-teal-100 font-light leading-relaxed drop-shadow">
                            Create your account to unlock priority scheduling, intelligent doctor matching, and a seamless healthcare experience tailored just for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side Form Area */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 relative">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 -transtslate-y-12 translate-x-1/3 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
                
                <div className="w-full max-w-md bg-white/80 p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-xl z-10 relative">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 rounded-2xl inline-flex mb-6 shadow-lg shadow-teal-500/30">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create an Account</h2>
                        <p className="text-slate-500 mt-2 font-medium">Join our healthcare community</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 flex items-center text-sm font-medium shadow-sm animate-pulse">
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input 
                                type="text" name="name" 
                                value={formData.name} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200" 
                                required placeholder="John Doe"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input 
                                    type="email" name="email" 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200" 
                                    required placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                                <input 
                                    type="number" name="age" 
                                    value={formData.age} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200" 
                                    required placeholder="35" min="0" max="150"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input 
                                type="password" name="password" 
                                value={formData.password} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200" 
                                required placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-3.5 rounded-xl hover:from-teal-600 hover:to-cyan-700 font-bold transition-all duration-300 shadow-lg shadow-teal-500/25 active:scale-95"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
