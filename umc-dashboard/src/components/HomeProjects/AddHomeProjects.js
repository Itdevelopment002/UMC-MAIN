import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const AddHomeProjects = () => {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [language, setLanguage] = useState('');
    const [mainIcon, setMainIcon] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!heading) errors.heading = "Project Heading is required.";
        if (!description) errors.description = "Project Description is required.";
        if (!link) errors.link = "Project Link is required.";
        if (!language) errors.language = "Language Selection is required.";
        if (!mainIcon) errors.mainIcon = "Project Image is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e, setFile, fieldName) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFile(file);
            setErrors((prev) => ({ ...prev, [fieldName]: null }));
        } else {
            setErrors((prev) => ({ ...prev, [fieldName]: "Please upload a valid image file." }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "heading") setHeading(value);
        if (name === "description") setDescription(value);
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
        formData.append('description', description);
        formData.append('link', link);
        formData.append('language_code', language);
        if (mainIcon) formData.append('mainIcon', mainIcon);

        try {
            //eslint-disable-next-line
            const response = await api.post('/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                setHeading('');
                setDescription('');
                setLink('');
                setLanguage('');
                setMainIcon(null);
                document.getElementById('mainIconInput').value = '';
                toast.success("Project data added successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/home-projects');
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
                    error.response?.data?.message || "Failed to add project data. Try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error("Error adding project data:", error);
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Upcoming Projects</Link></li>
                        <li className="breadcrumb-item"><Link to="/home-projects">Home Projects</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Home Projects</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Home Projects</h4>
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
                                                    <option value="" disabled>Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Project Heading <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.heading ? 'is-invalid' : ''}`}
                                                    value={heading}
                                                    name="heading"
                                                    placeholder='Enter Project Heading'
                                                    onChange={handleChange}
                                                />
                                                {errors.heading && <span className="invalid-feedback">{errors.heading}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Project Description <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.description ? 'is-invalid' : ''}`}
                                                    value={description}
                                                    name="description"
                                                    placeholder='Enter Project Description'
                                                    onChange={handleChange}
                                                />
                                                {errors.description && <span className="invalid-feedback">{errors.description}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Project Link <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                                                    value={link}
                                                    name="link"
                                                    placeholder='Enter Project Link'
                                                    onChange={handleChange}
                                                />
                                                {errors.link && <span className="invalid-feedback">{errors.link}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-md-3">Project Image <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="file"
                                                    id="mainIconInput"
                                                    name="mainIcon"
                                                    className={`form-control form-control-md ${errors.mainIcon ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, setMainIcon, 'mainIcon')}
                                                />
                                                {errors.mainIcon && <span className="invalid-feedback">{errors.mainIcon}</span>}
                                                <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
                                            </div>
                                        </div>
                                        <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default AddHomeProjects;
