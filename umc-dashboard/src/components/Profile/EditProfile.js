import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api";
import './EditProfile.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import image from "../../assets/img/profile-image.jpg"
import CustomEncryption from "../../encryption/CustomEncrypt";

const EditProfile = ({ onLogout }) => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
        notCommon: true,
        notContextual: true
    });

    const token = localStorage.getItem("authToken");
    const userData = token ? jwtDecode(token) : null;
    const id = userData?.userId;

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, [id]);

    const commonPasswords = [
        'password', '123456', '12345678', '1234', 'qwerty', '12345',
        'dragon', 'baseball', 'football', 'letmein', 'monkey'
    ];

    useEffect(() => {
        if (password) {
            checkPasswordStrength(password);
        }
        //eslint-disable-next-line
    }, [password]);

    const checkPasswordStrength = (pwd) => {
        const hasMinLength = pwd.length >= 8;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[@$!%*?&]/.test(pwd);
        const isNotCommon = !commonPasswords.includes(pwd.toLowerCase());
        const isNotContextual = !pwd.toLowerCase().includes(fullname.toLowerCase()) &&
            !pwd.toLowerCase().includes(email.split('@')[0].toLowerCase());

        setPasswordStrength({
            length: hasMinLength,
            upper: hasUpper,
            lower: hasLower,
            number: hasNumber,
            special: hasSpecial,
            notCommon: isNotCommon,
            notContextual: isNotContextual
        });
    };

    const getPasswordStrength = () => {
        const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;

        if (!length || !upper || !lower || !number || !special || !notCommon || !notContextual) {
            return { message: "❌ Weak password - doesn't meet all requirements", color: "danger" };
        }

        return { message: "✅ Strong password - meets all requirements", color: "success" };
    };

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const userData = response.data;
            setFullname(userData.fullname || "");
            setEmail(userData.email || "");
            setIsChanged(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = {
                fullname,
                email,
            }

            await api.post(`/edit-users/${id}`, formData);
            toast.success("Profile updated successfully!");
            fetchUser();
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                Array.isArray(error.response.data.errors)
            ) {
                error.response.data.errors.forEach((err) => {
                    const message = typeof err === "string" ? err : err.message || "Validation error";
                    toast.error(message, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                });
            } else {
                toast.error(
                    error.response?.data?.message || "Failed to update profile. Try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error("Error updating profile:", error);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedOldPassword = oldPassword.trim();

        // Validate old password
        if (!trimmedOldPassword) {
            newErrors.oldPassword = "Old password is required.";
        }

        // Check all password requirements
        if (!trimmedPassword) {
            newErrors.password = "Password is required.";
        } else {
            const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;

            if (!length) newErrors.password = "Password must be at least 8 characters long.";
            else if (!upper) newErrors.password = "Password must contain at least one uppercase letter.";
            else if (!lower) newErrors.password = "Password must contain at least one lowercase letter.";
            else if (!number) newErrors.password = "Password must contain at least one number.";
            else if (!special) newErrors.password = "Password must contain at least one special character (@$!%*?&).";
            else if (!notCommon) newErrors.password = "Password is too common. Please choose a more unique password.";
            else if (!notContextual) newErrors.password = "Password should not contain your name or email.";
        }

        if (!trimmedConfirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerifyOldPasswordAndUpdate = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (password === oldPassword) {
                toast.error("New password must be different from old password.");
                return;
            }
            /* added Decode password start here */
            const nonceRes = await api.get(`/nonce/userId/${id}`);
            const { nonce } = nonceRes.data;
            const finalNewPassword = CustomEncryption(password, nonce);
            const finalOldPassword = CustomEncryption(oldPassword, nonce);
            /* added Decode password here */
            const response = await api.post(`/users/${id}/verify-update-password`, {
                finalOldPassword,
                finalNewPassword
            });

            const { message, requirements } = response.data;

            if (response.data.success || message === "Password updated successfully") {
                setPassword("");
                setConfirmPassword("");
                setOldPassword("");
                toast.success("Password updated successfully!", {
                    autoClose: 1000,
                    onClose: () => {
                        onLogout();
                    },
                });
            } else if (message === "Weak password - doesn't meet all requirements" && requirements) {
                toast.error("Password must meet all requirements");
            } else {
                toast.error(message || "Failed to update password.");
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong while updating password.";
            toast.error(`${errMsg}`);
            console.error("Error updating password:", error);
        }
    };

    const handleFieldChange = (e, field) => {
        const value = e.target.value;
        if (field === "fullname") setFullname(value);
        if (field === "email") setEmail(value);
        setIsChanged(true);
    };

    const renderPasswordRequirements = () => {
        const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;

        return (
            <div className="password-requirements mt-2">
                <small>Password must meet these requirements:</small>
                <ul className="list-unstyled">
                    <li className={length ? "text-success" : "text-danger"}>
                        {length ? "✓" : "✗"} At least 8 characters
                    </li>
                    <li className={upper ? "text-success" : "text-danger"}>
                        {upper ? "✓" : "✗"} At least one uppercase letter
                    </li>
                    <li className={lower ? "text-success" : "text-danger"}>
                        {lower ? "✓" : "✗"} At least one lowercase letter
                    </li>
                    <li className={number ? "text-success" : "text-danger"}>
                        {number ? "✓" : "✗"} At least one number
                    </li>
                    <li className={special ? "text-success" : "text-danger"}>
                        {special ? "✓" : "✗"} At least one special character (@$!%*?&)
                    </li>
                    <li className={notCommon ? "text-success" : "text-danger"}>
                        {notCommon ? "✓" : "✗"} Not a common password
                    </li>
                    <li className={notContextual ? "text-success" : "text-danger"}>
                        {notContextual ? "✓" : "✗"} Doesn't contain your name or email
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Edit Profile</li>
                    </ol>
                </nav>

                {/* Profile Edit Section */}
                <div className="card mb-4 p-4">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center position-relative">
                            <div className="position-relative" style={{ width: "150px", height: "150px", display: "inline-block" }}>
                                <img
                                    src={image}
                                    alt="User Avatar"
                                    className="rounded-circle img-fluid"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        </div>
                        <div className="col-md-8 mt-4">
                            <div className="row mb-3">
                                <div className="col-sm-4"><strong>Full Name:</strong></div>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        className="form-control custom-input-edit-profile"
                                        value={fullname}
                                        onChange={(e) => handleFieldChange(e, "fullname")}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4"><strong>Email:</strong></div>
                                <div className="col-sm-8">
                                    <input
                                        type="email"
                                        className="form-control custom-input-edit-profile"
                                        value={email}
                                        onChange={(e) => handleFieldChange(e, "email")}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end">
                                <button className="btn btn-success mx-2 btn-sm" onClick={handleSaveProfile} disabled={!isChanged}>Save Changes</button>
                                <button className="btn btn-secondary mx-2 btn-sm" onClick={() => navigate(-1)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="card p-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <h4 className="page-title">Change Password</h4>
                            <form onSubmit={handleVerifyOldPasswordAndUpdate}>
                                <div className="form-group row">
                                    <label className="col-form-label col-md-2"><strong>New Password:</strong></label>
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control custom-input-edit-profile ${errors.password ? "is-invalid" : ""}`}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ paddingRight: "35px" }}
                                        />
                                        <span
                                            className="position-absolute end-0 translate-middle-y me-2"
                                            style={{ cursor: "pointer", right: "20px", top: "12px" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        {password && (
                                            <small className={`text-${getPasswordStrength().color}`}>
                                                {getPasswordStrength().message}
                                            </small>
                                        )}
                                        {password && renderPasswordRequirements()}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-form-label col-md-2"><strong>Confirm Password:</strong></label>
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`form-control custom-input-edit-profile ${errors.confirmPassword ? "is-invalid" : ""}`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={{ paddingRight: "35px" }}
                                        />
                                        <span
                                            className="position-absolute end-0 translate-middle-y me-2"
                                            style={{ cursor: "pointer", right: "20px", top: "12px" }}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-form-label col-md-2"><strong>Old Password:</strong></label>
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            className={`form-control custom-input-edit-profile ${errors.oldPassword ? "is-invalid" : ""}`}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            style={{ paddingRight: "35px" }}
                                        />
                                        <span
                                            className="position-absolute end-0 translate-middle-y me-2"
                                            style={{ cursor: "pointer", right: "20px", top: "12px" }}
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                        >
                                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6 offset-md-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={!password || !confirmPassword || !oldPassword || Object.values(passwordStrength).some(val => !val)}
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditProfile;