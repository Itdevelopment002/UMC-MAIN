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
  const [loading, setLoading] = useState(false);  // Loader state

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

    setLoading(true);  // Start loader

    try {
      const response = await api.post("/reset-password", userData);
      if (response.data.message === "OTP sent successfully") {
        navigate("/reset-password-verification", { state: { email: userData.email } });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setServerError("Invalid email, Please write a valid email.");
        } else {
          setServerError("Server error. Please try again later.");
        }
      } else {
        setServerError("Network error. Check your connection.");
      }
    } finally {
      setLoading(false);  // Stop loader
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
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <hr className="mt-4" />

              <div className="custom-button-container12">
                <button
                  onClick={() => navigate("/")}
                  className="custom-btn12 custom-cancel12"
                  disabled={loading} 
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="custom-btn12 custom-verify12"
                  disabled={loading} 
                >
                  {loading ? "Sending OTP..." : "Confirm"}  
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
