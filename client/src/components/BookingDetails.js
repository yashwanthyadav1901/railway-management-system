import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8001/booking/booking-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (error) {
        alert("Fetching booking details failed");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Booking Details</h2>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Train ID</th>
              <th>Number of Seats</th>
              <th>Total Fare</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user_id}</td>
                <td>{booking.train_id}</td>
                <td>{booking.num_seats}</td>
                <td>{booking.total_fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingDetails;
