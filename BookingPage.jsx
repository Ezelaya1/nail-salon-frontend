import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = process.env.REACT_APP_API_URL;

function BookingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('manicure');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedDate && service) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setLoadingTimes(true);
      fetch(`${API_URL}/api/available-times?date=${formattedDate}&service=${service}`)
        .then(res => res.json())
        .then(data => setAvailableTimes(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching times:", err))
        .finally(() => setLoadingTimes(false));
    }
  }, [selectedDate, service]);

  const submitBooking = async () => {
    if (!name || !phone || !selectedDate || !time || !service) {
      alert('Please fill all fields');
      return;
    }

    const phonePattern = /^[0-9]{7,15}$/;
    if (!phonePattern.test(phone)) {
      alert('Please enter a valid phone number (numbers only)');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert('Please enter a valid name (letters only)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, date: formattedDate, time })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Something went wrong. Please try again later.');
        return;
      }

      setConfirmation(data.message);
      setShowSuccess(true);

      setName('');
      setPhone('');
      setService('manicure');
      setSelectedDate(new Date());
      setTime('');
      setAvailableTimes([]);

      setTimeout(() => {
        setConfirmation('');
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setErrorMessage('There was an error processing your booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Book an Appointment</h1>

      <input
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="tel"
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        placeholder="Your Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <select
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        value={service}
        onChange={e => setService(e.target.value)}
      >
        <option value="">Select a Service</option>
        <option value="Acrylic Manicure">Acrylic Manicure</option>
        <option value="Gel Manicure">Gel Manicure</option>
        <option value="Basic Manicure">Basic Manicure</option>
        <option value="Acrylic Pedicure">Acrylic Pedicure</option>
        <option value="Gel Pedicure">Gel Pedicure</option>
        <option value="Basic Pedicure">Basic Pedicure</option>
      </select>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()}
        filterDate={(date) => date.getDay() !== 0} //0 = Sunday
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        placeholderText="Select a date"
      />

      <select
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        value={time}
        onChange={e => setTime(e.target.value)}
        disabled={loadingTimes}
      >
        <option value="">Select Time</option>
        {loadingTimes ? (
          <option>Loading times...</option>
        ) : availableTimes.length === 0 ? (
          <option>No available times</option>
        ) : (
          availableTimes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))
        )}
      </select>

      <button
        className={`bg-blue-500 text-white p-2 w-full rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={submitBooking}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Booking...' : 'Book Now'}
      </button>

      {showSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {confirmation}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default BookingPage;
