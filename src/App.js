import React from "react";
import "./App.css";
import AppRoutes from "./route";
import { UserProvider } from "./userContext";

function App() {
  return (
    <UserProvider>
      <AppRoutes></AppRoutes>
    </UserProvider>
  );
}

export default App;
