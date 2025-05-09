import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddHistoryImage = () => {
  const [photoName, setPhotoName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!photoName.trim()) {
      newErrors.photoName = "Image name is required.";
    }
    if (!selectedFile) {
      newErrors.selectedFile = "Please select a file to upload.";
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
    formData.append("image", selectedFile);
    formData.append("photoName", photoName);

    try {
      //eslint-disable-next-line
      const response = await api.post("/history-img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPhotoName("");
      setSelectedFile(null);
      document.getElementById("image").value = "";

      navigate("/history");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">About UMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/history">History</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add History Image
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add History Image</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Image Name{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.photoName ? "is-invalid" : ""
                            }`}
                          placeholder=""
                          value={photoName}
                          onChange={(e) => {
                            setPhotoName(e.target.value);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              photoName: "",
                            }));
                          }}
                        />
                        {errors.photoName && (
                          <div className="invalid-feedback">
                            {errors.photoName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Upload Image{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          name="image"
                          className={`form-control col-md-12 col-xs-12 userfile ${errors.selectedFile ? "is-invalid" : ""
                            }`}
                          onChange={(e) => {
                            handleFileChange(e);
                            if (e.target.files[0]) {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                selectedFile: "",
                              }));
                            }
                          }}
                        />
                        {errors.selectedFile && (
                          <div className="invalid-feedback">
                            {errors.selectedFile}
                          </div>
                        )}
                        <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-sm btn-primary"
                      value="Upload"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddHistoryImage;
