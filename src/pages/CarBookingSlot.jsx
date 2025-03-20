// CarBookingSlot.js
import React, { useState } from "react";
import BookingModal from "./BookingModal"; // Import the new modal component

const CarBookingSlot = () => {
  const totalSlots = 50;
  const [slots, setSlots] = useState(Array(totalSlots).fill(false));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal for a specific slot
  const openModal = (index) => {
    setSelectedSlot(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase">Book your slot</h1>
      <div className="grid grid-cols-5 gap-4">
        {slots.map((isBooked, index) => (
          <div
            key={index}
            className={`p-4 border rounded-md text-center cursor-pointer ${
              isBooked
                ? "bg-red-500 text-white dark:bg-red-700"
                : "bg-green-500 text-white dark:bg-green-700"
            }`}
            onClick={() => !isBooked && openModal(index)}
          >
            {isBooked ? `Slot ${index + 1} (Booked)` : `Slot ${index + 1}`}
          </div>
        ))}
      </div>

      {/* Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        selectedSlot={selectedSlot} 
        slots={slots} 
        setSlots={setSlots} 
      />
    </div>
  );
};

export default CarBookingSlot;
