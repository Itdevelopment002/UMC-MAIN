import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";
import { jwtDecode } from "jwt-decode";

const AddDepartmentBanner = () => {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const userData = token ? jwtDecode(token) : null;
    const fileInputRef = useRef(null);

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/department-info");
            const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
            if (userData?.role === "Superadmin") {
                setDepartments(sortedData);
            } else {
                const userPermissions = userData?.permission?.split(",").map(perm => perm.trim());
                const filteredData = sortedData.filter(item => userPermissions.includes(item.heading));
                setDepartments(filteredData);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        //eslint-disable-next-line
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Use our global validation function
            const errorMessage = getImageValidationError(file);

            if (errorMessage) {
                // Clear the file input if invalid file is selected
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Set error message
                setErrors({ ...errors, selectedFile: errorMessage });
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setErrors({ ...errors, selectedFile: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!departmentName) newErrors.departmentName = "Department Name is required";

        // Use our global validation function
        const imageError = getImageValidationError(selectedFile);
        if (imageError) {
            newErrors.selectedFile = imageError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("bannerImage", selectedFile);
        formDataToSend.append("departmentName", departmentName);

        try {
            const response = await api.post("/department-banner", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200 || response.status === 201) {
                setDepartmentName("");
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                toast.success("Department banner added successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                    onClose: () => {
                        navigate("/department-information");
                    }
                });
            }
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
                    error.response?.data?.message || "Failed to add department banner. Try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }

            console.error("Error adding department banner:", error);
        }
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="#">Departments</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/department-information">Department Information</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Add Department Banner
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Department Banner</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Department Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
                                                    name="departmentName"
                                                    value={departmentName}
                                                    onChange={(e) => {
                                                        setDepartmentName(e.target.value);
                                                        setErrors((prev) => ({ ...prev, departmentName: "" }));
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select Department Name
                                                    </option>
                                                    {departments.map((department) => (
                                                        <option value={department.heading} key={department.id}>
                                                            {department.heading}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.departmentName && (
                                                    <div className="invalid-feedback">{errors.departmentName}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-2 col-md-2">
                                                Department Banner <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="file"
                                                    id="bannerImage"
                                                    name="bannerImage"
                                                    accept=".jpg,.jpeg,.png"
                                                    className={`form-control ${errors.selectedFile ? "is-invalid" : ""}`}
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                />
                                                {errors.selectedFile && (
                                                    <div className="invalid-feedback">
                                                        {errors.selectedFile}
                                                    </div>
                                                )}
                                                <small className="text-muted">📌 Note: Image Max size: 2MB</small>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-md-4 offset-md-2">
                                                <button type="submit" className="btn btn-primary btn-sm">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddDepartmentBanner;