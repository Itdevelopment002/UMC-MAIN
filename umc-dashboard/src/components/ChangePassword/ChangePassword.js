import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import './ChangePassword.css';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handlePasswordChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value);
    if (setter === setNewPassword) {
      validatePassword(value);
    }
    if (message.type === "error") {
      setMessage({ text: "", type: "" });
    }
  };

  // Common passwords list (in a real app, this should be more extensive)
  const commonPasswords = [
    'password', '123456', '12345678', '1234', 'qwerty',
    'letmein', 'admin', 'welcome', 'password1', '12345'
  ];

  const validatePassword = (password) => {
    const errors = [];
    // Minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    // Uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    // Lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    // Number
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    // Special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    // Common password check
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common or easily guessable");
    }
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    // Validate password strength
    if (!validatePassword(newPassword)) {
      setMessage({
        text: "Password does not meet requirements.",
        type: "error"
      });
      return;
    }

    try {
      const response = await api.post("/change-password", {
        userId,
        newPassword,
      });

      if (response.data.message === "Password updated successfully") {
        setMessage({
          text: "Password updated successfully. Redirecting to login...",
          type: "success"
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response) {
        setMessage({
          text: err.response.data.message || "Error updating password",
          type: "error"
        });
      } else {
        setMessage({
          text: "Network error. Please try again.",
          type: "error"
        });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <h4 className="text-center mb-4">Change Password</h4>

            {message.text && (
              <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-3 custom-position-relative">
                <label>New Password</label>
                <div className="custom-position-relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control pe-5"
                    value={newPassword}
                    onChange={handlePasswordChange(setNewPassword)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    onClick={toggleNewPasswordVisibility}
                    className="custom-password-icon"
                  />
                </div>
                {passwordErrors.length > 0 && (
                  <div className="password-requirements">
                    <small className="text-muted">Password must:</small>
                    <ul className="password-error-list">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="text-danger">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3 custom-position-relative">
                <label>Confirm Password</label>
                <div className="custom-position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control pe-5"
                    value={confirmPassword}
                    onChange={handlePasswordChange(setConfirmPassword)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    onClick={toggleConfirmPasswordVisibility}
                    className="custom-password-icon"
                  />
                </div>
              </div>
              <div
                className="custom-button-container12"
                style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px", borderRadius: '7px' }}
              >
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;