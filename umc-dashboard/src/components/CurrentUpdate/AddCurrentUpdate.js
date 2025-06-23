import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify"

const AddCurrentUpdate = () => {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ description: "" });
  const validateForm = () => {
    const newErrors = {};
    if (!description) {
      newErrors.description = "Description is required";
    }

    if (!language) {
      newErrors.language = "Language selection is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post(
        "/current-update",
        {
          description: description,
          language_code: language,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setErrors({ description: "", language: "" });

      if (response.status === 200) {
        navigate("/current-update");
      } else {
        console.error("Failed to add updates");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.errors
      ) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to add current update:. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error adding current update:", error);
    }
    // setDescription("");
    // setLanguage("");
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/current-update">Current Update</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Current Update
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Current Update</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""}`}
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
                        {errors.language && (
                          <small className="text-danger">
                            {errors.language}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          className={`form-control form-control-md ${errors.description ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Description"
                          value={description}
                          rows="3"
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
        <ToastContainer />
      </div>
    </>
  );
};

export default AddCurrentUpdate;
