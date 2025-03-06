import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddPortalServices = () => {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [language, setLanguage] = useState('');
    const [portalImage, setPortalImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!heading) errors.heading = "Service Heading is required.";
        if (!description) errors.description = "Service Description is required.";
        if (!link) errors.link = "Service Link is required.";
        if (!language) errors.language = "Language Selection is required.";
        if (!portalImage) errors.portalImage = "Service Image is required.";
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
        if (portalImage) formData.append('portalImage', portalImage);

        try {
            const response = await api.post('/portal-services', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message);
            setHeading('');
            setDescription('');
            setLink('');
            setLanguage('');
            setPortalImage(null);
            document.getElementById('portalImageInput').value = '';
            navigate('/citizen-communication');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to add project. Please try again.');
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/citizen-communication">Citizen Communication</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Portal Services</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Portal Services</h4>
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
                                            <label className="col-form-label col-md-3">Service Heading <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.heading ? 'is-invalid' : ''}`}
                                                    value={heading}
                                                    name="heading"
                                                    placeholder='Enter Service Heading'
                                                    onChange={handleChange}
                                                />
                                                {errors.heading && <span className="invalid-feedback">{errors.heading}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Service Description <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.description ? 'is-invalid' : ''}`}
                                                    value={description}
                                                    name="description"
                                                    placeholder='Enter Service Heading'
                                                    onChange={handleChange}
                                                />
                                                {errors.description && <span className="invalid-feedback">{errors.description}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Service Link <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.link ? 'is-invalid' : ''}`}
                                                    value={link}
                                                    name="link"
                                                    placeholder='Enter Service Link'
                                                    onChange={handleChange}
                                                />
                                                {errors.link && <span className="invalid-feedback">{errors.link}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-md-3">Service Image <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="file"
                                                    id="portalImageInput"
                                                    name="portalImage"
                                                    className={`form-control form-control-md ${errors.portalImage ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, setPortalImage, 'portalImage')}
                                                />
                                                {errors.portalImage && <span className="invalid-feedback">{errors.portalImage}</span>}
                                                <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
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

export default AddPortalServices;
