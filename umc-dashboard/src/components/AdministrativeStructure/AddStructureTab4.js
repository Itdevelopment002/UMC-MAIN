import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddStructureTab4 = () => {
    const [ward, setWard] = useState('');
    const [officer, setOfficer] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!ward.trim()) errors.ward = "Ward Committee No. is required.";
        if (!officer.trim()) errors.officer = "Officer name is required.";
        if (!language) errors.language = "Language selection is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "officer") setOfficer(value);
        if (name === "ward") setWard(value);
        if (name === "language") setLanguage(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await api.post('/structure-tab4', {
                ward: ward.trim(),
                officer: officer.trim(),
                language_code: language
            });

            toast.success(response.data.message || 'Data added successfully');

            setWard('');
            setOfficer('');
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
                        <li className="breadcrumb-item active" aria-current="page">Assistant Commissioner Ward Committee</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <h4 className="page-title">Assistant Commissioner Ward Committee</h4>
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
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Ward Committee No. <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                                                    value={ward}
                                                    name="ward"
                                                    placeholder="Enter Ward Committee No."
                                                    onChange={handleChange}
                                                />
                                                {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Officer Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.officer ? 'is-invalid' : ''}`}
                                                    value={officer}
                                                    name="officer"
                                                    placeholder="Enter Officer Name"
                                                    onChange={handleChange}
                                                />
                                                {errors.officer && <div className="invalid-feedback">{errors.officer}</div>}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default AddStructureTab4;
