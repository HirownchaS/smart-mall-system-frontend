import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={`text-yellow-400 ${index < rating ? "filled" : ""}`}
    />
  ));

  return <div className="flex">{stars}</div>;
};

export default StarRating;
