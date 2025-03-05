import React, { useState, useEffect } from "react";
import "./Login.css";
import img from "../../assets/img/umclogo.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loginType, setLoginType] = useState("superadmin");
  const [userData, setData] = useState({
    username: "",
    password: "",
    department: "Admin",
  });
  const [isClicked, setIsClicked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";
    if (loginType === "admin" && !userData.department)
      newErrors.department = "Department is required";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsClicked(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const endpoint = "/login";
      const response = await api.post(endpoint, userData);
      localStorage.setItem("authToken", response.data.uniqueId);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      onLogin();
      navigate("/home");
    } catch (err) {
      console.error("Error fetching user data");
    }
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <img src={img} alt="Logo" className="mb-4" />
            <div className="button-container mb-4 d-flex justify-content-center">
              <button
                className={`btn btn-sm mx-1 ${loginType === "superadmin"
                  ? "btn-superadmin"
                  : "btn-guest"
                  }`}
              >
                Admin Login
              </button>
            </div>
            <form>
              {loginType === "admin" && (
                <div className="mb-3 text-start">
                  <label className="mb-2 label1">Department</label>
                  <select
                    className="form-control form-control1"
                    name="department"
                    value={userData.department}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.map((department) => (
                      <option
                        value={department.department_name}
                        key={department.id}
                      >
                        {department.department_name}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <div className="text-danger">{errors.department}</div>
                  )}
                </div>
              )}
              <div className="mb-3 text-start">
                <label className="mb-2 label1">Username</label>
                <input
                  type="text"
                  className="form-control form-control1"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
              <div className="mb-3 text-start">
                <label className="mb-2 label1">Password</label>
                <input
                  type="password"
                  className="form-control form-control1"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
              <div className="d-flex justify-content-between mb-4">
                <div></div>
                <Link to="#" className="a1 text-decoration-none">
                  Forget your Password?
                </Link>
              </div>
              <div className="button-container">
                <button
                  onClick={onSubmit}
                  className={`btn ${isClicked ? "btn-clicked" : "btn1"}`}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
