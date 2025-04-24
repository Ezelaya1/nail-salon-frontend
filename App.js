import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div className="p-4">
        {/* Navigation Bar */}
        <nav className="flex gap-8 mb-6 justify-center text-lg font-semibold">
          <Link to="/" className="hover:text-blue-500 transition-colors">
            Book Appointment
          </Link>
          <Link to="/admin" className="hover:text-blue-500 transition-colors">
            Admin Panel
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
