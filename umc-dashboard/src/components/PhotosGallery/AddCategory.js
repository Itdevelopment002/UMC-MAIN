import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setCategoryName(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category Name is required.");
      return;
    }

    try {
      await api.post("/categories", { categoryName });
      navigate("/photo-gallery");
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
              <Link to="/photo-gallery">Photo Gallery</Link>
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
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Category</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                       <input
                          type="text"
                          className={`form-control form-control-md ${
                            error ? "is-invalid" : ""
                          }`}
                          name="categoryName"
                          value={categoryName}
                          onChange={handleChange}
                          placeholder="Enter Category Name"
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
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

export default AddCategory;
