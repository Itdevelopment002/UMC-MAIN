import React, { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddHodDetails = () => {
    const [departments, setDepartments] = useState([]);
    const [hodName, setHodName] = useState("");
    const [designation, setDesignation] = useState("");
    const [education, setEducation] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
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

        if (!hodName) {
            newErrors.hodName = "Hod name is required.";
        }
        if (!designation) {
            newErrors.designation = "Designation is required.";
        }
        if (!education) {
            newErrors.education = "Education qualification is required.";
        }
        if (!address) {
            newErrors.address = "Office address is required.";
        }
        if (!number) {
            newErrors.number = "Phone number is required.";
        }
        if (!email) {
            newErrors.email = "Email address is required.";
        }

        if (!selectedFile) {
            newErrors.selectedFile = "Hod Image is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("hodImage", selectedFile);
        formData.append("hodName", hodName);
        formData.append("designation", designation);
        formData.append("education", education);
        formData.append("address", address);
        formData.append("number", number);
        formData.append("email", email);

        try {
            // eslint-disable-next-line
            const response = await api.post("/hod-details", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setHodName("");
            setDesignation("");
            setEducation("");
            setAddress("");
            setNumber("");
            setEmail("");
            setSelectedFile(null);
            document.getElementById("hodImage").value = "";
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
                            Add Hod Details
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Add Hod Details</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Hod Name <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.hodName ? 'is-invalid' : ''}`}
                                                    value={hodName}
                                                    name="hodName"
                                                    onChange={(e) => {
                                                        setHodName(e.target.value);
                                                        setErrors((prev) => ({ ...prev, hodName: "" }));
                                                    }}
                                                />
                                                {errors.hodName && <span className="invalid-feedback">{errors.hodName}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">
                                                Designation <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <select
                                                    className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                    name="designation"
                                                    value={designation}
                                                    onChange={(e) => {
                                                        setDesignation(e.target.value);
                                                        setErrors((prev) => ({ ...prev, designation: "" }));
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select Designation
                                                    </option>
                                                    {departments.map((department) => (
                                                        <option value={department.heading} key={department.id}>
                                                            {department.heading}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.designation && (
                                                    <div className="invalid-feedback">{errors.designation}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Education Qualification <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.education ? 'is-invalid' : ''}`}
                                                    value={education}
                                                    name="education"
                                                    onChange={(e) => {
                                                        setEducation(e.target.value);
                                                        setErrors((prev) => ({ ...prev, education: "" }));
                                                    }}
                                                />
                                                {errors.education && <span className="invalid-feedback">{errors.education}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Office Address <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.address ? 'is-invalid' : ''}`}
                                                    value={address}
                                                    name="address"
                                                    onChange={(e) => {
                                                        setAddress(e.target.value);
                                                        setErrors((prev) => ({ ...prev, address: "" }));
                                                    }}
                                                />
                                                {errors.address && <span className="invalid-feedback">{errors.address}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Phone Number <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.number ? 'is-invalid' : ''}`}
                                                    value={number}
                                                    name="number"
                                                    onChange={(e) => {
                                                        setNumber(e.target.value);
                                                        setErrors((prev) => ({ ...prev, number: "" }));
                                                    }}
                                                />
                                                {errors.number && <span className="invalid-feedback">{errors.number}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">Email Address <span className="text-danger">*</span></label>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-md ${errors.email ? 'is-invalid' : ''}`}
                                                    value={email}
                                                    name="email"
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        setErrors((prev) => ({ ...prev, email: "" }));
                                                    }}
                                                />
                                                {errors.email && <span className="invalid-feedback">{errors.email}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-md-3">
                                                Hod Image <span className="text-danger">*</span>
                                            </label>
                                            <div className="col-md-4">
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="file"
                                                        id="hodImage"
                                                        name="hodImage"
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

export default AddHodDetails;
