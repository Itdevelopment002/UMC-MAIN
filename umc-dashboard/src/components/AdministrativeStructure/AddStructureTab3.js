import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddStructureTab3 = () => {
    const [heading1, setHeading1] = useState('');
    const [heading2, setHeading2] = useState('');
    const [heading3, setHeading3] = useState('');
    const [heading4, setHeading4] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!heading1.trim()) errors.heading1 = "Heading 1 is required.";
        if (!heading2.trim()) errors.heading2 = "Heading 2 is required.";
        if (!heading3.trim()) errors.heading3 = "Heading 3 is required.";
        if (!heading4.trim()) errors.heading4 = "Heading 4 is required.";
        if (!language) errors.language = "Language selection is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "heading1") setHeading1(value);
        if (name === "heading2") setHeading2(value);
        if (name === "heading3") setHeading3(value);
        if (name === "heading4") setHeading4(value);
        if (name === "language") setLanguage(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await api.post('/structure-tab3', {
                heading1: heading1.trim(),
                heading2: heading2.trim(),
                heading3: heading3.trim(),
                heading4: heading4.trim(),
                language_code: language
            });

            toast.success(response.data.message || 'Data added successfully');

            setHeading1('');
            setHeading2('');
            setHeading3('');
            setHeading4('');
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
                        <li className="breadcrumb-item active" aria-current="page">Departments assigned to Assistant Commissioner</li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <h4 className="page-title">Departments assigned to Assistant Commissioner</h4>
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
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                heading 3 <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.heading3 ? 'is-invalid' : ''}`}
                                                    value={heading3}
                                                    name="heading3"
                                                    placeholder="Enter Heading 3"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading3 && <div className="invalid-feedback">{errors.heading3}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Heading 4 <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.heading4 ? 'is-invalid' : ''}`}
                                                    value={heading4}
                                                    name="heading4"
                                                    placeholder="Enter Heading 4"
                                                    onChange={handleChange}
                                                />
                                                {errors.heading4 && <div className="invalid-feedback">{errors.heading4}</div>}
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

export default AddStructureTab3;
