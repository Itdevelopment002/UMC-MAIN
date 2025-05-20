import React, { useState, useEffect } from "react";
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
  //eslint-disable-next-line
  const [serverError, setServerError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  useEffect(() => {
    let timer;
    if (retryAfter > 0) {
      timer = setTimeout(() => {
        setRetryAfter(retryAfter - 1);
      }, 1000);
    } else if (retryAfter === 0) {
      // Reset attempts when timer expires
      setAttemptsRemaining(3);
      setRetryAfter(null);
    }
    return () => clearTimeout(timer);
  }, [retryAfter]);

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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/reset-password", userData);
      if (response.data.message === "OTP sent successfully") {
        setAttemptsRemaining(prev => prev - 1);
        navigate("/reset-password-verification", {
          state: {
            email: userData.email,
            attemptsRemaining: attemptsRemaining - 1
          }
        });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          navigate("/reset-password-verification", {
            state: {
              email: userData.email,
              attemptsRemaining: attemptsRemaining - 1
            }
          });
        } else if (err.response.status === 429) {
          const retryAfterSeconds = parseInt(err.response.headers['retry-after']) || 1800;
          setRetryAfter(retryAfterSeconds);
          setAttemptsRemaining(0);
          setServerError(`You've exceeded OTP attempts. Please try again after ${formatTime(retryAfterSeconds)}.`);
          setInfoMessage("");
        } else {
          setServerError("Server error. Please try again later.");
          setInfoMessage("");
        }
      } else {
        setServerError("Network error. Check your connection.");
        setInfoMessage("");
      }

    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <img src={img} alt="Logo" className="mb-4" />
            <h4 className="text-center">Reset Password</h4>
            <p className="text-center text-muted">Enter email for verification code.</p>

            {/* {serverError && <div className="alert alert-danger">{serverError}</div>} */}
            {infoMessage && <p className="text-info">{infoMessage}</p>}


            <form onSubmit={onSubmit} className="mt-4">
              <div className="mb-3 text-start">
                <label className="mb-2 fw-bold">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control form-control1 ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  disabled={retryAfter > 0}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                {attemptsRemaining > 0 && retryAfter === null && (
                  <small className="text-muted d-block mt-1">
                    Attempts remaining: {attemptsRemaining}
                  </small>
                )}
              </div>

              <hr className="mt-4" />

              <div className="custom-button-container12">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="custom-btn12 custom-cancel12"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="custom-btn12 custom-verify12"
                  disabled={loading || retryAfter > 0}
                >
                  {loading ? "Sending OTP..." :
                    retryAfter > 0 ? `Try again in ${formatTime(retryAfter)}` : "Confirm"}
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