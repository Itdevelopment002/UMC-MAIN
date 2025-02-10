import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddProjectImages = () => {
  const [formData, setFormData] = useState({
    category_id: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await api.get("/project-categories");
        const allCategories = categoryResponse.data;
        const filteredCategories = [];

        for (let category of allCategories) {
          const imageResponse = await api.get(`/project-images/${category.id}`);
          const categoryImages = imageResponse.data;

          if (categoryImages.length < 8) {
            filteredCategories.push(category);
          }
        }

        setCategories(filteredCategories);
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

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_id) {
      newErrors.category_id = "Project Heading is required.";
    }
    if (!formData.image) {
      newErrors.image = "Project Image is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("category_id", formData.category_id);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await api.post("/project-images", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        navigate(`/pproject-details`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Upcoming Projects</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/photo-gallery">Project Details</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Project Images
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Project Images</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Project Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.category_id ? "is-invalid" : ""
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
                        Project Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          className={`form-control form-control-md ${errors.image ? "is-invalid" : ""}`}
                          onChange={handleFileChange}
                        />
                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
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

export default AddProjectImages;
