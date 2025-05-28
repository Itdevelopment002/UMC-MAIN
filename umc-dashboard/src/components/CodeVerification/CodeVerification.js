import React, { useState, useRef, useEffect } from "react";
import "./CodeVerification.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/img/umclogo.png";
import api from "../api";
import CryptoJS from "crypto-js";
 
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "your-secret-key-here";
 
const CustomCodeVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
 
  // Encrypt data function
  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };
 
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
 
  useEffect(() => {
    if (failedAttempts >= 3) {
      setIsBlocked(true);
      const unblockTime = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("otp_blocked_until", unblockTime);
    }
  }, [failedAttempts]);
 
  useEffect(() => {
    const blockedUntil = localStorage.getItem("otp_blocked_until");
    if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
      setIsBlocked(true);
      const timeout = setTimeout(() => {
        setIsBlocked(false);
        setFailedAttempts(0);
        localStorage.removeItem("otp_blocked_until");
      }, parseInt(blockedUntil) - Date.now());
      return () => clearTimeout(timeout);
    }
  }, []);
 
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value) && !isBlocked) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
 
      if (message.type === "error") {
        setMessage({ text: "", type: "" });
      }
 
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
 
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !isBlocked) {
      const newCode = [...code];
 
      if (!newCode[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
 
      newCode[index] = "";
      setCode(newCode);
 
      if (message.type === "error") {
        setMessage({ text: "", type: "" });
      }
    }
  };
 
  const handleSubmit = async () => {
    const otp = code.join("");
 
    if (otp.length !== 4) {
      setMessage({ text: "Please enter a 4-digit OTP", type: "error" });
      return;
    }
 
    try {
      const encryptedData = encryptData({ otp, email });
      const response = await api.post("/verify-otp", { data: encryptedData });
 
      if (response.data.message === "OTP verified successfully") {
        setMessage({ text: "OTP verified successfully!", type: "success" });
        const { userId } = response.data;
        setTimeout(() => navigate("/change-password", { state: { userId } }), 2000);
      }
    } catch (err) {
      setFailedAttempts((prev) => prev + 1);
      setMessage({
        text: err.response?.data?.message || "Invalid OTP",
        type: "error"
      });
      setCode(["", "", "", ""]);
      inputRefs.current[0].focus();
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
    } catch {
      setMessage({ text: "Failed to resend OTP. Please try again.", type: "error" });
    }
  };
 
  const handleCancel = async () => {
    const encryptedData = encryptData({ email });
    try {
      const response = await api.post("/delete-otp", { data: { data: encryptedData } });
      if (response.data.message === "OTP data deleted successfully") {
        navigate("/");
      }
    } catch {
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
                  disabled={isBlocked}
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
                <button onClick={handleResendOTP} disabled={isBlocked} className="btn resend-btn">
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