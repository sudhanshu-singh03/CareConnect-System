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
        <div className="min-h-screen flex bg-slate-50 shadow-inner">
            {/* Left side Image with overlay */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                <img 
                    src="/login-bg.png" 
                    alt="Healthcare Network Illustration" 
                    className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/60 to-transparent flex flex-col justify-end p-16 text-white pb-24">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            Welcome to CareConnect
                        </h1>
                        <p className="text-xl text-blue-100 font-light leading-relaxed drop-shadow">
                            The intelligent scheduling ecosystem built for modern healthcare. Seamlessly bridging the gap between patients and specialized care.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side Form Area */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 relative">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 -transtslate-y-12 translate-x-1/3 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
                
                <div className="w-full max-w-md bg-white/80 p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-xl z-10 relative">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl inline-flex mb-6 shadow-lg shadow-blue-500/30">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Login into CareConnect system</h2>
                        <p className="text-slate-500 mt-2 font-medium">Please sign in to your account</p>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200" 
                                required placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200" 
                                required placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-95"
                        >
                            Sign In to Portal
                        </button>
                    </form>

                    <div className="mt-10 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Quick Demo Access (Pwd: 123456)</p>
                        <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span> Patient: john@test.com</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span> Doctor: smith@test.com</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span> Admin: admin@test.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
