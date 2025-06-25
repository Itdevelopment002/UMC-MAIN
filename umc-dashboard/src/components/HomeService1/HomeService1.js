import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const HomeService1 = () => {
  const [info, setInfo] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const infoPerPage = 10;

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const response = await api.get("/home-services1");
      setInfo(response.data);
    } catch (error) {
      console.error("Error fetching home services:", error);
    }
  };

  const handleDeleteModalOpen = (initiative) => {
    setSelectedInitiative(initiative);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (initiativeId) => {
    try {
      const response = await api.get(`/home-services1/${initiativeId}`);
      setSelectedInitiative(response.data);
      setImagePreview(`${baseURL}/${response.data.main_icon_path}`);
      setErrors({});
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching home services:", error);
      toast.error("Failed to fetch home services details");
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-home-services1/${selectedInitiative.id}`);
      setInfo(
        info.filter((initiative) => initiative.id !== selectedInitiative.id)
      );
      setShowDeleteModal(false);
      toast.success("Home Service deleted successfully");
    } catch (error) {
      console.error("Error deleting home services:", error);
      toast.error("Failed to delete home services");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedInitiative(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedInitiative(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedInitiative?.heading) newErrors.heading = "Service Heading is required.";
    if (!selectedInitiative?.link) newErrors.link = "Service Link is required.";
    if (!selectedInitiative?.language_code) newErrors.language_code = "Language selection is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.error("Please fix errors before submitting.");
      return;
    }
    if (errors.heading || errors.link || errors.mainIcon || errors.language_code) {
      toast.error("Please fix errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", selectedInitiative.heading);
    formData.append("link", selectedInitiative.link);
    formData.append("language_code", selectedInitiative.language_code);
    if (selectedInitiative.mainIcon) {
      formData.append("mainIcon", selectedInitiative.mainIcon);
    }

    try {
      await api.post(`/edit-home-services1/${selectedInitiative.id}`, formData);
      fetchInitiatives();
      setShowEditModal(false);
      toast.success("Home Service updated successfully");
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
          error.response?.data?.message || "Failed to update home service. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error updating home service:", error);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const errorMessage = getImageValidationError(file);
      if (errorMessage) {
        setErrors({ ...errors, [field]: errorMessage });
        return;
      }

      setSelectedInitiative((prevInitiative) => ({ ...prevInitiative, [field]: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInitiative({
      ...selectedInitiative,
      [name]: value
    });
    setErrors({ ...errors, [name]: "" });
  };

  const indexOfLastServices = currentPage * infoPerPage;
  const indexOfFirstServices = indexOfLastServices - infoPerPage;
  const currentServices = info.slice(indexOfFirstServices, indexOfLastServices);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [info, currentServices]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Home Service 1
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-6">
                      <h4 className="page-title">Home Service 1</h4>
                    </div>
                    <div className="col-sm-8 col-6 text-right m-b-20">
                      <Link
                        to="/add-home-services1"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Service
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
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentServices.map((initiative, index) => (
                          <tr key={initiative.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * infoPerPage}
                            </td>
                            <td>{initiative.heading}</td>
                            <td>
                              <Link to={initiative.link.startsWith("/") ? "#" : `${initiative.link}`} className="text-decoration-none" target={initiative.link.startsWith("/") ? "" : "_blank"} style={{ color: "#000" }}>
                                {initiative.link}
                              </Link>
                            </td>
                            <td style={{ backgroundColor: "black" }} className="text-center">
                              <Link
                                to={`${baseURL}/${initiative.main_icon_path}`}
                                className="glightbox"
                                data-gallery="initiative-images"
                              >
                                <img
                                  width="35px"
                                  src={`${baseURL}/${initiative.main_icon_path}`}
                                  alt={initiative.heading}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(initiative.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(initiative)}
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
                <div className="mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {currentPage > 2 && (
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                    )}
                    {currentPage > 3 && (
                      <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(2)}>
                          2
                        </button>
                      </li>
                    )}
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {Array.from(
                      { length: Math.ceil(info.length / infoPerPage) },
                      (_, i) => i + 1
                    )
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
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage) - 1)
                          }
                        >
                          {Math.ceil(info.length / infoPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage))
                          }
                        >
                          {Math.ceil(info.length / infoPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
                        ? "disabled"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
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

          {showEditModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Home Service 1</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.language_code ? 'is-invalid' : ''}`}
                          value={selectedInitiative?.language_code || ""}
                          name="language_code"
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && <div className="invalid-feedback">{errors.language_code}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Service Heading <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                          placeholder="Service Heading"
                          value={selectedInitiative?.heading || ""}
                          name="heading"
                          onChange={handleInputChange}
                        />
                        {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Service Link <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                          placeholder="Service Link"
                          value={selectedInitiative?.link || ""}
                          name="link"
                          onChange={handleInputChange}
                        />
                        {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Service Icon
                        </label>
                        <input
                          type="file"
                          className={`form-control ${errors.mainIcon ? 'is-invalid' : ''}`}
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                        />
                        {errors.mainIcon && <div className="invalid-feedback">{errors.mainIcon}</div>}
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            width="100px"
                            style={{ backgroundColor: "#000" }}
                            className="mt-2"
                          />
                        )}
                      </div>
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

export default HomeService1;