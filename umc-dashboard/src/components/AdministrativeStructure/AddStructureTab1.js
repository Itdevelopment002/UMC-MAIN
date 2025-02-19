import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddStructureTab1 = () => {
    const [heading1, setHeading1] = useState('');
    const [heading2, setHeading2] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!heading1.trim()) errors.heading1 = "Heading 1 is required.";
        if (!heading2.trim()) errors.heading2 = "Heading 2 is required.";
        if (!language) errors.language = "Language selection is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "heading1") setHeading1(value);
        if (name === "heading2") setHeading2(value);
        if (name === "language") setLanguage(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await api.post('/structure-tab1', {
                heading1: heading1.trim(),
                heading2: heading2.trim(),
                language_code: language
            });

            toast.success(response.data.message || 'Data added successfully');

            setHeading1('');
            setHeading2('');
            setLanguage('');
            navigate('/administrative-structure');
        } catch (error) {
            console.error('Error uploading data:', error);
            toast.error(error?.response?.data?.message || 'Failed to add data. Please try again.');
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Administrative Wings</Link></li>
                        <li className="breadcrumb-item"><Link to="/administrative-structure">Administrative Structure</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Departments entrusted to Additional Commissioners</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <h4 className="page-title">Departments entrusted to Additional Commissioners</h4>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Select Language <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.language ? 'is-invalid' : ''}`}
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
                                            <label className="col-form-label col-md-2">
                                                heading 1 <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.heading1 ? 'is-invalid' : ''}`}
                                                    value={heading1}
                                                    name="heading1"
                                                    placeholder="Enter Heading 1"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading1 && <div className="invalid-feedback">{errors.heading1}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                heading 2 <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.heading2 ? 'is-invalid' : ''}`}
                                                    value={heading2}
                                                    name="heading2"
                                                    placeholder="Enter Heading 2"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading2 && <div className="invalid-feedback">{errors.heading2}</div>}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-sm">Submit</button>
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

export default AddStructureTab1;
