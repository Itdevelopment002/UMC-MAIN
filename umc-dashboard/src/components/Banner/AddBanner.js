import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddBanner = () => {
  const [bannerName, setBannerName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, selectedFile: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!bannerName.trim()) {
      newErrors.bannerName = "Banner name is required.";
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Banner image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("bannerName", bannerName);

    try {
      // eslint-disable-next-line
      const response = await api.post("/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setBannerName("");
      setSelectedFile(null);
      document.getElementById("image").value = "";
      navigate("/banner");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/banner">Banner</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Banner
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Banner</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Banner Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.bannerName ? "is-invalid" : ""
                            }`}
                          value={bannerName}
                          onChange={(e) => {
                            setBannerName(e.target.value);
                            setErrors((prev) => ({ ...prev, bannerName: "" }));
                          }}
                        />
                        {errors.bannerName && (
                          <div className="invalid-feedback">
                            {errors.bannerName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Banner Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            className={`form-control ${errors.selectedFile ? "is-invalid" : ""
                              }`}
                            onChange={handleFileChange}
                          />
                          {errors.selectedFile && (
                            <div className="invalid-feedback">
                              {errors.selectedFile}
                            </div>
                          )}
                        </div>
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

export default AddBanner;
