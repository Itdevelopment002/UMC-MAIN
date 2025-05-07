// import React, { useState, useEffect } from "react";
// import "./Login.css";
// import img from "../../assets/img/umclogo.png";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api";
// import { FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
// import CryptoJS from "crypto-js";

// const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "secure-umc-key-123";

// // Function to generate random CAPTCHA code
// const generateCaptcha = () => {
//   const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let captcha = "";
//   for (let i = 0; i < 6; i++) {
//     captcha += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return captcha;
// };

// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();
//   const [userData, setData] = useState({
//     username: "",
//     password: "",
//     captchaInput: ""
//   });
//   const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
//   const [isClicked, setIsClicked] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginAttempts, setLoginAttempts] = useState(() => {
//     const storedAttempts = localStorage.getItem("loginAttempts");
//     return storedAttempts ? JSON.parse(storedAttempts) : {};
//   });
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

//   const encryptData = (data) => {
//     return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
//   };

//   useEffect(() => {
//     const now = Date.now();
//     const blockedUntil = localStorage.getItem("blockedUntil");

//     if (blockedUntil && now < parseInt(blockedUntil)) {
//       setIsBlocked(true);
//       setBlockTimeRemaining(Math.ceil((parseInt(blockedUntil) - now) / 1000 / 60));
//     } else if (blockedUntil) {
//       localStorage.removeItem("blockedUntil");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setData({
//       ...userData,
//       [e.target.name]: e.target.value,
//     });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };

//   const refreshCaptcha = () => {
//     setCaptchaCode(generateCaptcha());
//     setData({ ...userData, captchaInput: "" });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userData.username.trim()) newErrors.username = "Username is required";
//     if (!userData.password) newErrors.password = "Password is required";
    
//     // Enhanced CAPTCHA validation messages
//     if (!userData.captchaInput) {
//       newErrors.captchaInput = "Please fill in the CAPTCHA code";
//     } else if (userData.captchaInput !== captchaCode) {
//       newErrors.captchaInput = "CAPTCHA code does not match. Please try again.";
//     }

//     return newErrors;
//   };

//   const updateFailedAttempts = (username) => {
//     const now = Date.now();
//     const newAttempts = { ...loginAttempts };

//     if (!newAttempts[username]) {
//       newAttempts[username] = { count: 1, lastAttempt: now };
//     } else {
//       if (now - newAttempts[username].lastAttempt > 5 * 60 * 1000) {
//         newAttempts[username] = { count: 1, lastAttempt: now };
//       } else {
//         newAttempts[username].count += 1;
//         newAttempts[username].lastAttempt = now;
//       }
//     }

//     setLoginAttempts(newAttempts);
//     localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

