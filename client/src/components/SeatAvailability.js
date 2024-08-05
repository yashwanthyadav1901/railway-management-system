import React, { useState } from "react";
import axios from "axios";

const SeatAvailability = () => {
  const [form, setForm] = useState({ source: "", destination: "" });
  const [trains, setTrains] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:8001/train//train/:id",
        {
          params: { source: form.source, destination: form.destination },
        }
      );
      setTrains(response.data);
    } catch (error) {
      alert("Fetching seat availability failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Seat Availability</h2>
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={form.source}
          onChange={handleChange}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
        />
        <button type="submit">Check Availability</button>
      </form>
      <div>
        {trains.length > 0 && (
          <ul>
            {trains.map((train) => (
              <li key={train.id}>
                {train.name} - {train.available_seats} seats available
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeatAvailability;
