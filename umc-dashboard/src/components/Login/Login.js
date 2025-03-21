import React, { useState } from "react";
import "./Login.css";
import img from "../../assets/img/umclogo.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userData, setData] = useState({
    username: "",
    password: "",
  });
  const [isClicked, setIsClicked] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsClicked(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsClicked(false);
      return;
    }

    try {
      const response = await api.post("/login", userData);
      localStorage.setItem("authToken", response.data.uniqueId);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      const { role } = response.data.user;
      onLogin();
      if (role === "Superadmin") {
        navigate("/home");
      } else {
        navigate("/department-information");
      }
    } catch (err) {
      setIsClicked(false);
      if (err.response) {
        if (err.response.status === 403) {
          setServerError("User is temporarily disabled");
        } else if (err.response.status === 401) {
          setServerError("Invalid credentials. Please try again.");
        } else {
          setServerError("Server error. Please try again later.");
        }
      } else {
        setServerError("Network error. Check your connection.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <img src={img} alt="Logo" className="mb-4" />
            <div className="button-container mb-4 d-flex justify-content-center">
              <button className="btn btn-sm mx-1 btn-superadmin">Admin Login</button>
            </div>
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3 text-start">
                <label className="mb-2 label1">
                  Username or email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control1"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                />
                {errors.username && <small className="text-danger">{errors.username}</small>}
              </div>
              <div className="mb-3 text-start position-relative">
                <label className="mb-2 label1">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control1"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>
              <div className="d-flex justify-content-between mb-4">
                <div></div>
                <Link to="/reset-password" className="a1 text-decoration-none">
                  Forget your Password?
                </Link>
              </div>
              <div className="button-container">
                <button type="submit" className={`btn ${isClicked ? "btn-clicked" : "btn1"}`}>
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