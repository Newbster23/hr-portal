import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { axiosAPI } from "../../axios";
import loginBackground from "../../images/backgroung-login.jpg";
import "./login.css";
import { useUser } from "../../userContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const validateLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      if (username.trim() === "") {
        setUsernameError("Username is required");
      } else {
        setUsernameError("");
      }

      if (password.trim() === "") {
        setPasswordError("Password is required");
      } else {
        setPasswordError("");
      }
      return;
    }

    try {
      const response = await axiosAPI.post("api/login", {
        username: username,
        password: password,
      });

      if (response.data.status === 200) {
        setLoginError("");
        setUser({
          username: response.data.data.username,
          email: response.data.data.email,
        });
        navigate("/home");
      } else if (response.data.status === 401) {
        setLoginError(response.data.message); // Set the login error message
      } else {
        setLoginError("An error occurred during login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("An error occurred during login"); // Set the error message
    }
  };

  const usernameErrorInput = usernameError ? "errorInput" : "";
  const passwordErrorInput = passwordError ? "errorInput" : "";

  const clearUsernameError = () => {
    setUsernameError("");
    setLoginError(null); // Clear login error message
  };

  const clearPasswordError = () => {
    setPasswordError("");
    setLoginError(null); // Clear login error message
  };

  return (
    <div className="loginContainer">
      <div className="background">
        <img src={loginBackground} alt="Background" />
      </div>
      <div className="formContainer">
        <div className="loginForm">
          <h2>HR Portal</h2>
          <br />
          <br />
          <form>
            <label name="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onInput={clearUsernameError}
              required
              className={usernameErrorInput}
            />
            {usernameError && <p className="error-text">{usernameError}</p>}
            <br />
            <label name="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onInput={clearPasswordError}
              required
              className={passwordErrorInput}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
            <a onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
            <br />
            {loginError && <p className="error-text">{loginError}</p>}
            <button type="button" onClick={validateLogin}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
