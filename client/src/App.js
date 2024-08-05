import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AddTrain from "./components/AddTrain";
import SeatAvailability from "./components/SeatAvailability";
import BookSeat from "./components/BookSeat";
import BookingDetails from "./components/BookingDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import ApiKey from "./components/ApiKey";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-train"
        element={
          <ProtectedRoute adminOnly={true}>
            <AddTrain />
          </ProtectedRoute>
        }
      />
      <Route path="/apikey" element={<ApiKey />} />
      <Route
        path="/seat-availability"
        element={
          <ProtectedRoute>
            <SeatAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-seat"
        element={
          <ProtectedRoute>
            <BookSeat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-details"
        element={
          <ProtectedRoute>
            <BookingDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
