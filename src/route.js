import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ViewDetails from "./components/viewDetails/viewDetails";
import Login from "./components/login/login";
import EmployeeList from "./components/employeeList/employeeList";
import Layout from "./layout";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import ResetPassword from "./components/resetPassword/resetPassword";
import PageNotFound from "./components/pageNotFound/pageNotFound";


const AppRoutes = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token && location.pathname === "/") {
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
              <ResetPassword />
            </Layout>
          ) : (
            <ResetPassword />
          )
        }
      />
       <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
