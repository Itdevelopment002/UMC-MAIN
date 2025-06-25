import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddTableHeading = () => {
    const [table, setTable] = useState('');
    const [heading, setHeading] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!table.trim()) errors.table = "Table Name is required.";
        if (!heading.trim()) errors.heading = "Heading Name is required.";
        if (!language) errors.language = "Language selection is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "table") setTable(value);
        if (name === "heading") setHeading(value);
        if (name === "language") setLanguage(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await api.post('/table-heading', {
                tablename: table.trim(),
                heading: heading.trim(),
                language_code: language
            });
            if (response.status === 200 || response.status === 201) {
                setTable('');
                setHeading('');
                setLanguage('');
                toast.success(response.data.message || 'Table heading added successfully', {
                    position: "top-right",
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/administrative-structure');
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
                    error.response?.data?.message || "Failed to add data. Please try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error('Error adding data:', error);
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">Administrative Wings</Link></li>
                        <li className="breadcrumb-item"><Link to="/administrative-structure">Administrative Structure</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Table Heading</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <h4 className="page-title">Table Heading</h4>
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
                                                Table Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.table ? 'is-invalid' : ''}`}
                                                    value={table}
                                                    name="table"
                                                    placeholder="Enter Table Name"
                                                    onChange={handleChange}
                                                />
                                                {errors.table && <div className="invalid-feedback">{errors.table}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Heading Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                                                    value={heading}
                                                    name="heading"
                                                    placeholder="Enter Heading Name"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
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

export default AddTableHeading;
