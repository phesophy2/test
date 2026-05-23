import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FarmReel from './pages/FarmReel';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Subscription from './pages/Subscription';
import './styles/farmReel.css';
import './styles/responsive.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><FarmReel /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
