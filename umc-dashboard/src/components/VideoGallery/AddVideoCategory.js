import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddVideoCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryName") setCategoryName(value);
    if (name === "language") setLanguage(value);

    setErrors({ categoryName: "", language: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category Name is required.";
    }

    if (!language.trim()) {
      newErrors.language = "Language Selection is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/video-categories", { categoryName, language_code: language });
      navigate("/video-gallery");
    } catch (error) {
      console.error("Error submitting category data:", error);
    }
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Gallery</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/video-gallery">Video Gallery</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Category
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Category</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""
                            }`}
                          name="language"
                          value={language}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.categoryName ? "is-invalid" : ""
                            }`}
                          name="categoryName"
                          value={categoryName}
                          onChange={handleChange}
                          placeholder="Enter Category Name"
                        />
                        {errors.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
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

export default AddVideoCategory;