//     if (newAttempts[username].count >= 3) {
//       const blockedUntil = now + 5 * 60 * 1000;
//       localStorage.setItem("blockedUntil", blockedUntil.toString());
//       setIsBlocked(true);
//       setBlockTimeRemaining(5);
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (isBlocked) {
//       setServerError(`Too many failed attempts. Please try again in ${blockTimeRemaining} minutes.`);
//       return;
//     }

//     setIsClicked(true);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setIsClicked(false);
//       return;
//     }

//     try {
//       const encryptedData = encryptData({
//         username: userData.username.trim(),
//         password: userData.password
//       });

//       const response = await api.post("/login", { data: encryptedData }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       setData({ username: "", password: "", captchaInput: "" });
//       setCaptchaCode(generateCaptcha());

//       const newAttempts = { ...loginAttempts };
//       delete newAttempts[userData.username];
//       setLoginAttempts(newAttempts);
//       localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

//       const { uniqueId, user } = response.data;
//       localStorage.setItem("authToken", uniqueId);
//       localStorage.setItem("userData", JSON.stringify({
//         id: user.id,
//         role: user.role,
//         permission: user.permission
//       }));

//       onLogin();

//       if (user.role === "Superadmin") {
//         navigate("/home");
//       } else {
//         navigate("/department-information");
//       }
//     } catch (err) {
//       setIsClicked(false);
//       refreshCaptcha();
//       updateFailedAttempts(userData.username);

//       if (err.response) {
//         if (err.response.status === 403) {
//           setServerError("Account temporarily disabled. Contact support.");
//         } else if (err.response.status === 401) {
//           setServerError("Invalid credentials. Please try again.");
//         } else if (err.response.status === 429) {
//           setServerError("Too many attempts. Please wait before trying again.");
//         } else {
//           setServerError("Authentication error. Please try again later.");
//         }
//       } else {
//         setServerError("Network error. Please check your connection.");
//       }
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="row row1 m-0 h-100">
//         <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
//           <div className="form-container form-container1">
//             <img src={img} alt="Logo" className="mb-4" />
//             <div className="button-container mb-4 d-flex justify-content-center">
//               <button type="button" className="btn btn-sm mx-1 btn-superadmin">Admin Login</button>
//             </div>
//             {serverError && <div className="alert alert-danger">{serverError}</div>}
//             {isBlocked && (
//               <div className="alert alert-warning">
//                 Too many failed attempts. Please try again in {blockTimeRemaining} minutes.
//               </div>
//             )}
//             <form onSubmit={onSubmit}>
//               <div className="mb-3 text-start">
//                 <label className="mb-2 label1">
//                   Username or email <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`form-control form-control1 ${errors.username ? 'is-invalid' : ''}`}
//                   name="username"
//                   value={userData.username}
//                   onChange={handleChange}
//                   placeholder="Enter username or email"
//                   disabled={isBlocked}
//                   autoComplete="username"
//                 />
//                 {errors.username && <small className="text-danger d-block mt-1">{errors.username}</small>}
//               </div>
//               <div className="mb-3 text-start position-relative">
//                 <label className="mb-2 label1">
//                   Password <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className={`form-control form-control1 ${errors.password ? 'is-invalid' : ''}`}
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   placeholder="Enter password"
//                   disabled={isBlocked}
//                   autoComplete="current-password"
//                 />
//                 <span
//                   className="password-toggle-icon"
//                   onClick={() => !isBlocked && setShowPassword(!showPassword)}
//                   style={{ cursor: isBlocked ? "not-allowed" : "pointer" }}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//                 {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
//               </div>

//               <div className="mb-3 text-start">
//                 <label className="mb-2 label1">
//                   CAPTCHA Verification <span className="text-danger">*</span>
//                 </label>
//                 <div className="d-flex align-items-center flex-wrap mb-2">
//                   <div className="row w-100">
//                     <div className="col-md-5 mb-2 mb-md-0">
//                       <div className="d-flex align-items-center">
//                         <div className="captcha-display me-2">{captchaCode}</div>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-captcha-refresh"
//                           onClick={refreshCaptcha}
//                           disabled={isBlocked}
//                         >
//                           <FaRedo />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-md-7">
//                       <input
//                         type="text"
//                         className={`form-control form-control1 ${errors.captchaInput ? 'is-invalid' : ''}`}
//                         name="captchaInput"
//                         value={userData.captchaInput}
//                         onChange={handleChange}
//                         placeholder="Enter CAPTCHA code"
//                         disabled={isBlocked}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {errors.captchaInput && (
//                   <small className="text-danger d-block mt-1">{errors.captchaInput}</small>
//                 )}
//               </div>
//               <div className="d-flex justify-content-between mb-4">
//                 <div></div>
//                 <Link to="/reset-password" className="a1 text-decoration-none">
//                   Forgot Password?
//                 </Link>
//               </div>
//               <div className="button-container">
//                 <button
//                   type="submit"
//                   className={`btn ${isClicked ? "btn-clicked" : "btn1"}`}
//                   disabled={isBlocked || isClicked}
//                 >
//                   {isClicked ? "Logging in..." : "Login"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState, useEffect } from "react";
// import "./Login.css";
// import img from "../../assets/img/umclogo.png";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api";
// import { FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
// const generateCaptcha = () => {
//   const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let captcha = "";
//   for (let i = 0; i < 6; i++) {
//     captcha += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return captcha;
// };

// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();
//   const [userData, setData] = useState({
//     username: "",
//     password: "",
//     captchaInput: ""
//   });
//   const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
//   const [isClicked, setIsClicked] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginAttempts, setLoginAttempts] = useState(() => {
//     const storedAttempts = localStorage.getItem("loginAttempts");
//     return storedAttempts ? JSON.parse(storedAttempts) : {};
//   });
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

//   useEffect(() => {
//     const now = Date.now();
//     const blockedUntil = localStorage.getItem("blockedUntil");

//     if (blockedUntil && now < parseInt(blockedUntil)) {
//       setIsBlocked(true);
//       setBlockTimeRemaining(Math.ceil((parseInt(blockedUntil) - now) / 1000 / 60));
//     } else if (blockedUntil) {
//       localStorage.removeItem("blockedUntil");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setData({
//       ...userData,
//       [e.target.name]: e.target.value,
//     });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };

//   const refreshCaptcha = () => {
//     setCaptchaCode(generateCaptcha());
//     setData({ ...userData, captchaInput: "" });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userData.username.trim()) newErrors.username = "Username is required";
//     if (!userData.password) newErrors.password = "Password is required";

//     // Enhanced CAPTCHA validation messages
//     if (!userData.captchaInput) {
//       newErrors.captchaInput = "Please fill in the CAPTCHA code";
//     } else if (userData.captchaInput !== captchaCode) {
//       newErrors.captchaInput = "CAPTCHA code does not match. Please try again.";
//     }

//     return newErrors;
//   };

//   const updateFailedAttempts = (username) => {
//     const now = Date.now();
//     const newAttempts = { ...loginAttempts };

//     if (!newAttempts[username]) {
//       newAttempts[username] = { count: 1, lastAttempt: now };
//     } else {
//       if (now - newAttempts[username].lastAttempt > 5 * 60 * 1000) {
//         newAttempts[username] = { count: 1, lastAttempt: now };
//       } else {
//         newAttempts[username].count += 1;
//         newAttempts[username].lastAttempt = now;
//       }
//     }

//     setLoginAttempts(newAttempts);
//     localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

//     if (newAttempts[username].count >= 3) {
//       const blockedUntil = now + 5 * 60 * 1000;
//       localStorage.setItem("blockedUntil", blockedUntil.toString());
//       setIsBlocked(true);
//       setBlockTimeRemaining(5);
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (isBlocked) {
//       setServerError(`Too many failed attempts. Please try again in ${blockTimeRemaining} minutes.`);
//       return;
//     }

//     setIsClicked(true);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setIsClicked(false);
//       return;
//     }

//     try {
//       const encryptedData = {
//         username: userData.username,
//         password: userData.password,
//       };

//       const response = await api.post("/login", encryptedData);

//       setData({ username: "", password: "", captchaInput: "" });
//       setCaptchaCode(generateCaptcha());

//       const newAttempts = { ...loginAttempts };
//       delete newAttempts[userData.username];
//       setLoginAttempts(newAttempts);
//       localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

//       const { uniqueId, user } = response.data;
//       localStorage.setItem("authToken", uniqueId);
//       localStorage.setItem("userData", JSON.stringify({
//         id: user.id,
//         role: user.role,
//         permission: user.permission
//       }));

//       onLogin();

//       if (user.role === "Superadmin") {
//         navigate("/home");
//       } else {
//         navigate("/department-information");
//       }
//     } catch (err) {
//       setIsClicked(false);
//       refreshCaptcha();
//       updateFailedAttempts(userData.username);

//       if (err.response) {
//         if (err.response.status === 403) {
//           setServerError("Account temporarily disabled. Contact support.");
//         } else if (err.response.status === 401) {
//           setServerError("Invalid credentials. Please try again.");
//         } else if (err.response.status === 429) {
//           setServerError("Too many attempts. Please wait before trying again.");
//         } else {
//           setServerError("Authentication error. Please try again later.");
//         }
//       } else {
//         setServerError("Network error. Please check your connection.");
//       }
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="row row1 m-0 h-100">
//         <div className="col-md-12 d-flex align-items-center justify-content-center right-side">
//           <div className="form-container form-container1">
//             <img src={img} alt="Logo" className="mb-4" />
//             <div className="button-container mb-4 d-flex justify-content-center">
//               <button type="button" className="btn btn-sm mx-1 btn-superadmin">Admin Login</button>
//             </div>
//             {serverError && <div className="alert alert-danger">{serverError}</div>}
//             {isBlocked && (
//               <div className="alert alert-warning">
//                 Too many failed attempts. Please try again in {blockTimeRemaining} minutes.
//               </div>
//             )}
//             <form onSubmit={onSubmit}>
//               <div className="mb-3 text-start">
//                 <label className="mb-2 label1">
//                   Username or email <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`form-control form-control1 ${errors.username ? 'is-invalid' : ''}`}
//                   name="username"
//                   value={userData.username}
//                   onChange={handleChange}
//                   placeholder="Enter username or email"
//                   disabled={isBlocked}
//                   autoComplete="username"
//                 />
//                 {errors.username && <small className="text-danger d-block mt-1">{errors.username}</small>}
//               </div>
//               <div className="mb-3 text-start position-relative">
//                 <label className="mb-2 label1">
//                   Password <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className={`form-control form-control1 ${errors.password ? 'is-invalid' : ''}`}
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   placeholder="Enter password"
//                   disabled={isBlocked}
//                   autoComplete="current-password"
//                 />
//                 <span
//                   className="password-toggle-icon"
//                   onClick={() => !isBlocked && setShowPassword(!showPassword)}
//                   style={{ cursor: isBlocked ? "not-allowed" : "pointer" }}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//                 {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
//               </div>

//               <div className="mb-3 text-start">
//                 <label className="mb-2 label1">
//                   CAPTCHA Verification <span className="text-danger">*</span>
//                 </label>
//                 <div className="d-flex align-items-center flex-wrap mb-2">
//                   <div className="row w-100">
//                     <div className="col-md-5 mb-2 mb-md-0">
//                       <div className="d-flex align-items-center">
//                         <div className="captcha-display me-2">{captchaCode}</div>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-captcha-refresh"
//                           onClick={refreshCaptcha}
//                           disabled={isBlocked}
//                         >
//                           <FaRedo />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-md-7">
//                       <input
//                         type="text"
//                         className={`form-control form-control1 ${errors.captchaInput ? 'is-invalid' : ''}`}
//                         name="captchaInput"
//                         value={userData.captchaInput}
//                         onChange={handleChange}
//                         placeholder="Enter CAPTCHA code"
//                         disabled={isBlocked}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {errors.captchaInput && (
//                   <small className="text-danger d-block mt-1">{errors.captchaInput}</small>
//                 )}
//               </div>
//               <div className="d-flex justify-content-between mb-4">
//                 <div></div>
//                 <Link to="/reset-password" className="a1 text-decoration-none">
//                   Forgot Password?
//                 </Link>
//               </div>
//               <div className="button-container">
//                 <button
//                   type="submit"
//                   className={`btn ${isClicked ? "btn-clicked" : "btn1"}`}
//                   disabled={isBlocked || isClicked}
//                 >
//                   {isClicked ? "Logging in..." : "Login"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useEffect } from "react";
import "./Login.css";
import img from "../../assets/img/umclogo.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
import CryptoJS from 'crypto-js';

const generateCaptcha = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userData, setData] = useState({
    username: "",
    password: "",
    captchaInput: ""
  });
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [isClicked, setIsClicked] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(() => {
    const storedAttempts = localStorage.getItem("loginAttempts");
    return storedAttempts ? JSON.parse(storedAttempts) : {};
  });
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  useEffect(() => {
    const now = Date.now();
    const blockedUntil = localStorage.getItem("blockedUntil");

    if (blockedUntil && now < parseInt(blockedUntil)) {
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil((parseInt(blockedUntil) - now) / 1000 / 60));
    } else if (blockedUntil) {
      localStorage.removeItem("blockedUntil");
    }
  }, []);

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setData({ ...userData, captchaInput: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username.trim()) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";

    if (!userData.captchaInput) {
      newErrors.captchaInput = "Please fill in the CAPTCHA code";
    } else if (userData.captchaInput !== captchaCode) {
      newErrors.captchaInput = "CAPTCHA code does not match. Please try again.";
    }

    return newErrors;
  };

  const updateFailedAttempts = (username) => {
    const now = Date.now();
    const newAttempts = { ...loginAttempts };

    if (!newAttempts[username]) {
      newAttempts[username] = { count: 1, lastAttempt: now };
    } else {
      if (now - newAttempts[username].lastAttempt > 5 * 60 * 1000) {
        newAttempts[username] = { count: 1, lastAttempt: now };
      } else {
        newAttempts[username].count += 1;
        newAttempts[username].lastAttempt = now;
      }
    }

    setLoginAttempts(newAttempts);
    localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

    if (newAttempts[username].count >= 3) {
      const blockedUntil = now + 5 * 60 * 1000;
      localStorage.setItem("blockedUntil", blockedUntil.toString());
      setIsBlocked(true);
      setBlockTimeRemaining(5);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setServerError(`Too many failed attempts. Please try again in ${blockTimeRemaining} minutes.`);
      return;
    }

    setIsClicked(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsClicked(false);
      return;
    }

    try {
      // Encrypt the data before sending
      const secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';
      const encryptedData = encryptData({
        username: userData.username,
        password: userData.password,
      }, secretKey);

      const response = await api.post("/login", { encryptedData });

      setData({ username: "", password: "", captchaInput: "" });
      setCaptchaCode(generateCaptcha());

      const newAttempts = { ...loginAttempts };
      delete newAttempts[userData.username];
      setLoginAttempts(newAttempts);
      localStorage.setItem("loginAttempts", JSON.stringify(newAttempts));

      const { uniqueId, user } = response.data;
      localStorage.setItem("authToken", uniqueId);
      localStorage.setItem("userData", JSON.stringify({
        id: user.id,
        role: user.role,
        permission: user.permission
      }));

      onLogin();

      if (user.role === "Superadmin") {
        navigate("/home");
      } else {
        navigate("/department-information");
      }
    } catch (err) {
      setIsClicked(false);
      refreshCaptcha();
      updateFailedAttempts(userData.username);

      if (err.response) {
        if (err.response.status === 403) {
          setServerError("Account temporarily disabled. Contact support.");
        } else if (err.response.status === 401) {
          setServerError("Invalid credentials. Please try again.");
        } else if (err.response.status === 429) {
          setServerError("Too many attempts. Please wait before trying again.");
        } else {
          setServerError("Authentication error. Please try again later.");
        }
      } else {
        setServerError("Network error. Please check your connection.");
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
              <button type="button" className="btn btn-sm mx-1 btn-superadmin">Admin Login</button>
            </div>
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            {isBlocked && (
              <div className="alert alert-warning">
                Too many failed attempts. Please try again in {blockTimeRemaining} minutes.
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className="mb-3 text-start">
                <label className="mb-2 label1">
                  Username or email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control1 ${errors.username ? 'is-invalid' : ''}`}
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                  disabled={isBlocked}
                  autoComplete="username"
                />
                {errors.username && <small className="text-danger d-block mt-1">{errors.username}</small>}
              </div>
              <div className="mb-3 text-start position-relative">
                <label className="mb-2 label1">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control form-control1 ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={isBlocked}
                  autoComplete="current-password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => !isBlocked && setShowPassword(!showPassword)}
                  style={{ cursor: isBlocked ? "not-allowed" : "pointer" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
              </div>

              <div className="mb-3 text-start">
                <label className="mb-2 label1">
                  CAPTCHA Verification <span className="text-danger">*</span>
                </label>
                <div className="d-flex align-items-center flex-wrap mb-2">
                  <div className="row w-100">
                    <div className="col-md-5 mb-2 mb-md-0">
                      <div className="d-flex align-items-center">
                        <div className="captcha-display me-2">{captchaCode}</div>
                        <button
                          type="button"
                          className="btn btn-sm btn-captcha-refresh"
                          onClick={refreshCaptcha}
                          disabled={isBlocked}
                        >
                          <FaRedo />
                        </button>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <input
                        type="text"
                        className={`form-control form-control1 ${errors.captchaInput ? 'is-invalid' : ''}`}
                        name="captchaInput"
                        value={userData.captchaInput}
                        onChange={handleChange}
                        placeholder="Enter CAPTCHA code"
                        disabled={isBlocked}
                      />
                    </div>
                  </div>
                </div>
                {errors.captchaInput && (
                  <small className="text-danger d-block mt-1">{errors.captchaInput}</small>
                )}
              </div>
              <div className="d-flex justify-content-between mb-4">
                <div></div>
                <Link to="/reset-password" className="a1 text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <div className="button-container">
                <button
                  type="submit"
                  className={`btn ${isClicked ? "btn-clicked" : "btn1"}`}
                  disabled={isBlocked || isClicked}
                >
                  {isClicked ? "Logging in..." : "Login"}
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