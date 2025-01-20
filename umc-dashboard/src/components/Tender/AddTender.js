import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddTender = () => {
  const [newTender, setNewTender] = useState({
    description: "",
    status: "",
    pdf: null,
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({ description: "", pdf: "" });

  const validateForm = () => {
    const newErrors = {};
    if (!newTender.description) {
      newErrors.description = "Tender Description is required.";
    }
    if (!newTender.pdf) {
      newErrors.pdf = "PDF file is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    setNewTender({ ...newTender, pdf: e.target.files[0] });
  };

  const handleAddTender = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const updatedTender = {
      ...newTender,
      status: newTender.status || "-",
    };

    const formData = new FormData();
    formData.append("description", updatedTender.description);
    formData.append("status", updatedTender.status);
    if (updatedTender.pdf) {
      formData.append("pdf", updatedTender.pdf);
    }

    try {
      await api.post("/tenders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewTender({ description: "", status: "", pdf: null });
      setErrors({ description: "", pdf: "" });
      navigate("/tenders");
    } catch (error) {
      console.error("Error adding tender:", error);
      setErrors({
        ...errors,
        general: "Failed to add tender. Please try again.",
      });
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Tenders
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title m-b-0">Tenders</h4>
                    </div>
                  </div>
                  <hr />
                  <div className="card-block">
                    <form onSubmit={handleAddTender}>
                      <div className="form-group row">
                        <label
                          htmlFor="description"
                          className="col-form-label col-md-2"
                        >
                          Tender Description{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            id="description"
                            className="form-control form-control-md"
                            type="text"
                            value={newTender.description}
                            onChange={(e) => {
                              setNewTender({
                                ...newTender,
                                description: e.target.value,
                              });
                              if (errors.description) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  description: "",
                                }));
                              }
                            }}
                          />
                          {errors.description && (
                            <small className="text-danger">
                              {errors.description}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="status"
                          className="col-form-label col-md-2"
                        >
                          Status <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            id="status"
                            className="form-control form-control-md"
                            type="text"
                            value={newTender.status || "-"}
                            readOnly
                          />
                          <div className="checkbox mt-2">
                            <label>
                              <input
                                type="checkbox"
                                checked={newTender.status === "New"}
                                onChange={() => {
                                  setNewTender((prev) => ({
                                    ...prev,
                                    status: prev.status === "New" ? "-" : "New",
                                  }));
                                }}
                              />{" "}
                              Mark as New
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="pdf"
                          className="col-form-label col-lg-2"
                        >
                          Upload Tender PDF{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <div className="input-group">
                            <input
                              id="pdf"
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                handleFileChange(e);
                                if (e.target.files[0]) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    pdf: "",
                                  }));
                                }
                              }}
                              className="form-control form-control-md"
                            />
                          </div>
                          {errors.pdf && (
                            <small className="text-danger">{errors.pdf}</small>
                          )}
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-2">
                          <input
                            type="submit"
                            className="btn btn-primary btn-sm"
                            value="Submit"
                          />
                        </div>
                      </div>
                      {errors.general && (
                        <div className="text-danger">{errors.general}</div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTender;
