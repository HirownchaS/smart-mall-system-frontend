import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingQR from '../components/Parking/BookingQR';
import { decodeJwt } from 'jose';

const ParkingTickets = () => {
  const [tickets, setTickets] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        setUserId(decodedToken._id); // Assuming the token has a `_id` field
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return; // Do not fetch if userId is not set
      try {
        const response = await axios.get(`http://localhost:8080/api/park/bookings/${userId}`);
        setTickets(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full  py-20 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      { tickets && tickets.length > 0 ? (
        <div>
        {tickets.map((ticket, index) => (
          <BookingQR key={index} bookingId={ticket._id} slot={ticket.parkingSlot.slot} status={ ticket.isActive } />
        ))}
      </div>
      ) : (
        <div>No tickets found</div>
      )}
    </div>
  );
};

export default ParkingTickets;