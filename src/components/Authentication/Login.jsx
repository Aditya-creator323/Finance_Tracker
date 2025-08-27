import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call to log in the user
    console.log("Login form submitted", formData);
    // Add your logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} placeholder="Enter username" required />
          <br />
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} placeholder="Enter password" required />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
