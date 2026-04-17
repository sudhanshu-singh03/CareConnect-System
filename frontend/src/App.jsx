import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);
    
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    
    return children;
};

const HomeRoute = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'patient') return <Navigate to="/patient" />;
    if (user.role === 'doctor') return <Navigate to="/doctor" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/patient" element={
                <PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>
              } />
              <Route path="/doctor" element={
                <PrivateRoute role="doctor"><DoctorDashboard /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
              } />
              
              <Route path="/" element={<HomeRoute />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
