import React, { useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Sign-up form submitted : ", formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} placeholder="Enter username" required />
          <br />
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} placeholder="Enter Email" required />
          <br />
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} placeholder="Enter password" required />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
