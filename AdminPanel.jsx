import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [customTimes, setCustomTimes] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/admin-login');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/check-auth`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchBookings();
        } else {
          navigate('/admin-login');
        }
      } catch {
        navigate('/admin-login');
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setBookings([]);
    }
  };

  const cancelBooking = async (id) => {
    await fetch(`${API_URL}/api/bookings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const setTimes = async () => {
    const timesArray = customTimes.split(',').map(t => t.trim());
    await fetch(`${API_URL}/api/set-available-times`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date: selectedDate, times: timesArray })
    });
    alert('Available times updated');
  };

  if (isAuthenticated === null) return <p>Loading...</p>;
  if (isAuthenticated === false) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Set Available Times</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enter times, e.g. 10:00 AM, 11:00 AM"
          value={customTimes}
          onChange={e => setCustomTimes(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={setTimes}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Set Times
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map(b => (
            <li key={b.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p><strong>{b.name}</strong> - {b.service}</p>
                <p>{b.date} at {b.time}</p>
                {b.phone && <p>📞 {b.phone}</p>}
              </div>
              <button
                onClick={() => cancelBooking(b.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;
