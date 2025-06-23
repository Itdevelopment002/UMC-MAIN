import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";

const AddHyperlinkPolicy = () => {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({ description: "", language: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!description || description === "<p><br></p>") {
      newErrors.description = "Policy Description is required.";
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

    const formData = {
      description,
      language_code: language,
    };

    try {
      const response = await api.post("/hyperlink-policy", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setDescription("");
        setLanguage("");
        setErrors({ description: "", language: "" });
        navigate("/hyperlink-policy");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add hyperlink policy. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding hyperlink policy:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="#">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/hyperlink-policy">Hyperlink Policy</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Hyperlink Policy
          </li>
        </ol>

        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <div className="row">
                  <div className="col-12">
                    <h4 className="page-title">Add Hyperlink Policy</h4>
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
                        <div className="invalid-feedback">{errors.language}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Policy Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <textarea
                        className="form-control"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (errors.description) {
                            setErrors({ ...errors, description: "" });
                          }
                        }}
                        rows={5} // You can adjust the height
                      />
                      {errors.description && (
                        <small className="text-danger">{errors.description}</small>
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
  );
};

export default AddHyperlinkPolicy;
