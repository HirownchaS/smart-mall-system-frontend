import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PropTypes from 'prop-types';

const QRCodeDisplay = ({ bookingId }) => {
  if (!bookingId) {
    return <div className="text-red-500">Invalid booking ID</div>;
  }

  return (
    <div>
      <QRCodeCanvas value={bookingId} />
    </div>
  );
};

QRCodeDisplay.propTypes = {
  bookingId: PropTypes.string.isRequired,
};

const Parking = () => {
  const [bookingId, setBookingId] = useState('');

  const handleBookingIdChange = (event) => {
    setBookingId(event.target.value);
  };

  return (
    <div>
      Generate QR code for parking
      <input
        type="text"
        placeholder="Enter booking ID"
        value={bookingId}
        onChange={handleBookingIdChange}
      />
      <QRCodeDisplay bookingId={bookingId} />
    </div>
  );
};

export default Parking;