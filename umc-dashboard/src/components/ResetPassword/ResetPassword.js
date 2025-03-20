import React, { useState } from "react";
import "./ResetPassword.css";
import img from "../../assets/img/umclogo.png";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ResetPassword = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userData, setData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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
    if (!userData.email) newErrors.email = "Email Address is required";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
            <h4 className="text-center">Reset Password</h4>
            <p className="text-center text-muted">Enter email for verification code.</p>
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            <form onSubmit={onSubmit} className="mt-4">
              <div className="mb-3 text-start">
                <label className="mb-2 fw-bold">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control form-control1"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <hr className="mt-4" />
              <div className="custom-button-container12">
                <button onClick={()=> {navigate("/")}} className="custom-btn12 custom-cancel12">
                  Cancel
                </button>
                <button type="submit" className="custom-btn12 custom-verify12">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
