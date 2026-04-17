import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Activity className="h-8 w-8 text-blue-600" />
                        <Link to="/" className="ml-2 font-bold text-xl text-slate-900">CareConnect System</Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-slate-600 flex items-center">
                                    <User className="h-5 w-5 mr-1" />
                                    {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800"
                                >
                                    <LogOut className="h-5 w-5 mr-1" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
