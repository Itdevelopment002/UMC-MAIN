import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaTrash } from "react-icons/fa";

const AddProjectDescription = () => {
    const [description, setDescription] = useState("");
    const [subDescriptions, setSubDescriptions] = useState([]);
    const [language, setLanguage] = useState("");
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const validationErrors = {};

        if (!description) {
            validationErrors.description = "Project description is required.";
        }

        if (!language) {
            validationErrors.language = "Language selection is required";
        }

        if (!department) {
            validationErrors.department = "Project Heading is required.";
        }

        subDescriptions.forEach((subDesc, index) => {
            if (!subDesc) {
                validationErrors[`subDescription${index}`] = `Sub description ${index + 1} is required.`;
            }
        });

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/project-category");
            const sortedData = response.data;
            setDepartments(sortedData);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await api.post("/project-description", {
                department,
                description,
                language_code: language,
                subDescriptions,
            });

            setDepartment("");
            setDescription("");
            setLanguage("");
            setSubDescriptions([]);
            navigate("/project-details");
        } catch (error) {
            console.error("Error adding project description:", error);
        }
    };

    const handleAddSubDescription = () => {
        setSubDescriptions([...subDescriptions, ""]);
    };

    const handleSubDescriptionChange = (index, value) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions[index] = value;
        setSubDescriptions(updatedSubDescriptions);
    };

    const handleRemoveSubDescription = (index) => {
        const updatedSubDescriptions = subDescriptions.filter((_, i) => i !== index);
        setSubDescriptions(updatedSubDescriptions);
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="#">Upcoming Projects</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/project-details">Project Details</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Add Project Description
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Project Description</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Select Language <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.language ? "is-invalid" : ""}`}
                                                    name="language"
                                                    value={language}
                                                    onChange={(e) => {
                                                        setLanguage(e.target.value);
                                                        setErrors((prev) => ({ ...prev, language: "" }));
                                                    }}
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
                                                Project Heading <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                                    name="department"
                                                    value={department}
                                                    onChange={(e) => {
                                                        setDepartment(e.target.value);
                                                        setErrors((prev) => ({ ...prev, department: "" }));
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select Project Heading
                                                    </option>
                                                    {departments.map((dept) => (
                                                        <option value={dept.heading} key={dept.id}>
                                                            {dept.heading}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.department && (
                                                    <div className="invalid-feedback">{errors.department}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Project Description <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.description ? "is-invalid" : ""
                                                        }`}
                                                    placeholder="Enter Project Description"
                                                    value={description}
                                                    onChange={(e) => {
                                                        setDescription(e.target.value);
                                                        if (errors.description) {
                                                            setErrors({ ...errors, description: "" });
                                                        }
                                                    }}
                                                />
                                                {errors.description && (
                                                    <div className="invalid-feedback">{errors.description}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                type="button"
                                                className="btn btn-outline-success btn-sm mb-2"
                                                onClick={handleAddSubDescription}
                                                value="+ Add Sub Description"
                                            />
                                            {subDescriptions.map((subDesc, index) => (
                                                <div className="form-group row" key={index}>
                                                    <label className="col-form-label col-md-2">
                                                        Sub Description {index + 1}
                                                    </label>
                                                    <div className="col-md-4">
                                                        <input
                                                            type="text"
                                                            className={`form-control form-control-md ${errors[`subDescription${index}`] ? "is-invalid" : ""}`}
                                                            placeholder={`Enter Sub Description ${index + 1}`}
                                                            value={subDesc}
                                                            onChange={(e) => handleSubDescriptionChange(index, e.target.value)}
                                                        />
                                                        {errors[`subDescription${index}`] && (
                                                            <div className="invalid-feedback">{errors[`subDescription${index}`]}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-md"
                                                            onClick={() => handleRemoveSubDescription(index)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="submit"
                                            className="btn btn-primary btn-sm mt-3"
                                            value="Submit"
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProjectDescription;
