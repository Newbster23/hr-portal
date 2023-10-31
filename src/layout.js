import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';
import Header from "./components/header/header";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    } else {
      // Decode the token to extract its expiration time
      const decodedToken = jwtDecode(token);

      // Get the current time in seconds since the Unix epoch
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        Cookies.remove('token');
        navigate("/login");
      }
    }
  });

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
