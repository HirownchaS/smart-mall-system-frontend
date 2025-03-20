// BookingModal.js
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";

const BookingModal = ({ isOpen, onClose, selectedSlot, slots, setSlots }) => {
  
  const today = new Date().toISOString().split("T")[0];

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    carNumber: Yup.string().required("Car number is required"),
    date: Yup.string().required("Date is required").test(
      "notPastDate",
      "Past dates are not allowed",
      (value) => new Date(value) >= new Date(today)
    ),
    fromTime: Yup.string().required("From time is required"),
    hours: Yup.number()
      .typeError("Hours must be a number")
      .positive("Hours must be a positive number")
      .integer("Hours must be a whole number")
      .min(1, "Minimum booking is 1 hour")
      .required("Hours are required"),
  });

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Close modal and reset form
  const closeModal = () => {
    onClose();
    reset();
  };

  // Show SweetAlert for successful booking
  const showSuccessAlert = (slotNumber) => {
    Swal.fire({
      icon: "success",
      title: "Booking Confirmed",
      text: `Slot ${slotNumber + 1} booked successfully!`,
      confirmButtonColor: "#3085d6",
    });
  };

  // Submit booking form
  const onSubmit = (data) => {
    const newSlots = [...slots];
    newSlots[selectedSlot] = true;
    setSlots(newSlots);
    closeModal();
    showSuccessAlert(selectedSlot);  
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Booking Slot {selectedSlot + 1}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium dark:text-gray-300">
              Car Number
            </label>
            <input
              type="text"
              {...register("carNumber")}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {errors.carNumber && (
              <p className="text-red-500">{errors.carNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium dark:text-gray-300">Date</label>
            <input
              type="date"
              {...register("date")}
              min={today} 
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium dark:text-gray-300">From Time</label>
            <input
              type="time"
              {...register("fromTime")}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {errors.fromTime && (
              <p className="text-red-500">{errors.fromTime.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium dark:text-gray-300">Hours</label>
            <input
              type="number"
              {...register("hours")}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {errors.hours && (
              <p className="text-red-500">{errors.hours.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-md dark:bg-gray-600"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md dark:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
