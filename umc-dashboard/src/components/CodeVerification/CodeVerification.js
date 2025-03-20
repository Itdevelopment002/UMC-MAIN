import React, { useState, useRef } from "react";
import "./CodeVerification.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/umclogo.png";

const CustomCodeVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

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
    }
  };

  const handleSubmit = () => {
    alert("Code submitted: " + code.join(""));
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            <img src={logo} alt="Logo" className="mb-4" />
            <h4 className="text-center">Enter verification code</h4>
            <p className="text-center text-muted">We've sent a code to hello@alignui.com</p>
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
              Didn't get a code? <Link to="/">Click to resend.</Link>
            </p>
            <hr className="mt-4" />
            <div className="custom-button-container12">
              <button onClick={() => navigate("/")} className="custom-btn12 custom-cancel12">
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
