import React, { useState } from "react";
import axios from "axios";

const AddTrain = () => {
  const [form, setForm] = useState({
    name: "",
    source: "",
    destination: "",
    available_seats: 0,
    fare: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8001/train", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Train added successfully");
    } catch (error) {
      alert("Adding train failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Train</h2>
      <input
        type="text"
        name="name"
        placeholder="Train Name"
        value={form.name}
        onChange={handleChange}
      />
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
      <input
        type="number"
        name="available_seats"
        placeholder="Available Seats"
        value={form.available_seats}
        onChange={handleChange}
      />
      <input
        type="number"
        name="fare"
        placeholder="Fare"
        value={form.fare}
        onChange={handleChange}
      />
      <button type="submit">Add Train</button>
    </form>
  );
};

export default AddTrain;
