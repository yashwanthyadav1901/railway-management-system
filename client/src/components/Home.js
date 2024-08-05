import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.UserInfo.roles === "admin";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Railway Management System</h1>
      {!isAdmin && (
        <>
          <button onClick={() => navigate("/seat-availability")}>
            Check Seat Availability
          </button>
          <button onClick={() => navigate("/book-seat")}>Book Seat</button>
          <button onClick={() => navigate("/booking-details")}>
            Booking Details
          </button>
        </>
      )}
      {isAdmin && (
        <>
          <button onClick={() => navigate("/add-train")}>Add Train</button>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
