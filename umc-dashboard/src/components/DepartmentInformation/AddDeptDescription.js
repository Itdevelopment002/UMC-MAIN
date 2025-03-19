import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaTrash } from "react-icons/fa";

const AddDeptDescription = () => {
    const [description, setDescription] = useState("");
    const [subDescriptions, setSubDescriptions] = useState([]);
    const [language, setLanguage] = useState("");
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));


    const validateForm = () => {
        const validationErrors = {};

        if (!description) {
            validationErrors.description = "Department description is required.";
        }

        if (!department) {
            validationErrors.department = "Department name is required.";
        }

        if (!language) {
            validationErrors.language = "Language selection is required";
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
                const response = await api.get("/department-info");
                const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
                if (userData.role === "Superadmin") {
                    setDepartments(sortedData);
                } else {
                    const userPermissions = userData?.permission?.split(",").map(perm => perm.trim());
                    const filteredData = sortedData.filter(item => userPermissions.includes(item.heading));
                    setDepartments(filteredData);
                }
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
            await api.post("/department-description", {
                department,
                description,
                language_code: language,
                subDescriptions,
            });

            setDepartment("");
            setDescription("");
            setLanguage("");
            setSubDescriptions([]);
            navigate("/department-information");
        } catch (error) {
            console.error("Error adding department description:", error);
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
                                        <div className="col-12">
                                            <h4 className="page-title">Add Department Description</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">
                                                Select Language <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control form-control-md ${errors.language ? "is-invalid" : ""
                                                        }`}
                                                    value={language}
                                                    onChange={(e) => {
                                                        setLanguage(e.target.value);
                                                        if (errors.language) {
                                                            setErrors({ ...errors, language: "" });
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">
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
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">
                                                Department Description <span className="text-danger">*</span>
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
                                                    <label className="col-form-label col-md-3">
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

export default AddDeptDescription;
