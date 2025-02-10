import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddCategoryVideos = () => {
  const [formData, setFormData] = useState({
    category_id: "",
    link: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await api.get("/video-categories");
        const allCategories = categoryResponse.data;
        setCategories(allCategories); // Set all categories without filtering
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_id) {
      newErrors.category_id = "Category Name is required.";
    }
    if (!formData.link) {
      newErrors.link = "Video Link is required.";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Enter a valid URL.";
    }
    return newErrors;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/category-videos", formData);

      if (response.status === 200) {
        navigate(`/video-gallery`);
      }
    } catch (error) {
      console.error("Error uploading video link:", error);
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
              Add Category Video
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Category Video</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${
                            errors.category_id ? "is-invalid" : ""
                          }`}
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select Category Name
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category_id && (
                          <div className="invalid-feedback">
                            {errors.category_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row my-3">
                      <label className="col-form-label col-md-2">
                        Video Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="link"
                          value={formData.link}
                          className={`form-control form-control-md ${
                            errors.link ? "is-invalid" : ""
                          }`}
                          onChange={handleChange}
                          placeholder="Enter Video Link"
                        />
                        {errors.link && (
                          <div className="invalid-feedback">{errors.link}</div>
                        )}
                        <small className="form-text text-muted">
                          Note: You can add as many videos as you want to a category.
                        </small>
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

export default AddCategoryVideos;