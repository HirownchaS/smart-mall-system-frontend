import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { SiShopware } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.jpg";
import Swal from "sweetalert2";
import { decodeJwt } from "jose"; // Assuming you are using `jose` library for JWT decoding
import Login from "../Popup/Login";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Stores",
    link: "/store",
  },
  {
    id: 3,
    name: "Combo Packs",
    link: "/combo",
  },
  {
    id: 4,
    name: "Events",
    link: "/events",
  }
  
];

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown visibility
  const [user, setUserData] = useState(null); // To store user data
  const [userId, setUserId] = useState(null); // To store user id
  const [modal, setModal] = useState(false);
  const navigate = useNavigate()
  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authtoken");
    if (storedToken) {
      setToken(storedToken); // Save the token in state
      try {
        const decodedToken = decodeJwt(storedToken); // Decode the JWT payload
        setUserId(decodedToken._id); // Assuming the token has an `_id` field for user ID
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch user data after `userId` is set
  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  // Fetch user data
  const fetchUserData = async (userId) => {
    try {
      console.log(userId);
      const response = await fetch(
        `http://localhost:8080/api/user/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setUserData(data); // Set user data here
    } catch (error) {
      console.error("Error fetching user data", error);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch user data.",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("id");
    setToken(null);
    setUserData(null);
    Swal.fire({
      icon: "success",
      title: "Logged out successfully.",
      showConfirmButton: true,
    });
    navigate('/')
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <SiShopware />
              Mall360
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt="user-avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">
                    {user?.username || "User"}
                  </span>
                  <FaCaretDown />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 dark:bg-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
        onClick={toggleModal}
        className="ml-4 p-1 bg-primary text-white rounded"
      >
        Login
      </button>
            )}

            {modal && <Login setModal={setModal} modal={modal} />}
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div data-aos="zoom-in" className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
                {data.name}
              </Link>
            </li>
          ))}

          {/* Conditionally render Parking and Combo Packs links if token is available */}
          {token && (
            <>
              <li>
                <Link
                  to="/bookings"
                  className="inline-block px-4 hover:text-primary duration-200"
                >
                  My Tickets
                </Link>
              </li>
              <li>
                <Link
                  to="/parking"
                  className="inline-block px-4 hover:text-primary duration-200"
                >
                  Parking
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
