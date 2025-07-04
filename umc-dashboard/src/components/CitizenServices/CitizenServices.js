import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const CitizeServices = () => {
  const [citzenServices, setCitizenServices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const itemsPerPage = 10;
  const totalItems = citzenServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = citzenServices.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [currentServices]);

  const fetchServices = async () => {
    try {
      const response = await api.get("/citizen-services");
      setCitizenServices(response.data);
    } catch (error) {
      console.error("Error fetching citizen services details:", error);
    }
  };

  const handleDeleteModalOpen = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (serviceId) => {
    try {
      const response = await api.get(`/citizen-services/${serviceId}`);
      setSelectedService({
        ...response.data,
        mainIcon: "existing",
      });
      setImagePreview(`${baseURL}/${response.data.main_icon_path}`);
      setShowEditModal(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching citizen service:", error);
      toast.error("Failed to fetch citizen service details");
    }
  };


  const handleDelete = async () => {
    try {
      await api.post(`/delete-citizen-services/${selectedService.id}`);
      setCitizenServices(
        citzenServices.filter((service) => service.id !== selectedService.id)
      );
      setShowDeleteModal(false);
      toast.success("Citizen service deleted successfully");
    } catch (error) {
      console.error("Error deleting citizen service:", error);
      toast.error("Failed to delete citizen service");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedService?.service_heading) {
      newErrors.serviceHeading = "Service Heading is required.";
    }

    if (!selectedService?.service_link) {
      newErrors.serviceLink = "Service Link is required.";
    }

    if (!selectedService?.language_code) {
      newErrors.language = "Language Selection is required.";
    }

    if (!selectedService?.mainIcon) {
      newErrors.mainIcon = "Service Image is required";
    } else if (selectedService.mainIcon instanceof File) {
      const imageError = getImageValidationError(selectedService.mainIcon);
      if (imageError) {
        newErrors.mainIcon = imageError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleFileChange = (e, field) => {
    const file = e.target.files[0];

    if (file) {
      const errorMessage = getImageValidationError(file);

      if (errorMessage) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setErrors({ ...errors, mainIcon: errorMessage });
        return;
      }

      setSelectedService(prevService => ({ ...prevService, [field]: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, mainIcon: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedService(prevService => ({ ...prevService, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.error("Please fix form errors before submitting", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("serviceHeading", selectedService.service_heading);
    formData.append("serviceLink", selectedService.service_link);
    formData.append("language_code", selectedService.language_code);

    if (selectedService.mainIcon instanceof File) {
      formData.append("mainIcon", selectedService.mainIcon);
    }

    try {
      const response = await api.post(`/edit-citizen-services/${selectedService.id}`, formData);
      if (response.status === 200 || response.status === 201) {
        fetchServices();
        setShowEditModal(false);
        toast.success("Citizen service updated successfully", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update citizen service. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error updating citizen service:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Citizen Services
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title"> Citizen Services</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-citizen-services"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Citizen Service
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Service Heading</th>
                          <th>Service Link</th>
                          <th className="text-center">Service Icon</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentServices.map((service, index) => (
                          <tr key={service.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{service.service_heading}</td>
                            <td>
                              <Link to={service.service_link.startsWith("/") ? "#" : `${service.service_link}`} className="text-decoration-none" target={service.service_link.startsWith("/") ? "" : "_blank"} style={{ color: "#000" }}>
                                {service.service_link}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}/${service.main_icon_path}`}
                                className="glightbox"
                                data-gallery="slider-images"
                              >
                                <img
                                  width="35px"
                                  src={`${baseURL}/${service.main_icon_path}`}
                                  alt={service.service_heading}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(service.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(service)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="pagination mt-4">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {currentPage > 2 && (
                    <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>
                        1
                      </button>
                    </li>
                  )}
                  {currentPage > 3 && (
                    <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(2)}>
                        2
                      </button>
                    </li>
                  )}
                  {currentPage > 4 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page >= currentPage - 1 && page <= currentPage + 1
                    )
                    .map((page) => (
                      <li
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                        key={page}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  {currentPage < totalPages - 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {currentPage < totalPages - 2 && (
                    <li
                      className={`page-item ${currentPage === totalPages - 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages - 1)}
                      >
                        {totalPages - 1}
                      </button>
                    </li>
                  )}
                  {currentPage < totalPages - 1 && (
                    <li
                      className={`page-item ${currentPage === totalPages ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {showDeleteModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer justify-content-right">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditModal && selectedService && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Service</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.language ? 'is-invalid' : ''}`}
                          value={selectedService.language_code || ""}
                          name="language_code"
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Service Heading <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.serviceHeading ? 'is-invalid' : ''}`}
                          placeholder="Service Heading"
                          value={selectedService.service_heading || ""}
                          name="service_heading"
                          onChange={handleInputChange}
                        />
                        {errors.serviceHeading && <div className="invalid-feedback">{errors.serviceHeading}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Service Link <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.serviceLink ? 'is-invalid' : ''}`}
                          placeholder="Service Link"
                          value={selectedService.service_link || ""}
                          name="service_link"
                          onChange={handleInputChange}
                        />
                        {errors.serviceLink && <div className="invalid-feedback">{errors.serviceLink}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Service Icon
                        </label>
                        <input
                          type="file"
                          className={`form-control ${errors.mainIcon ? 'is-invalid' : ''}`}
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                          ref={fileInputRef}
                        />
                        {errors.mainIcon && <div className="invalid-feedback">{errors.mainIcon}</div>}
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="preview"
                          width="100"
                          className="mt-2"
                        />
                      )}
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseEditModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CitizeServices;