import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddTourism = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = "Name is required.";
    }
    if (!address.trim()) {
      validationErrors.address = "Address is required.";
    }
    if (!hours.trim()) {
      validationErrors.hours = "Hours are required.";
    }
    if (!description.trim()) {
      validationErrors.description = "Description is required.";
    }
    if (!locationLink.trim()) {
      validationErrors.locationLink = "Location link is required.";
    }
    if (!mainImage) {
      validationErrors.mainImage = "Main image is required.";
    }
    if (galleryImages.length === 0) {
      validationErrors.galleryImages = "Please upload at least one gallery image.";
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
    formData.append("main_image", mainImage);
    galleryImages.forEach((image) => {
      formData.append("gallery", image);
    });

    try {
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
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Tourism</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.name ? "is-invalid" : ""}`}
                          value={name}
                          onChange={handleNameChange}
                          placeholder="Tourism Site Name"
                        />
                        {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Address <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.address ? "is-invalid" : ""}`}
                          value={address}
                          onChange={handleAddressChange}
                          placeholder="Address"
                        />
                        {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Hours <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.hours ? "is-invalid" : ""}`}
                          value={hours}
                          onChange={handleHoursChange}
                          placeholder="Operating Hours"
                        />
                        {errors.hours && <div className="text-danger mt-1">{errors.hours}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <textarea
                          className={`form-control form-control-md ${errors.description ? "is-invalid" : ""}`}
                          value={description}
                          onChange={handleDescriptionChange}
                          placeholder="Description"
                        />
                        {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Location Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="url"
                          className={`form-control form-control-md ${errors.locationLink ? "is-invalid" : ""}`}
                          value={locationLink}
                          onChange={handleLocationLinkChange}
                          placeholder="Location Link"
                        />
                        {errors.locationLink && <div className="text-danger mt-1">{errors.locationLink}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Main Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="file"
                          className={`form-control ${errors.mainImage ? "is-invalid" : ""}`}
                          onChange={handleMainImageChange}
                          accept="image/*"
                        />
                        {errors.mainImage && <div className="text-danger mt-1">{errors.mainImage}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Gallery Images <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="file"
                          className={`form-control ${errors.galleryImages ? "is-invalid" : ""}`}
                          multiple
                          onChange={handleGalleryImagesChange}
                          accept="image/*"
                        />
                        {errors.galleryImages && <div className="text-danger mt-1">{errors.galleryImages}</div>}
                      </div>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
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
