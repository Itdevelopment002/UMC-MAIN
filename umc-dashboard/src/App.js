import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import "./assets/css/bootstrap-datetimepicker.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/dataTables.bootstrap4.min.css";
import "./assets/css/font-awesome.min.css";
import "./assets/css/fullcalendar.min.css";
import "./assets/css/select2.min.css";
import "./assets/css/tagsinput.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Spinner from "./components/Spinner/Spinner";
import Login from "./components/Login/Login";
import SuperAdminRoutes from "./components/SuperAdminRoutes/SuperAdminRoutes";
import AdminRoutes from "./components/AdminRoutes/AdminRoutes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken") 
  );
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) {
      setDepartment(savedUser.department);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setLoading(true); 
    setIsAuthenticated(true);
    setTimeout(() => {
      setLoading(false); 
    }, 1000); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setDepartment(null);
    setIsAuthenticated(false);
  };

  const renderRoutes = () => {
    if (!department) {
      return <Navigate to="/" />;
    }
    if (department === "Admin") {
      return <SuperAdminRoutes department={department} onLogout={handleLogout} />;
    } else {
      return <AdminRoutes department={department} />;
    }
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <>
          {loading ? ( // Show spinner if loading
            <Spinner />
          ) : (
            <>
              <Header onLogout={handleLogout} userDepartment={department} />
              <div>
                <Sidebar userDepartment={department} />
                <div>{renderRoutes()}</div>
              </div>
            </>
          )}
        </>
      )}
    </Router>
  );
}

export default App;