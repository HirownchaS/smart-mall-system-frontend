import React from 'react';
import QRCodeDisplay from './BookingQR.jsx';

const BookingConfirmation = ({ bookingId }) => {
  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <p>Your booking has been successfully confirmed.</p>
      <QRCodeDisplay bookingId={bookingId} />
    </div>
  );
};

export default BookingConfirmation;