import React, { useState, useRef, useEffect } from "react";
import "./CodeVerification.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/img/umclogo.png";
import api from "../api";

const CustomCodeVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [message, setMessage] = useState({ text: "", type: "" });  // Message state
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Clear message on typing
      if (message.type === "error") {
        setMessage({ text: "", type: "" });
      }

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newCode = [...code];

      if (!newCode[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }

      newCode[index] = "";
      setCode(newCode);

      // Clear message on backspace
      if (message.type === "error") {
        setMessage({ text: "", type: "" });
      }
    }
  };

  const handleSubmit = async () => {
    const otp = code.join("");

    try {
      const response = await api.post("/verify-otp", { otp, email });

      if (response.data.message === "OTP verified successfully") {
        setMessage({ text: "OTP verified successfully!", type: "success" });

        const { userId } = response.data;
        setTimeout(() => navigate("/change-password", { state: { userId } }), 2000);
      }
    } catch (err) {
      if (err.response) {
        setMessage({ text: err.response.data.message || "Invalid OTP", type: "error" });
      } else {
        setMessage({ text: "Network error. Please try again.", type: "error" });
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post("/resend-otp", { email });

      if (response.data.message === "OTP resent successfully") {
        setTimer(60);
        setIsResendDisabled(true);
        setMessage({ text: "OTP resent successfully!", type: "success" });
      }
    } catch (err) {
      setMessage({ text: "Failed to resend OTP. Please try again.", type: "error" });
    }
  };

  const handleCancel = async () => {
    try {
      const response = await api.delete("/delete-otp", { data: { email } });

      if (response.data.message === "OTP data deleted successfully") {
        navigate("/"); 
      }
    } catch (err) {
      console.error("Error deleting OTP data:", err);
      setMessage({ text: "Failed to cancel. Please try again.", type: "error" });
    }
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <img src={logo} alt="Logo" className="mb-4" />
            <h4 className="text-center">Enter verification code</h4>
            <p className="text-center text-muted">We've sent a code to {email}</p>

            {/* Message display */}
            {message.text && (
              <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"}`}>
                {message.text}
              </div>
            )}

            <div className="custom-code-inputs">
              {code.map((num, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="custom-code-box"
                  value={num}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            <p className="custom-resend-text text-center">
              {isResendDisabled ? (
                `Resend OTP in ${timer} seconds`
              ) : (
                <button onClick={handleResendOTP} className="btn resend-btn">
                  Click to resend.
                </button>
              )}
            </p>

            <hr className="mt-4" />

            <div className="custom-button-container12">
              <button onClick={handleCancel} className="custom-btn12 custom-cancel12">
                Cancel
              </button>
              <button className="custom-btn12 custom-verify12" onClick={handleSubmit}>
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCodeVerification;
