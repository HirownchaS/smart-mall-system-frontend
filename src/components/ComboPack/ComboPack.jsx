import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Paypal from "./Paypal";
import Swal from "sweetalert2";
import { AuthContext } from '../../helper/AuthContext'; // Use AuthContext to check login state
import Login from '../Popup/Login'; // Import the Login component (modal)

const ComboPackList = () => {
  const [comboPacks, setComboPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComboPackId, setSelectedComboPackId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control the login modal visibility

  const { authState } = useContext(AuthContext); // Access login state
  
  useEffect(() => {
    const fetchComboPacks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/combopack/getcombopacks");
        setComboPacks(response.data);
      } catch (err) {
        setError("Error fetching combo packs");
      } finally {
        setLoading(false);
      }
    };

    fetchComboPacks();
  }, []);

  const handleGetOffer = async (comboPackId) => {
    if (!authState) { // Check if the user is logged in
      setShowLoginModal(true); // Show login modal if not logged in
    } else {
      // Show SweetAlert for payment confirmation
      const result = await Swal.fire({
        title: "Confirm Payment",
        text: "Do you want to proceed with the payment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setSelectedComboPackId(comboPackId); // Set selected combo pack ID
      }
    }
  };

  const handlePaymentComplete = () => {
    // Handle what happens after payment completion
    setSelectedComboPackId(null);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4 m-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comboPacks.map((comboPack) => (
          <div
            key={comboPack._id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 hover:shadow-xl p-6 min-h-[400px] flex flex-col"
          >
            <img
              src="https://www.shutterstock.com/image-vector/combo-offer-banner-design-template-600nw-2185310071.jpg"
              alt="Combo Pack"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3 text-center">
              {comboPack.comboPackName}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 text-center">
              Price:{" "}
              <span className="text-red-500 font-semibold">
                ${comboPack.price}
              </span>
            </p>
            <div className="mt-2 flex-grow">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center">
                Stores:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comboPack.stores.map((store) => (
                  <div
                    key={store.store._id}
                    className="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm transition-transform transform hover:scale-105"
                  >
                    <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
                      {store.store.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Level:{" "}
                      <span className="font-semibold">{store.level}</span>,
                      <span className="text-blue-500 font-medium">
                        ${store.pricePerStore}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              {selectedComboPackId === comboPack._id ? (
                <Paypal
                  description={comboPack.comboPackName}
                  price={comboPack.price}
                  comboPackDetails={comboPack} // Pass the entire comboPack object or necessary details
                  onPaymentComplete={handlePaymentComplete}
                />
              ) : (
                <button
                  onClick={() => handleGetOffer(comboPack._id)} // Pass the combo pack ID
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                >
                  Get Offer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showLoginModal && (
        <Login modal={showLoginModal} setModal={setShowLoginModal} /> // Display login modal
      )}
    </div>
  );
};

export default ComboPackList;
