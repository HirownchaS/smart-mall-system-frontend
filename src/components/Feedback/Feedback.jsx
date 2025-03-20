// UpdateFeedback.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

const Feedback = ({ feedbackId, initialFeedback, onClose, onUpdate }) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (initialFeedback) {
      setValue("rating", initialFeedback.storeRating.rating);
      setValue("feedback", initialFeedback.feedback);
    }
  }, [initialFeedback, setValue]);

  const onSubmit = (data) => {
    const updatedFeedback = {
      ...initialFeedback,
      storeRating: {
        ...initialFeedback.storeRating,
        rating: data.rating,
      },
      feedback: data.feedback,
    };

    axios
      .put(`http://localhost:8080/api/feedback/update/${feedbackId}`, updatedFeedback)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Feedback Updated!',
          text: 'Your feedback has been updated successfully.',
        });
        onUpdate(); 
        onClose(); 
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an error updating your feedback. Please try again.',
        });
      });
  };

  return (
    <div className="modal-content">
      <h2 className="text-2xl mb-4 dark:text-white">Update Your Feedback</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-lg dark:text-white">Rating (1-5):</label>
          <input
            type="number"
            {...register("rating", { required: true, min: 1, max: 5 })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block text-lg dark:text-white">Feedback:</label>
          <textarea
            {...register("feedback", { required: true })}
            className="border p-2 rounded w-full"
          ></textarea>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-primary text-white rounded w-full"
        >
          Update Feedback
        </button>
      </form>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded w-full"
      >
        Close
      </button>
    </div>
  );
};

export default Feedback;
