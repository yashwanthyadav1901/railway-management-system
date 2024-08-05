import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BookSeat = () => {
  const [form, setForm] = useState({ train_id: "", num_seats: 1 });
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get("http://localhost:8001/train");
        setTrains(response.data);
      } catch (error) {
        console.error("Error fetching trains:", error);
      }
    };
    fetchTrains();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const user_id = decoded.UserInfo.id;

      const bookingData = {
        ...form,
        user_id,
      };

      await axios.post("http://localhost:8001/booking", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Seat booked successfully");
    } catch (error) {
      alert("Booking seat failed");
      console.error("Error:", error);
    }
  };

  const handleSelectTrain = (train_id) => {
    setForm({ ...form, train_id });
  };

  return (
    <div>
      <h2>Book Seat</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number of Seats:
          <input
            type="number"
            name="num_seats"
            placeholder="Number of Seats"
            value={form.num_seats}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Book Seat</button>
      </form>
      <h2>Available Trains</h2>
      <table>
        <thead>
          <tr>
            <th>Train ID</th>
            <th>Train Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Available Seats</th>
            <th>Fare</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.id}>
              <td>{train.id}</td>
              <td>{train.name}</td>
              <td>{train.source}</td>
              <td>{train.destination}</td>
              <td>{train.available_seats}</td>
              <td>{train.fare}</td>
              <td>
                <button onClick={() => handleSelectTrain(train.id)}>
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookSeat;
