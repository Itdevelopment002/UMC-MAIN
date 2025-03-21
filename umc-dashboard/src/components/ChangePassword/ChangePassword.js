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
  const [message, setMessage] = useState({ text: "", type: "" }); // Error/Success message
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Clear the error message on typing
  const handlePasswordChange = (setter) => (e) => {
    setter(e.target.value);
    if (message.type === "error") {
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      const response = await api.post("/change-password", { userId, newPassword });

      if (response.data.message === "Password updated successfully") {
        setMessage({ text: "Password updated successfully.", type: "success" });

        setTimeout(() => navigate("/login"), 2000);  // Redirect to login after 2 seconds
      }
    } catch (err) {
      if (err.response) {
        setMessage({ text: err.response.data.message || "Error updating password", type: "error" });
      } else {
        setMessage({ text: "Network error. Please try again.", type: "error" });
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
                style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px", borderRadius:'7px' }}
              >
                <button type="submit" className="btn btn-primary ">
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
