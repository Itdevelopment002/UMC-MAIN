import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

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
                    <label className="col-form-label col-lg-2">
                      Policy Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-8">
                      <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={(value) => {
                          setDescription(value);
                          if (errors.description) {
                            setErrors({ ...errors, description: "" });
                          }
                        }}
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
    </div>
  );
};

export default AddHyperlinkPolicy;
