import React, { useState, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { getImageValidationError } from "../../validation/ImageValidation";

const AddServices = () => {
    const [heading, setHeading] = useState('');
    const [link, setLink] = useState('');
    const [language, setLanguage] = useState("");
    const [mainIcon, setMainIcon] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};
        if (!heading) newErrors.heading = "Initiative Heading is required.";
        if (!link) newErrors.link = "Initiative Link is required.";
        if (!language) newErrors.language = "Language selection is required.";
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
            const errorMessage = getImageValidationError(file);

            if (errorMessage) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
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
            const response = await api.post('/initiatives', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                setHeading('');
                setLink('');
                setLanguage('');
                setMainIcon(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                toast.success("Initiative added successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/initiatives');
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
                    error.response?.data?.message || "Failed to add initiative. Try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error("Error adding initiative:", error);
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/initiatives">Initiatives-Programme</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Initiatives-Programme</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Initiatives-Programme</h4>
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
                                            <label className="col-form-label col-md-3">Initiative Heading <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.heading ? 'is-invalid' : ''}`}
                                                    value={heading}
                                                    name="heading"
                                                    placeholder='Enter Initiative Heading'
                                                    onChange={handleChange}
                                                />
                                                {errors.heading && <span className="invalid-feedback">{errors.heading}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Initiative Link <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                                                    value={link}
                                                    name="link"
                                                    placeholder='Enter Initiative Link'
                                                    onChange={handleChange}
                                                />
                                                {errors.link && <span className="invalid-feedback">{errors.link}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-md-3">Initiative Icon <span className="text-danger">*</span></label>
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
                                                {errors.mainIcon && <span className="invalid-feedback">{errors.mainIcon}</span>}
                                                <small className="text-muted">📌 Note: Only JPG, JPEG, PNG images are allowed.</small>
                                            </div>
                                        </div>
                                        <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
                                    </form>
                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddServices;