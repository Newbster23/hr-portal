import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { axiosAPI } from "../../axios";
import "./resetPassword.css";
import back from "../../images/back.png";
import { useUser } from "../../userContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axiosAPI.post("api/logout");

      if (response.data.status === 200) {
        setUser(null);
        navigate("/login");
      } else {
        console.log("An error occurred during logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      console.log("An error occurred during logout");
    }
  };

  const handleChangePassword = async (username) => {
    try {
      const response = await axiosAPI.post("/api/change-password", {
        newPassword: confirmPassword,
        username: username,
      });

      if (response.data.status === 200) {
        setMessage("Password has been changed");
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else if (response.data.status === 404) {
        setMessage("User not found!");
      } else {
        setMessage("An error occured. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occured. Please try again!");
    }
  };

  const handleResetPassword = async (email, expirationTime) => {
    try {
      // Send a request to your server to initiate the password reset.
      const response = await axiosAPI.post("/api/reset-password", {
        newPassword: confirmPassword,
        email: email,
        expirationTime: expirationTime,
      });

      if (response.data.status === 200) {
        // Display a success message or instruct the user to check their email.
        setMessage("Password has been changed");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.data.status === 404) {
        setMessage("User with entered email id not found!");
      } else if (response.data.status === 410) {
        setMessage(response.data.message);
      } else {
        setMessage("An error occured. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occured. Please try again!");
    }
  };

  const ValidateResetPassword = async () => {
    // Regular expressions for password validation
    const passwordLengthRegex = /^.{10,}$/; // At least 10 characters
    const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
    const specialCharacterRegex = /[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./]/; // At least one special character
    const numberRegex = /\d/; // At least one number

    if (password.trim() === "" || confirmPassword.trim() === "") {
      setMessage("Password and confirm password cannot be empty");
      return;
    }

    if (!passwordLengthRegex.test(password.trim())) {
      setMessage("Password must be at least 10 characters long.");
      return;
    } else if (!uppercaseRegex.test(password.trim())) {
      setMessage("Password must contain at least one uppercase letter.");
      return;
    } else if (!specialCharacterRegex.test(password.trim())) {
      setMessage("Password must contain at least one special character.");
      return;
    } else if (!numberRegex.test(password.trim())) {
      setMessage("Password must contain at least number.");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setMessage("Password and confirm password do not match");
      return;
    }

    if (loggedIn) {
      const username = user.username;
      handleChangePassword(username);
    } else {
      const currentURL = window.location.href;
      const url = new URL(currentURL);
      const email = url.searchParams.get("user");
      const expirationTime = url.searchParams.get("expires");
      handleResetPassword(email, expirationTime);
    }
  };

  const goBack = () => {
    // Go back to the previous page when the "Back" link is clicked
    navigate(-1);
  };

  return (
    <div>
      {loggedIn ? (
        <div className="back-link" onClick={goBack}>
          <img className="back-icon" src={back} alt="Back" />
          Back
        </div>
      ) : null}
      <div className="container">
        <div className="resetPassword">
          <h3>Password Reset</h3>
          <p>Enter the new password</p>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            onClick={() => {
              ValidateResetPassword();
            }}
          >
            Save
          </button>
          <br />
          <br />
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
