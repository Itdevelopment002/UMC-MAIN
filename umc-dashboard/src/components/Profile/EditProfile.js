import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import api, { baseURL } from "../api";
import './EditProfile.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";

const EditProfile = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const id = userData?.id;

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const userData = response.data;
            setFullname(userData.fullname || "");
            setEmail(userData.email || "");
            setPreviewImage(userData.userImage ? `${baseURL}/${userData.userImage}` : "https://via.placeholder.com/150");
            setIsChanged(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setIsChanged(true);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("email", email);
            if (image) formData.append("userImage", image);

            await api.put(`/users/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Profile updated successfully!");
            fetchUser();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const getPasswordStrength = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const moderateRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        if (strongRegex.test(password)) {
            return { message: "✅ Strong password", color: "success" };
        } else if (moderateRegex.test(password)) {
            return { message: "⚠️ Moderate password", color: "warning" };
        } else {
            return { message: "❌ Weak password", color: "danger" };
        }
    };

    const validateForm = () => {
        let newErrors = {};
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!trimmedPassword) {
            newErrors.password = "Password is required.";
        } else if (!strongRegex.test(trimmedPassword)) {
            newErrors.password =
                "Password must be strong (min 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character).";
        }

        if (!trimmedConfirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (trimmedPassword !== trimmedConfirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerifyOldPasswordAndUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/users/${id}/verify-password`, { password: oldPassword });

            if (res.data.valid) {
                await api.patch(`/users/${id}/update-password`, { newPassword: password });
                toast.success("Password updated successfully!");
                setPassword("");
                setConfirmPassword("");
                setOldPassword("");
                setShowModal(false);
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = "/";
                }, 2000);
            } else {
                toast.error("Old password is incorrect.");
            }
        } catch (error) {
            console.error("Error verifying old password:", error);
            toast.error("Failed to verify password.");
        }
    };

    const handleFieldChange = (e, field) => {
        const value = e.target.value;
        if (field === "fullname") setFullname(value);
        if (field === "email") setEmail(value);
        setIsChanged(true);
    };

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
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
                                    src={previewImage}
                                    alt="User Avatar"
                                    className="rounded-circle img-fluid"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <label className="position-absolute" style={{ top: "10px", right: "10px", cursor: "pointer" }}>
                                    <FiEdit className="bg-white shadow" style={{ fontSize: "25px", padding: "2px", borderRadius: "10px", color: "#E3435A" }} />
                                    <input type="file" className="d-none" onChange={handleImageChange} />
                                </label>
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
                            <form onSubmit={handlePasswordFormSubmit}>
                                <div className="form-group row">
                                    <label className="col-form-label col-md-2"><strong>New Password:</strong></label>
                                    <div className="col-md-4 position-relative">
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
                                            <small className={`text-${getPasswordStrength(password).color}`}>
                                                {getPasswordStrength(password).message}
                                            </small>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-form-label col-md-2"><strong>Confirm Password:</strong></label>
                                    <div className="col-md-4 position-relative">
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
                                <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modal for old password verification */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Verify Old Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group position-relative">
                            <label>Enter Old Password</label>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                className="form-control form-control-md"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{ paddingRight: "35px" }}
                            />
                            <span
                                className="position-absolute end-0 translate-middle-y me-2"
                                style={{ cursor: "pointer", right: "10px", top: "43px" }}
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={handleVerifyOldPasswordAndUpdate}>Verify & Update</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditProfile;
