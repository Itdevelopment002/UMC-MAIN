import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddRtsPdf = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ description: "", file: "" });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const validateForm = () => {
    const newErrors = {};
    if (!description) {
      newErrors.description = "Description is required.";
    }
    if (!file) {
      newErrors.file = "A PDF file is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("userfile", file);

    try {
      //eslint-disable-next-line
      const response = await api.post("/rts_table", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDescription("");
      setErrors({ description: "", file: "" });
      setFile(null);
      navigate("/rts");
    } catch (error) {
      console.error("Error uploading Right to Service:", error.response.data);
    }
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/rts">Right to Service</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Right to Service Pdf
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Right to Service Pdf</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder="Enter description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
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
                      <label className="col-form-label col-lg-2">
                        Upload PDF <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group">
                          <input
                            type="file"
                            id="userfile"
                            name="userfile"
                            className={`form-control form-control-md ${
                              errors.file ? "is-invalid" : ""
                            }`}
                            onChange={handleFileChange}
                          />
                        </div>
                        {errors.file && (
                          <small className="text-danger">{errors.file}</small>
                        )}
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

export default AddRtsPdf;
