import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddDeptDescription = () => {
    const [description, setDescription] = useState("");
    const [subDescriptions, setSubDescriptions] = useState([]);
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const validationErrors = {};

        if (!description) {
            validationErrors.description = "Description is required.";
        }

        if (!department) {
            validationErrors.department = "Department name is required.";
        }

        // Check if any sub-description is empty
        subDescriptions.forEach((subDesc, index) => {
            if (!subDesc) {
                validationErrors[`subDescription${index}`] = `Sub Description ${index + 1} is required.`;
            }
        });

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/department-info");
            const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
            setDepartments(sortedData);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await api.post("/department-description", {
                department,
                description,
                subDescriptions, // Send array of sub descriptions
            });

            // Reset form fields
            setDepartment("");
            setDescription("");
            setSubDescriptions([]);
            navigate("/department-information");
        } catch (error) {
            console.error("Error adding department description:", error);
        }
    };

    // Add a new sub-description field
    const handleAddSubDescription = () => {
        setSubDescriptions([...subDescriptions, ""]);
    };

    // Update a specific sub-description
    const handleSubDescriptionChange = (index, value) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions[index] = value;
        setSubDescriptions(updatedSubDescriptions);
    };

    // Remove a sub-description field
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
                            <Link to="#">Departments</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/department-information">Department Information</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Add Department Description
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Add Department Description</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        {/* Department Name Dropdown */}
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Department Name <span className="text-danger">*</span>
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
                                                        Select Department Name
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

                                        {/* Description Input */}
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Description <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.description ? "is-invalid" : ""
                                                        }`}
                                                    placeholder="Enter Department Description"
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
                                                            className="btn btn-danger btn-sm m-t-10"
                                                            onClick={() => handleRemoveSubDescription(index)}
                                                        >
                                                            Remove
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

export default AddDeptDescription;
