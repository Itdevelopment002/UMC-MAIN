import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

const AddAsstCommissionerData = () => {
  const [formData, setFormData] = useState({
    coName: "",
    designation: "",
    qualification: "",
    address: "",
    number: "",
    email: "",
    description: "",
    language_code: "",
    coImage: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, coImage: e.target.files[0] });
    setErrors({ ...errors, coImage: "" });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    setErrors({ ...errors, description: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.coName.trim()) newErrors.coName = "Commissioner Name is required.";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required.";
    if (!formData.qualification.trim())
      newErrors.qualification = "Education Qualification is required.";
    if (!formData.address.trim()) newErrors.address = "Office Address is required.";
    if (!formData.number.trim()) newErrors.number = "Phone Number is required.";
    if (!formData.language_code.trim()) newErrors.language_code = "Language Selection is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email Id is required.";
    }
    if (!formData.coImage) newErrors.coImage = "Commissioner Image is required.";
    if (!formData.description || formData.description === "<p><br></p>") {
      newErrors.description = "Commissioner Description is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("coName", formData.coName);
    data.append("designation", formData.designation);
    data.append("qualification", formData.qualification);
    data.append("address", formData.address);
    data.append("number", formData.number);
    data.append("email", formData.email);
    data.append("description", formData.description);
    data.append("language_code", formData.language_code);
    if (formData.coImage) data.append("coImage", formData.coImage);

    try {
      const response = await api.post("/asst-commissioner-data", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        navigate("/assistant-commissioner");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">About UMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/assistant-commissioner">Assistant Commissioner</Link>
            </li>
            <li className="breadcrumb-item active">Add Assistant Commissioner Data</li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <h4 className="page-title">Add Assistant Commissioner Data</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <select
                        className={`form-control ${errors.language_code ? "is-invalid" : ""
                          }`}
                        name="language_code"
                        value={formData.language_code}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Language</option>
                        <option value="en">English</option>
                        <option value="mr">Marathi</option>
                      </select>
                      {errors.language_code && (
                        <div className="invalid-feedback">{errors.language_code}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Commissioner Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.coName ? "is-invalid" : ""
                          }`}
                        name="coName"
                        value={formData.coName}
                        onChange={handleChange}
                        placeholder="Enter Commissioner Name"
                      />
                      {errors.coName && (
                        <div className="invalid-feedback">{errors.coName}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Designation <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.designation ? "is-invalid" : ""
                          }`}
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Enter Designation"
                      />
                      {errors.designation && (
                        <div className="invalid-feedback">
                          {errors.designation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Education Qualification <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.qualification ? "is-invalid" : ""
                          }`}
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="Enter Qualification"
                      />
                      {errors.qualification && (
                        <div className="invalid-feedback">
                          {errors.qualification}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Office Address <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.address ? "is-invalid" : ""
                          }`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.number ? "is-invalid" : ""
                          }`}
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                      />
                      {errors.number && (
                        <div className="invalid-feedback">{errors.number}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${errors.email ? "is-invalid" : ""
                          }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Commissioner Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-8">
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter Description"
                        className={`form-control ${errors.description ? "is-invalid" : ""
                          }`}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ align: [] }],
                            [{ color: [] }, { background: [] }],
                            [{ font: [] }],
                            ["link", "image"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "bold", "italic", "underline", "strike",
                          "list", "bullet",
                          "align", "color", "background",
                          "font", "link", "image"
                        ]}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3 col-lg-3">
                      Commissioner Image <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="file"
                        className={`form-control ${errors.coImage ? "is-invalid" : ""
                          }`}
                        accept="image/*"
                        name="coImage"
                        onChange={handleFileChange}
                      />
                      {errors.coImage && (
                        <div className="invalid-feedback">{errors.coImage}</div>
                      )}
                      <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAsstCommissionerData;
