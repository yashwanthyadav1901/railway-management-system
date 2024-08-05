import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8001/auth/validate-api-key",
        { apiKey },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.valid) {
        localStorage.setItem("adminApiKey", apiKey);
        navigate("/");
      } else {
        alert("Invalid API key");
      }
    } catch (error) {
      alert("Validation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter API Key</h2>
      <input
        type="text"
        name="apiKey"
        placeholder="API Key"
        value={apiKey}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ApiKey;
