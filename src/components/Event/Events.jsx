import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import axios from "axios";
import Modal from "./Modal";
import RegisterModal from "../Event/RegisterModel"; 
import { convertToIST } from "../../pages/CalenderIndex";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Fetch events from the backend
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const url = `http://localhost:8080/api/event/future-events`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (error) {
      console.log("Error while fetching events,", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="container my-10 min-h-screen">
        {/* Header section */}
        <div className="text-left mb-5">
          <h1 data-aos="fade-up" className="text-3xl font-bold mt-5">
            Events
          </h1>
        </div>

        {/* Event list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 md:gap-5 place-items-center">
          {events.map((event, key) => (
            <div
              key={key}
              data-aos="zoom-in"
              className="h-full rounded-2xl bg-[#00000011] dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px] p-4"
            >
              <div className="flex justify-center items-center mt-3">
                <FcCalendar className="size-10" />
              </div>

              {/* Event details */}
              <div className="p-4 space-y-3">
                <div className="text-md font-bold text-center">
                  {event?.Subject}
                </div>

                <div className="text-xs">
                  <div className="font-semibold">Start Time</div>
                  <div>{event?.StartTime && convertToIST(event?.StartTime)}</div>
                </div>

                <div className="text-xs">
                  <div className="font-semibold">End Time</div>
                  <div>{event?.EndTime && convertToIST(event?.EndTime)}</div>
                </div>

                <div className="text-xs">
                  <div className="font-semibold">Is All Day</div>
                  <div>{event?.IsAllDay ? "Yes" : "No"}</div>
                </div>

                {/* Register Button */}
                <button
                  className="w-full mt-3 bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsRegisterOpen(true);
                  }}
                >
                  View 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} event={selectedEvent} />

      {/* Event Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        setIsOpen={setIsRegisterOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default Events;
