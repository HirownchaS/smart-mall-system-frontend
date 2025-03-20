import React from "react";
import { FaStar } from "react-icons/fa6";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Stores = () => {
  const [StoresData, setStoresData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/store/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStoresData(data);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      });
  }, []);

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Our Stores
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Explore Our Stores
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            All our stores are well equipped with the latest products and clothing...
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-5">
            {/* card section */}
            {StoresData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.storeNo}
                key={data._id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[220px] w-[300px] object-cover rounded-md"
                />
                <div className="text-center">
                  <h2 className="font-semibold text-2xl">{data.name}</h2>
                  
                </div>
                <div className="flex justify-center">
                  <button className="text-center cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
                  <Link to={`/store/${data._id}`}>
                    View Store
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;
