import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddProjects = () => {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [mainIcon, setMainIcon] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!heading) errors.heading = "Heading is required.";
        if (!description) errors.description = "Description is required.";
        if (!link) errors.link = "Link is required.";
        if (!mainIcon) errors.mainIcon = "Main Icon is required.";
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
        if (mainIcon) formData.append('mainIcon', mainIcon);

        try {
            const response = await api.post('/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message);
            setHeading('');
            setDescription('');
            setLink('');
            setMainIcon(null);
            document.getElementById('mainIconInput').value = '';
            navigate('/projects');
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
                        <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/projects">Upcoming Projects</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Upcoming Projects</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Add Upcoming Projects</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Project Heading <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.heading ? 'is-invalid' : ''}`}
                                                    value={heading}
                                                    name="heading"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading && <span className="text-danger">{errors.heading}</span>}
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
                                                    onChange={handleChange}
                                                />
                                                {errors.description && <span className="text-danger">{errors.description}</span>}
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
                                                    onChange={handleChange}
                                                />
                                                {errors.link && <span className="text-danger">{errors.link}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3">Project Image <span className="text-danger">*</span></label>
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
                                        <input type="submit" className="btn btn-primary" value="Submit" />
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

export default AddProjects;
