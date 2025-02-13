import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddCitizeServices = () => {
    const [serviceHeading, setServiceHeading] = useState('');
    const [serviceLink, setServiceLink] = useState('');
    const [mainIcon, setMainIcon] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!serviceHeading) errors.serviceHeading = "Service Heading is required.";
        if (!serviceLink) errors.serviceLink = "Service Link is required.";
        if (!mainIcon) errors.mainIcon = "Service Icon is required.";
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
        if (name === "serviceHeading") setServiceHeading(value);
        if (name === "serviceLink") setServiceLink(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('serviceHeading', serviceHeading);
        formData.append('serviceLink', serviceLink);
        if (mainIcon) formData.append('mainIcon', mainIcon);

        try {
            const response = await api.post('/citizen-services', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message);

            // Reset the form
            setServiceHeading('');
            setServiceLink('');
            setMainIcon(null);
            document.getElementById('mainIconInput').value = '';
            navigate('/citizen-services');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to add service. Please try again.');
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/citizen-services">Citizen Services</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Citizen Services</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Citizen Services</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Service Heading <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.serviceHeading ? 'is-invalid' : ''}`}
                                                    value={serviceHeading}
                                                    name="serviceHeading"
                                                    placeholder='Enter Service Heading'
                                                    onChange={handleChange}
                                                />
                                                {errors.serviceHeading && <span className="text-danger">{errors.serviceHeading}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Service Link <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.serviceLink ? 'is-invalid' : ''}`}
                                                    value={serviceLink}
                                                    name="serviceLink"
                                                    placeholder='Enter Service Link'
                                                    onChange={handleChange}
                                                />
                                                {errors.serviceLink && <span className="text-danger">{errors.serviceLink}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3">Service Icon <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="file"
                                                    id="mainIconInput"
                                                    name="mainIcon"
                                                    className={`form-control form-control-md ${errors.mainIcon ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, setMainIcon, 'mainIcon')}
                                                />
                                                {errors.mainIcon && <span className="text-danger">{errors.mainIcon}</span>}
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

export default AddCitizeServices;
