import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddTourism = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [language, setLanguage] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = "Site Name is required.";
    }
    if (!address.trim()) {
      validationErrors.address = "Site Address is required.";
    }
    if (!hours.trim()) {
      validationErrors.hours = "Open Hours are required.";
    }
    if (!description.trim()) {
      validationErrors.description = "Site Description is required.";
    }
    if (!locationLink.trim()) {
      validationErrors.locationLink = "Location link is required.";
    }
    if (!language.trim()) {
      validationErrors.language = "Language selection is required";
    }
    if (!mainImage) {
      validationErrors.mainImage = "Site Main Image is required.";
    }
    if (galleryImages.length === 0) {
      validationErrors.galleryImages = "Please upload at least one site image.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("hours", hours);
    formData.append("description", description);
    formData.append("locationLink", locationLink);
    formData.append("language_code", language);
    formData.append("main_image", mainImage);
    galleryImages.forEach((image) => {
      formData.append("gallery", image);
    });

    try {
      // eslint-disable-next-line
      const response = await api.post("/tourism", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/tourism");
    } catch (error) {
      console.error("Error adding tourism site:", error);
      alert("Failed to add tourism site. Please try again.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (errors.address) {
      setErrors((prevErrors) => ({ ...prevErrors, address: "" }));
    }
  };

  const handleHoursChange = (e) => {
    setHours(e.target.value);
    if (errors.hours) {
      setErrors((prevErrors) => ({ ...prevErrors, hours: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
  };

  const handleLocationLinkChange = (e) => {
    setLocationLink(e.target.value);
    if (errors.locationLink) {
      setErrors((prevErrors) => ({ ...prevErrors, locationLink: "" }));
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (errors.language) {
      setErrors((prevErrors) => ({ ...prevErrors, language: "" }));
    }
  };

  const handleMainImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(selectedFile.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, mainImage: "" }));
      setMainImage(selectedFile);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mainImage: "Only JPEG, PNG, JPG, or WEBP formats are allowed." }));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)
    );

    if (validImages.length !== selectedFiles.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        galleryImages: "Only JPEG, PNG, JPG, or WEBP formats are allowed.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        galleryImages: "",
      }));
      setGalleryImages(validImages);
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
              <Link to="/tourism">Tourism</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Tourism
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Add Tourism</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""}`}
                          value={language}
                          onChange={handleLanguageChange}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Site Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.name ? "is-invalid" : ""}`}
                          value={name}
                          onChange={handleNameChange}
                          placeholder="Enter Site Name"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Site Address <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.address ? "is-invalid" : ""}`}
                          value={address}
                          onChange={handleAddressChange}
                          placeholder="Enter Site Address"
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Open Hours <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.hours ? "is-invalid" : ""}`}
                          value={hours}
                          onChange={handleHoursChange}
                          placeholder="Enter Open Hours"
                        />
                        {errors.hours && <div className="invalid-feedback">{errors.hours}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Site Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <textarea
                          rows={2}
                          className={`form-control form-control-md ${errors.description ? "is-invalid" : ""}`}
                          value={description}
                          onChange={handleDescriptionChange}
                          placeholder="Enter Site Description"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Location Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="url"
                          className={`form-control form-control-md ${errors.locationLink ? "is-invalid" : ""}`}
                          value={locationLink}
                          onChange={handleLocationLinkChange}
                          placeholder="Enter Location Link"
                        />
                        {errors.locationLink && <div className="invalid-feedback">{errors.locationLink}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Site Main Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="file"
                          className={`form-control ${errors.mainImage ? "is-invalid" : ""}`}
                          onChange={handleMainImageChange}
                          accept="image/*"
                        />
                        {errors.mainImage && <div className="invalid-feedback">{errors.mainImage}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Site Images <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="file"
                          className={`form-control ${errors.galleryImages ? "is-invalid" : ""}`}
                          multiple
                          onChange={handleGalleryImagesChange}
                          accept="image/*"
                        />
                        {errors.galleryImages && <div className="invalid-feedback">{errors.galleryImages}</div>}
                      </div>
                    </div>
                    <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
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

export default AddTourism;
