import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddDevelopmentPdf = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ name: "", image: "", pdf: "" });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setImage(file);
      if (errors.image) setErrors({ ...errors, image: "" });
    } else if (type === "pdf") {
      setPdf(file);
      if (errors.pdf) setErrors({ ...errors, pdf: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.description = "Name is required";
    }
    if (!image) {
      newErrors.image = "Image file is required";
    }
    if (!pdf) {
      newErrors.pdf = "PDF file is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("pdf", pdf);

    try {
      //eslint-disable-next-line
      const response = await api.post("/development-plan-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImage(null);
      setPdf(null);
      setErrors({ name: "", image: "", pdf: "" });

      document.getElementById("imageInput").value = null;
      document.getElementById("pdfInput").value = null;

      navigate("/development-plan");
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/development-plan">Development Plan</Link>
          </li>
          <li className="breadcrumb-item active">Add Development Pdf</li>
        </ol>
        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-4 col-3">
                    <h4 className="page-title">Add Development Pdf</h4>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && (
                        <small className="text-danger">{errors.name}</small>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Upload Image <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.image ? "is-invalid" : ""
                        }`}
                        accept="image/*"
                        id="imageInput"
                        onChange={(e) => handleFileChange(e, "image")}
                      />
                      {errors.image && (
                        <small className="text-danger">{errors.image}</small>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Upload PDF <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.pdf ? "is-invalid" : ""
                        }`}
                        accept="application/pdf"
                        id="pdfInput"
                        onChange={(e) => handleFileChange(e, "pdf")}
                      />
                      {errors.pdf && (
                        <small className="text-danger">{errors.pdf}</small>
                      )}
                    </div>
                  </div>
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-sm btn-primary"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDevelopmentPdf;
