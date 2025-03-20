import React, { useContext, useState } from "react";
import LightButton from "../../assets/website/light-mode-button.png";
import DarkButton from "../../assets/website/dark-mode-button.png";
import Login from "../Popup/Login";
// import { AuthContext } from "../../helper/AuthContext";
import Swal from 'sweetalert2';
const DarkMode = () => {
  // const {authState} = useContext(AuthContext)
 
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const element = document.documentElement; // html element

  React.useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Toggle modal function
  




  return (
    <div className="relative flex items-center">
      {/* Light Mode Button */}
      <img
        src={LightButton}
        alt="Light Mode"
        onClick={() => setTheme("dark")}
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-opacity duration-300 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Dark Mode Button */}
      <img
        src={DarkButton}
        alt="Dark Mode"
        onClick={() => setTheme("light")}
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-opacity duration-300 ${
          theme === "light" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Login Button */}
      

      
    </div>
  );
};

export default DarkMode;
