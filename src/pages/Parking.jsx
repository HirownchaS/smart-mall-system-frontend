import React, { useState, useEffect } from "react";
import car from "../assets/car.png";
import carslot from "../assets/carslot.png";
import { decodeJwt } from "jose";
import Swal from "sweetalert2";
import axios from "axios";

const Parking = () => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userName, setUserName] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [user, setUser] = useState([]);
  // Track booking timestamp separately from arrival time
  const [bookingDate, setBookingDate] = useState("");

  const slots = Array.from({ length: 24 }, (_, i) => i + 1);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        setUser(decodedToken);
        setUserName(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Set booking time to current time when component loads
    // const now = new Date();
    // const hours = String(now.getHours()).padStart(2, '0');
    // const minutes = String(now.getMinutes()).padStart(2, '0');
    // setBookingTime(`${hours}:${minutes}`);

    fetchBookedSlots();

    // Set up interval to refresh booked slots every minute
    // This helps ensure slots are freed up after departure time
    const intervalId = setInterval(fetchBookedSlots, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/park/booked-slots"
      );
      const data = await response.json();

      // Filter out slots where departure time has passed
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      const bookedSlots = data.parkingSlots
        .filter((slot) => {
          // If the slot has departureTime info and it has passed, don't consider it booked
          if (slot.isBooked && slot.departureTime) {
            const [departureHours, departureMinutes] = slot.departureTime
              .split(":")
              .map(Number);
            const departureTimeInMinutes =
              departureHours * 60 + departureMinutes;
            return departureTimeInMinutes > currentTimeInMinutes;
          }
          return slot.isBooked;
        })
        .map((slot) => slot.slot);

      setBookedSlots(bookedSlots);
      console.log("Currently booked slots:", bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  // Helper function to validate car number format
  const validateCarNumber = (carNumber) => {
    const carNumberRegex = /^([A-Z0-9]{2,3})-\d{4}$/;
    return carNumberRegex.test(carNumber);
  };

  // Helper function to validate time inputs
  const validateTimeInputs = (arrival, departure) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [arrivalHours, arrivalMinutes] = arrival.split(":").map(Number);
    const arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;

    const [departureHours, departureMinutes] = departure.split(":").map(Number);
    const departureInMinutes = departureHours * 60 + departureMinutes;

    // Check if arrival time is in the past
    if (arrivalInMinutes < currentTime) {
      return {
        valid: false,
        message: "You cannot select an arrival time in the past.",
      };
    }

    // Check if departure time is before arrival time
    if (departureInMinutes <= arrivalInMinutes) {
      return {
        valid: false,
        message: "Departure time must be after arrival time.",
      };
    }

    // Check if booking duration is within reasonable limits (e.g., max 24 hours)
    const durationInMinutes = departureInMinutes - arrivalInMinutes;
    if (durationInMinutes > 24 * 60) {
      return {
        valid: false,
        message: "Booking duration cannot exceed 24 hours.",
      };
    }

    return { valid: true };
  };

  // Handle slot booking
  const handleBookSlot = async () => {
    const carNumber = document.querySelector(
      'input[placeholder="Car Number"]'
    ).value;

    if (!selectedSlot || !carNumber || !arrivalTime || !departureTime) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select a slot, enter your car number, and set both arrival and departure times.",
        showConfirmButton: true,
      });
      return;
    }

    // Validate car number format
    if (!validateCarNumber(carNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Car Number",
        text: "Valid formats: 108-2345, AB-2345, ABC-2345.",
        showConfirmButton: true,
      });
      return;
    }

    // Validate time inputs
    const timeValidation = validateTimeInputs(arrivalTime, departureTime);
    if (!timeValidation.valid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Selection",
        text: timeValidation.message,
        showConfirmButton: true,
      });
      return;
    }

    const token = localStorage.getItem("authtoken");
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;

        // Get current timestamp for booking time
        const now = new Date();
        const bookingTimestamp = now.toISOString();
        console.log("a:", arrivalTime, "d:", departureTime);

        const response = await fetch("http://localhost:8080/api/park/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slot: selectedSlot,
            carNumber,
            userId,
            bookingDate: bookingDate,
            // bookingTime: "", // When the booking is made
            arrivalTime: arrivalTime, // When user plans to arrive
            departureTime: departureTime, // When user plans to leave
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setBookedSlots([...bookedSlots, selectedSlot]);

          const body = {
            subject: "Booking Successful",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745; font-size: 24px;">Booking Successful</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                  Dear Customer,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  Congratulations! You have successfully booked <strong>Slot ${selectedSlot}</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  <strong>Booking Details:</strong><br>
                  Booking Time: ${new Date().toLocaleTimeString()}<br>
                  Arrival Time: ${arrivalTime}<br>
                  Departure Time: ${departureTime}
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  We are happy to confirm your parking slot reservation. Please ensure to arrive at the designated time and keep this confirmation handy.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  If you have any questions, feel free to reach out to our support team.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  Thank you for choosing our service!
                </p>
                <p style="font-style: italic; font-size: 14px; color: #888; margin-top: 20px;">
                  Smart Parking Service Team
                </p>
              </div>
            `,
          };

          await axios
            .post(`http://localhost:8080/api/mail/${user._id}`, body)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                text: "User notified!!",
                showConfirmButton: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });

          Swal.fire({
            icon: "success",
            title: `Slot ${selectedSlot} booked successfully!`,
            text: `From ${arrivalTime} to ${departureTime}`,
            showConfirmButton: true,
          });

          // Clear form after successful booking
          setSelectedSlot("");
          setArrivalTime("");
          setDepartureTime("");
          document.querySelector('input[placeholder="Car Number"]').value = "";
        } else {
          console.log(data.message);
          Swal.fire({
            icon: "error",
            title: `${data.message}`,
            showConfirmButton: true,
          });
        }
      } catch (error) {
        console.error("Error booking slot:", error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "User not authenticated. Please log in.",
        showConfirmButton: true,
      });
    }
  };

  // Calculate parking duration in hours and minutes
  const calculateDuration = () => {
    if (!arrivalTime || !departureTime) return "";

    const [arrivalHours, arrivalMinutes] = arrivalTime.split(":").map(Number);
    const [departureHours, departureMinutes] = departureTime
      .split(":")
      .map(Number);

    let durationHours = departureHours - arrivalHours;
    let durationMinutes = departureMinutes - arrivalMinutes;

    if (durationMinutes < 0) {
      durationHours--;
      durationMinutes += 60;
    }

    return `${durationHours}h ${durationMinutes}m`;
  };

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[10ch]">
      <div className="w-full grid grid-cols-2 gap-16 items-center">
        <div className="col-span-1 space-y-8">
          <img
            src={car}
            alt="parking img"
            className="w-full aspect[3/2] h-32 rounded-md object-contain"
          />
          <div className="space-y-4 flex flex-col gap-0 items-center justify-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              Smart Parking Service
            </h1>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Park your car without any hassle
            </h1>
          </div>
        </div>
        <div className="col-span-1 space-y-10">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Car Number"
              className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
            />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
              readOnly
            />
            <input
              type="text"
              value={selectedSlot}
              placeholder="Slot ID"
              className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
              readOnly
            />
            {/* Add booking time display (current time when making reservation) */}
            <div className="flex flex-col w-full">
              <label className="ml-4 mb-1 text-sm text-neutral-600 dark:text-neutral-300">
                Booking Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col w-full">
                <label className="ml-4 mb-1 text-sm text-neutral-600 dark:text-neutral-300">
                  Arrival Time
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="ml-4 mb-1 text-sm text-neutral-600 dark:text-neutral-300">
                  Departure Time
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="ml-4 w-full border-2 border-primary/40 rounded-md px-4 py-2 focus:outline-none focus:border-primary ease-in-out duration-300"
                />
              </div>
            </div>
            {arrivalTime && departureTime && (
              <div className="ml-4 mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                <span className="font-medium">Duration:</span>{" "}
                {calculateDuration()}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center ml-4">
            <button
              onClick={handleBookSlot}
              className="bg-primary/40 text-neutral-50 font-medium text-base px-6 py-2 rounded-md hover:bg-primary ease-in-out duration-300"
            >
              Book Slot
            </button>
          </div>
        </div>
      </div>

      {/* Slot Layout */}
      <div className="mt-16 grid grid-cols-12 gap-4">
        {slots.map((slot) => (
          <div
            key={slot}
            className={`flex flex-col items-center space-y-2 p-4 rounded-md cursor-pointer 
              ${
                bookedSlots.includes(`S${slot}`)
                  ? "border-4 border-red-500"
                  : "border-4 border-green-500"
              } 
              ${selectedSlot === `S${slot}` ? "bg-primary/20" : ""}`}
            onClick={() =>
              !bookedSlots.includes(`S${slot}`) && setSelectedSlot(`S${slot}`)
            } // Prevent selecting booked slot
          >
            <img
              src={carslot}
              alt={`Slot ${slot}`}
              className="w-full h-full object-contain"
            />
            <span className="text-neutral-900 dark:text-neutral-50 font-medium">
              S{slot}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parking;
