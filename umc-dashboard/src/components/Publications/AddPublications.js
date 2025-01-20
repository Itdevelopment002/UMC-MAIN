import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddPublications = () => {
  const [publicationName, setPublicationName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, selectedFile: "" }));
  };

  const handlePDFChange = (e) => {
    setSelectedPDF(e.target.files[0]);
    setErrors((prev) => ({ ...prev, selectedPDF: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!publicationName.trim()) {
      newErrors.publicationName = "Publication name is required.";
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Image file is required.";
    }

    if (!selectedPDF) {
      newErrors.selectedPDF = "PDF file is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("pdf", selectedPDF);
    formData.append("publicationName", publicationName);

    try {
      await api.post("/publications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPublicationName("");
      setSelectedFile(null);
      setSelectedPDF(null);
      document.getElementById("image").value = "";
      document.getElementById("pdf").value = "";
      navigate("/official-publications");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/official-publications">Official Publications</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Official Publication
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Official Publication</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Publication Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.publicationName ? "is-invalid" : ""
                          }`}
                          value={publicationName}
                          onChange={(e) => {
                            setPublicationName(e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              publicationName: "",
                            }));
                          }}
                        />
                        {errors.publicationName && (
                          <div className="invalid-feedback">
                            {errors.publicationName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          className={`form-control ${
                            errors.selectedFile ? "is-invalid" : ""
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
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload PDF <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="pdf"
                          name="pdf"
                          className={`form-control ${
                            errors.selectedPDF ? "is-invalid" : ""
                          }`}
                          onChange={handlePDFChange}
                        />
                        {errors.selectedPDF && (
                          <div className="invalid-feedback">
                            {errors.selectedPDF}
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
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

export default AddPublications;
