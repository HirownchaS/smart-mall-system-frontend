import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const RegisterModal = ({ isOpen, setIsOpen, event }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle registration
  const handleRegister = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const userId = localStorage.getItem("id");
      console.log("userId", userId);
      console.log("eventId", event?.Id);
      
      const response = await axios.post(`http://localhost:8080/api/event/register`, {
        userId,
        eventId: event?.Id,
      });

      if (response.status === 200) {
        setIsOpen(false); // Close the modal after successful registration
        Swal.fire({
                  icon: 'success',
                  title: 'Event Registered',
                  text: 'You can Participate the event!',
                }).then(() => {
                  setModal(false);
                  
                });
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
      console.log("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Register for Event</h2>
              <p className="mt-2 text-sm text-gray-500">
                You are about to register for the event: <strong>{event?.Subject}</strong>
              </p>

              {/* Displaying the start and end time of the event */}
              <div className="mt-3">
                <div className="text-sm">
                  <strong>Start Time: </strong>
                  {event?.StartTime && new Date(event.StartTime).toLocaleString()}
                </div>
                <div className="text-sm">
                  <strong>End Time: </strong>
                  {event?.EndTime && new Date(event.EndTime).toLocaleString()}
                </div>
              </div>

              {/* Error message */}
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

              {/* Register button */}
              <div className="mt-4">
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>

              {/* Close button */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterModal;
