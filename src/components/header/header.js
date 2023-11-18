import React from "react";
import "./header.css";
import { axiosAPI } from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import logout from "../../images/logout.png";
import resetPassword from "../../images/reset-password.png";
import { useUser } from "../../userContext";

const Header = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

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

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <div className="header-right">
        <Link to="/reset-password" className="item-link">
          <img src={resetPassword} alt="reset-password" /> Reset Password
        </Link>
        <Link onClick={handleLogout} className="item-link">
          <img src={logout} alt="logout" /> Logout
        </Link>
      </div>
    </header>
  );
};

export default Header;
