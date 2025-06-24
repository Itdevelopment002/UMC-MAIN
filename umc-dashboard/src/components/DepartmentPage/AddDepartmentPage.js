import React, { useState, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { getImageValidationError } from '../../validation/ImageValidation';

const AddDepartmentPage = () => {
    const [heading, setHeading] = useState('');
    const [link, setLink] = useState('');
    const [language, setLanguage] = useState("");
    const [mainIcon, setMainIcon] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};
        if (!heading.trim()) newErrors.heading = "Department Name is required.";
        if (!link.trim()) newErrors.link = "Department Link is required.";
        if (!language) newErrors.language = "Language selection is required";

        // Use our global validation function for image
        const imageError = getImageValidationError(mainIcon);
        if (imageError) {
            newErrors.mainIcon = imageError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate the image file
            const errorMessage = getImageValidationError(file);

            if (errorMessage) {
                // Clear the file input if invalid file is selected
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Set error message
                setErrors({ ...errors, mainIcon: errorMessage });
                return;
            }

            setMainIcon(file);
            setErrors({ ...errors, mainIcon: "" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));

        if (name === "heading") setHeading(value);
        if (name === "link") setLink(value);
        if (name === "language") setLanguage(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('heading', heading);
        formData.append('link', link);
        formData.append('language_code', language);
        if (mainIcon) formData.append('mainIcon', mainIcon);

        try {
            const response = await api.post('/department-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message || "Department added successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            // Reset form
            setHeading('');
            setLink('');
            setLanguage('');
            setMainIcon(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            navigate('/departments');
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
                    error.response?.data?.message || "Failed to add department. Try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }

            console.error("Error adding department:", error);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/departments">Departments</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add Departments</li>
                </ol>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card-box">
                            <div className="card-block">
                                <div className="row">
                                    <div className="col-12">
                                        <h4 className="page-title">Add Departments</h4>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3">
                                            Select Language <span className="text-danger">*</span>
                                        </label>
                                        <div className="col-md-4">
                                            <select
                                                className={`form-control form-control-md ${errors.language ? 'is-invalid' : ''}`}
                                                value={language}
                                                name="language"
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Language</option>
                                                <option value="en">English</option>
                                                <option value="mr">Marathi</option>
                                            </select>
                                            {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3">Department Name <span className="text-danger">*</span></label>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className={`form-control form-control-md ${errors.heading ? 'is-invalid' : ''}`}
                                                value={heading}
                                                name="heading"
                                                onChange={handleChange}
                                                placeholder='Enter Department Name'
                                            />
                                            {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3">Department Link <span className="text-danger">*</span></label>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                                                value={link}
                                                name="link"
                                                onChange={handleChange}
                                                placeholder='Enter Department Link'
                                            />
                                            {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-form-label col-lg-3">Department Icon <span className="text-danger">*</span></label>
                                        <div className="col-md-4">
                                            <input
                                                type="file"
                                                id="mainIconInput"
                                                name="mainIcon"
                                                className={`form-control form-control-md ${errors.mainIcon ? 'is-invalid' : ''}`}
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                            />
                                            {errors.mainIcon && <div className="invalid-feedback">{errors.mainIcon}</div>}
                                            <small className="text-muted d-block mt-1">
                                                📌 Note: Image Max size: 2MB.
                                            </small>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-4 offset-md-3">
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
            <ToastContainer />
        </div>
    );
};

export default AddDepartmentPage;