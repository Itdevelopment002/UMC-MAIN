import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import api, { baseURL } from "../api";
import './EditProfile.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";

const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [designation, setDesignation] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    useEffect(() => {
        fetchUser();
        //eslint-disable-next-line
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const userData = response.data;

            setUser(userData);
            setFullname(userData.fullname || "");
            setEmail(userData.email || "");
            setMobile(userData.mobile || "");
            setDesignation(userData.designation || "");
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
            formData.append("mobile", mobile);
            formData.append("designation", designation);
            if (image) formData.append("userImage", image);

            await api.put(`/users/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Profile updated successfully!");
            fetchUser();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const handleVerifyAndUpdatePassword = async () => {
        const storedPassword = user?.password;

        if (oldPassword !== storedPassword) {
            toast.error("Old password is incorrect.");
            return;
        }

        try {
            await api.put(`/users/${id}`, { password });
            toast.success("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
            setOldPassword("");
            setShowModal(false);
            setTimeout(() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("lastVisitedRoute");
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password.");
        }
    };

    const handleFieldChange = (e, field) => {
        const value = e.target.value;
        if (field === "fullname") setFullname(value);
        if (field === "email") setEmail(value);
        if (field === "mobile") setMobile(value);
        if (field === "designation") setDesignation(value);

        setIsChanged(true);
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/home">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Edit Profile
                        </li>
                    </ol>
                </nav>
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
                        <div className="col-md-8">
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
                                <div className="col-sm-4"><strong>Designation:</strong></div>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        className="form-control custom-input-edit-profile"
                                        value={designation}
                                        onChange={(e) => handleFieldChange(e, "designation")}
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
                            <div className="row mb-3">
                                <div className="col-sm-4"><strong>Mobile:</strong></div>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        className="form-control custom-input-edit-profile"
                                        value={mobile}
                                        onChange={(e) => handleFieldChange(e, "mobile")}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end">
                                <button
                                    className="btn btn-success mx-2 btn-sm"
                                    onClick={handleSaveProfile}
                                    disabled={!isChanged}
                                >
                                    Save Changes
                                </button>
                                <button className="btn btn-secondary mx-2 btn-sm" onClick={() => navigate(-1)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-12">
                                    <h4 className="page-title">Change Password</h4>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
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
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title textCenter>Verify Old Password</Modal.Title>
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
                        <Button variant="primary" size="sm" onClick={handleVerifyAndUpdatePassword}>Verify & Update</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditProfile;