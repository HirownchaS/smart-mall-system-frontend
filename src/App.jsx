import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Store from "./pages/Store";
import StoreDetail from "./pages/StoreDetail";
import ParkingTickets from "./pages/ParkingTickets";
import BookingQR from "./components/Parking/BookingQR";
import Parking from "./pages/Parking";
import { AuthContext } from './helper/AuthContext'
import axios from "axios";
import ComboPack from "./components/ComboPack/ComboPack";

import Event from "./components/Event/Events"
import Profile  from "./components/profile/Profile";


const App = () => {
  const [authState, setAuthState] = useState("");
  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      axios
        .get('http://localhost:8080/api/user/auth', {
          headers: {
            Authorization: `Bearer ${token}` // Correctly setting the token in the Authorization header
          },
        })
        .then((res) => {
          if (res.data.error) {
            setAuthState("");
            
          } else {
            console.log("userData? " + res.data);
            setAuthState(token);
            localStorage.setItem('id',res.data._id);
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/store" element={<Store/>} />
          <Route path="/store/:id" element={<StoreDetail/>} />
          <Route path="/combo" element={<ComboPack/>} />
          <Route path="/bookings" element={<ParkingTickets/>}/>
          <Route path="/events" element={<Event />}/>
          <Route path="/profile" element={<Profile/>}/>
          
         
        </Routes>
        <div className="bottom-0">
        <Footer/>
        </div>
      </div>
    </Router>
    </AuthContext.Provider>
  );
};

export default App;