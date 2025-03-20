import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import axios from "axios";
import Modal from "./Modal";
// import { convertToIST } from "../../utils";
import {convertToIST} from "../../pages/CalenderIndex"
const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  //   events fetching function
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const url = `http://localhost:8080/api/event/future-events`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setEvents(response?.data);
      }
    } catch (error) {
      console.log("Error while fetching events,", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  //  calling events fetching function
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
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 md:gap-5 place-items-center">
          {events.map((event, key) => (
            <div
              key={key}
              data-aos="zoom-in"
              className="h-full rounded-2xl bg-[#00000011] dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
              onClick={() => {
                setIsOpen(true);
                setSelectedEvent(event);
              }}
            >
              <div className="flex justify-center items-center mt-3">
                <FcCalendar className="size-10" />
              </div>

              {/* details section */}
              <div className="p-4 space-y-3">
                <div className="text-md font-bold text-center">
                  {event?.Subject}
                </div>

                <div className="w-full flex flex-col justify-center items-start text-xs">
                  <div className="font-semibold">Start Time</div>
                  <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88]">
                    {event?.StartTime && convertToIST(event?.StartTime)}
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center items-start text-xs">
                  <div className="font-semibold">End Time</div>
                  <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88]">
                    {event?.EndTime && convertToIST(event?.EndTime)}
                  </div>
                </div>

                <div className="w-full flex flex-wrap justify-between items-center text-xs">
                  <div className="font-semibold">Is All Day</div>
                  <div className="text-[#00000088] dark:text-[#ffffff88] group-hover:text-[#ffffff88]">
                    {event?.IsAllDay ? "True" : "False"}
                  </div>
                </div>

                {/* <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                  {event?.Description}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} event={selectedEvent} />
    </div>
  );
};

export default Events;
