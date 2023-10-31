import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAPI } from "../../axios";
import back from "../../images/back.png";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetRequest = async () => {
    if (email.trim() === "") {
      setMessage("Email cannot be empty");
      return;
    }
    try {
      // Send a request to your server to initiate the password reset.
      const response = await axiosAPI.post("/api/forgot-password", {
        email: email,
      });

      if (response.data.status === 200) {
        // Display a success message or instruct the user to check their email.
        setMessage("Password reset email sent. Please check your email.");
      } else if (response.data.status === 404) {
        // Handle errors, e.g., email not found.
        setMessage("User with entered email id not found!");
      } else {
        setMessage("An error occured. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occured. Please try again!");
    }
  };

  const goBack = () => {
    // Go back to the previous page when the "Back" link is clicked
    navigate(-1);
  };

  return (
    <div>
      <div className="back-link" onClick={goBack}>
        <img className="back-icon" src={back} alt="Back" />
        Back
      </div>

      <div className="container">
        <div className="forgotPassword">
          <h3>Forgot Password?</h3>
          <p>
            We are here to help you, Please enter the email id to get reset
            link.
          </p>
          <input
            type="email"
            placeholder="Email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleResetRequest}>Reset Password</button>
          <br />
          <br />
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
