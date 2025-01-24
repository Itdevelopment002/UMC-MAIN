import React, { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddDepartmentBanner = () => {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setErrors((prev) => ({ ...prev, selectedFile: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!departmentName) {
            newErrors.departmentName = "Department name is required.";
        }

        if (!selectedFile) {
            newErrors.selectedFile = "Department Banner is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("bannerImage", selectedFile);
        formData.append("departmentName", departmentName);

        try {
            // eslint-disable-next-line
            const response = await api.post("/department-banner", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setDepartmentName("");
            setSelectedFile(null);
            document.getElementById("bannerImage").value = "";
            navigate("/department-information");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
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
                            Add Department Banner
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Add Department Banner</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-2">
                                                Department Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
                                                    name="departmentName"
                                                    value={departmentName}
                                                    onChange={(e) => {
                                                        setDepartmentName(e.target.value);
                                                        setErrors((prev) => ({ ...prev, departmentName: "" }));
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select Department Name
                                                    </option>
                                                    {departments.map((department) => (
                                                        <option value={department.heading} key={department.id}>
                                                            {department.heading}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.departmentName && (
                                                    <div className="invalid-feedback">{errors.departmentName}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-2">
                                                Banner Image <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="file"
                                                        id="bannerImage"
                                                        name="bannerImage"
                                                        className={`form-control ${errors.selectedFile ? "is-invalid" : ""
                                                            }`}
                                                        onChange={handleFileChange}
                                                    />
                                                    {errors.selectedFile && (
                                                        <div className="invalid-feedback">
                                                            {errors.selectedFile}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="submit"
                                            className="btn btn-primary btn-sm"
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

export default AddDepartmentBanner;
