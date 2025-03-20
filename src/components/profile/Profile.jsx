import axios from "axios";
import React, { useEffect, useState } from "react";
import { decodeJwt } from "jose"; 
const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Retrieve the token from localStorage
        const storedToken = localStorage.getItem("authtoken");
        if (!storedToken) {
          throw new Error("Authentication token not found.");
        }

        // Decode the token to extract user ID (if you have a decodeJwt function)
        const decodedToken = decodeJwt(storedToken); // Ensure `decodeJwt` is implemented
        const userId = decodedToken._id;

        // Make API call to get user details
        const response = await axios.get(`http://localhost:8080/api/user/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`, // Include token in headers
          },
        });

        // Set user data and stop loading
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
      <img 
        src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
        alt="Profile" 
        style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "20px" }}
      />
      <h2>{user.username}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Joined:</strong> {new Date(user.date).toLocaleDateString()}</p>
    </div>
  );
};

export default Profile;
