import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ViewDetails from "./components/viewDetails/viewDetails";
import Login from "./components/login/login";
import EmployeeList from "./components/employeeList/employeeList";
import Layout from "./layout";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import ResetPassword from "./components/resetPassword/resetPassword";
import Cookies from "js-cookie";

const AppRoutes = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token && !["/reset-password", "/forgot-password"].includes(location.pathname)) {
      navigate("/login");
    }
  }, [token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <Layout>
            <EmployeeList />
          </Layout>
        }
      />
      <Route
        path="/home/viewDetails"
        element={
          <Layout>
            <ViewDetails />
          </Layout>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password"
        element={
          token ? (
            <Layout>
              <ResetPassword/>
            </Layout>
          ) : (
            <ResetPassword/>
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
