import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeCanvas } from 'qrcode.react';

const BookingQR = ({ bookingId, status, slot}) => {
  // Determine the border color based on the status
  const borderColor = status ? 'border-gray-300' : 'border-gray-300 opacity-50';
  const bgColor = status ? 'bg-white' : 'bg-gray-100';

  return (
    <div className={`border ${borderColor} rounded-lg p-6 text-center shadow-md w-80 mx-auto ${bgColor}`}>
      <h2 className="text-xl font-bold mb-4">Your Ticket</h2>
      <p className="text-lg">
        Booking ID: <span className="font-semibold">{bookingId}</span>
      </p>
      <p className="text-lg">
        Slot No: <span className="font-semibold">{slot}</span>
      </p>
      <div className="flex justify-center items-center my-4">
        <QRCodeCanvas value={bookingId} size={128} />
      </div>
      <p className="text-sm text-gray-500">
        {status ? 'Show this QR code at the entrance.' : 'Expired'}
      </p>
    </div>
  );
};

BookingQR.propTypes = {
  bookingId: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  slot: PropTypes.string.isRequired,
};

export default BookingQR;