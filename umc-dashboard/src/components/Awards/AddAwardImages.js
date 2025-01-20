import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddAwardImages = () => {
  const [formData, setFormData] = useState({
    awardImage: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      awardImage: files[0],
    }));

    if (errors.awardImage) {
      setErrors((prev) => ({ ...prev, awardImage: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.awardImage) {
      newErrors.awardImage = "Award image is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append("awardImage", formData.awardImage);

    try {
      // eslint-disable-next-line
      const response = await api.post("/award-images", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/awards");
    } catch (error) {
      console.error("Image upload failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#.">About KBMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/awards">Awards</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Award Image
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Award Image</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload Award Image{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="awardImage"
                          name="awardImage"
                          className={`form-control form-control-md ${
                            errors.awardImage ? "is-invalid" : ""
                          }`}
                          onChange={handleChange}
                          accept="image/*"
                        />
                        {errors.awardImage && (
                          <div className="invalid-feedback">
                            {errors.awardImage}
                          </div>
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

export default AddAwardImages;
