import React, { useEffect, useState } from "react";
import { FaStar, FaUser } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const StoresDetail = () => {
  const [StoresData, setStoresData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateFeedbackData, setUpdateFeedbackData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [stName, setStName] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the store data
        const storeResponse = await fetch(
          `http://localhost:8080/api/store/${id}`
        );
        if (!storeResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const storeData = await storeResponse.json();
        setStoresData(storeData);
        setStName(storeData.name);

        console.log("Store Name:", storeData.name); // Log store name

        // Fetch the authenticated user data
        const token = localStorage.getItem("authtoken");
        if (token) {
          const userResponse = await axios.get(
            "http://localhost:8080/api/user/auth",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!userResponse.data.error) {
            setUserId(userResponse.data._id);
            setUserName(userResponse.data.username);
          } else {
            setUserId(null);
          }
        }

        // Fetch feedbacks for the specific store name
        if (storeData.name) {
          const feedbackResponse = await axios.get(
            `http://localhost:8080/api/feedback/getAll`,
            {
              params: { storeName: storeData.name }, // Send store name as query param
            }
          );
          setFeedbacks(feedbackResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onSubmitFeedback = (data) => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const feedbackData = {
      store: StoresData?._id,
      storeName: stName,
      rating: parseInt(data.rating),
      userId: userId,
      feedback: data.feedback,
    };

    if (updateFeedbackData) {
      axios
        .put(
          `http://localhost:8080/api/feedback/update/${updateFeedbackData._id}`,
          feedbackData
        )
        .then((response) => {
          setIsModalOpen(false);
          setUpdateFeedbackData(null);
          Swal.fire({
            icon: "success",
            title: "Feedback Updated!",
            text: "Your feedback has been updated.",
          });
          axios
            .get("http://localhost:8080/api/feedback/getAll")
            .then((res) => setFeedbacks(res.data));
        })
        .catch((error) => {
          console.error("Error updating feedback:", error);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an error updating your feedback. Please try again.",
          });
        });
    } else {
      axios
        .post(`http://localhost:8080/api/feedback`, feedbackData)
        .then((response) => {
          setIsModalOpen(false);
          setUpdateFeedbackData(null);
          Swal.fire({
            icon: "success",
            title: "Feedback Submitted!",
            text: "Thank you for your feedback.",
          });
          axios.get("http://localhost:8080/api/feedback/getAll").then((res) => {
            setFeedbacks(res.data);
            const totalRating = res.data.storeRating.reduce(
              (sum, feedback) => sum + feedback.rating,
              0
            );

            // Calculate the average rating, rounded to one decimal place
            const averageRating = (totalRating / res.data.length).toFixed(1);

            // Set the average rating to state (assuming you have a rating state)
            setRating(averageRating);
          });
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "There was an error submitting your feedback. Please try again.",
          });
        });
    }
  };

  const handleUpdate = (feedback) => {
    setUpdateFeedbackData(feedback);
    reset({ rating: feedback.rating, feedback: feedback.feedback });
    setIsModalOpen(true);
  };

  const handleDelete = (feedbackId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/api/feedback/delete/${feedbackId}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Feedback has been deleted.",
            });
            setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
          })
          .catch((error) => {
            console.error("Error deleting feedback:", error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to delete feedback.",
            });
          });
      }
    });
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-6xl mb-5 text-primary">
            {StoresData?.name || "Loading..."} Flagship Store
            {/* {rating} */}
          </p>
        </div>
        {loading ? (
          <p>Loading store and user details...</p>
        ) : StoresData ? (
          <div
            data-aos="fade-up"
            className="space-y-3 flex flex-col items-center"
          >
            <img
              src={StoresData?.img}
              alt=""
              className="h-[350px] w-[500px] object-cover rounded-md"
            />
            <div className="text-center">
              <h2 className="font-semibold text-6xl">{StoresData?.name}</h2>
              <h5 className="text-2xl">Level - {StoresData?.level}</h5>
              <h5 className="text-2xl">Store No - {StoresData?.storeno}</h5>
              <div className="flex items-center justify-center">
                <FaStar className="text-yellow-400" />
                <span className="ml-2">{StoresData?.rating}</span>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded"
                onClick={() => {
                  setUpdateFeedbackData(null);
                  reset();
                  setIsModalOpen(true);
                }}
              >
                Add Your Feedback
              </button>
            </div>
          </div>
        ) : (
          <p>Error loading store details.</p>
        )}
      </div>

      <div className="mt-8 container">
        <h3 className="text-2xl mb-4 dark:text-white">
          What our customer says:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <FaUser className="text-gray-500 dark:text-gray-300" />
                <span className="ml-2 font-semibold text-gray-900 dark:text-gray-200">
                  {feedback.userId?.username || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < feedback.storeRating.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                {/* <span className="ml-2 text-gray-900 dark:text-gray-200">
                  ({feedback.storeRating.rating})
                </span> */}
              </div>
              <p className="text-gray-900 dark:text-gray-200">
                {feedback.feedback}
              </p>
              {userId === feedback.userId?._id && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleUpdate(feedback)}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Feedback Modal"
      >
        <h2 className="text-xl mb-4">
          {updateFeedbackData ? "Update Feedback" : "Add Feedback"}
        </h2>
        <form onSubmit={handleSubmit(onSubmitFeedback)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="rating"
            >
              Rating
            </label>
            <input
              type="number"
              {...register("rating", { required: true, min: 1, max: 5 })}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="1 to 5"
            />
            {errors.rating && (
              <span className="text-red-500">Rating is required.</span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="feedback"
            >
              Feedback
            </label>
            <textarea
              {...register("feedback", { required: true })}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Your feedback here..."
            />
            {errors.feedback && (
              <span className="text-red-500">Feedback is required.</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {updateFeedbackData ? "Update Feedback" : "Submit Feedback"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StoresDetail;
