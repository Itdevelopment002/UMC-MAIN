import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const Initiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;
  const totalItems = initiatives.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInitiatives = initiatives.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [currentInitiatives]);

  const fetchInitiatives = async () => {
    try {
      const response = await api.get("/initiatives");
      setInitiatives(response.data);
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    }
  };

  const handleDeleteModalOpen = (initiative) => {
    setSelectedInitiative(initiative);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (initiativeId) => {
    try {
      const response = await api.get(`/initiatives/${initiativeId}`);
      const data = response.data;
      setSelectedInitiative({
        ...data,
        mainIcon: "existing",
      });
      setImagePreview(`${baseURL}/${data.main_icon_path}`);
      setShowEditModal(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching initiative:", error);
      toast.error("Failed to fetch initiative details");
    }
  };


  const handleDelete = async () => {
    try {
      await api.post(`/delete-initiatives/${selectedInitiative.id}`);
      setInitiatives(
        initiatives.filter((initiative) => initiative.id !== selectedInitiative.id)
      );
      setShowDeleteModal(false);
      toast.success("Initiative deleted successfully");
    } catch (error) {
      console.error("Error deleting initiative:", error);
      toast.error("Failed to delete initiative");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedInitiative(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setImagePreview(null);
    setSelectedInitiative(null);
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!selectedInitiative?.heading) newErrors.heading = "Initiative Heading is required";
    if (!selectedInitiative?.link) newErrors.link = "Initiative Link is required";
    if (!selectedInitiative?.language_code) newErrors.language_code = "Language selection is required";
    if (!selectedInitiative?.mainIcon) {
      newErrors.mainIcon = "Initiative Image is required";
    } else if (selectedInitiative.mainIcon instanceof File) {
      const imageError = getImageValidationError(selectedInitiative.mainIcon);
      if (imageError) {
        newErrors.mainIcon = imageError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      if (errors.mainIcon) {
        toast.error("Please fix image errors before submitting", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Please fill all required fields correctly", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return;
    }

    const formData = new FormData();
    formData.append("heading", selectedInitiative.heading);
    formData.append("link", selectedInitiative.link);
    formData.append("language_code", selectedInitiative.language_code);

    if (selectedInitiative.mainIcon instanceof File) {
      formData.append("mainIcon", selectedInitiative.mainIcon);
    }

    try {
      await api.post(`/edit-initiatives/${selectedInitiative.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchInitiatives();
      setShowEditModal(false);
      toast.success("Initiative updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
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
          error.response?.data?.message || "Failed to add initiative. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error adding initiative:", error);
    }
  };

  const handleFileChange = (e) => {
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

      setSelectedInitiative((prev) => ({ ...prev, mainIcon: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, mainIcon: "" }));
    } else {
      setSelectedInitiative((prev) => ({ ...prev, mainIcon: "" }));
      setImagePreview(null);
      setErrors((prev) => ({ ...prev, mainIcon: "Initiative Image is required" }));
    }
  };


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
                Initiatives-Programme
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Initiatives-Programme</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-initiatives"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Initiative
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Initiative Heading</th>
                          <th>Initiative Link</th>
                          <th className="text-center">Initiative Icon</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInitiatives.map((initiative, index) => (
                          <tr key={initiative.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{initiative.heading}</td>

                            <td>
                              <Link to={initiative.link} target="_blank" className="text-decoration-none" style={{ color: "#000" }}>
                                {initiative.link}
                              </Link>
                            </td>
                            <td className="text-center">
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
                    <h5 className="modal-title">Edit Initiatives-Programme</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.language_code ? "is-invalid" : ""}`}
                          value={selectedInitiative?.language_code || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              language_code: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && <div className="invalid-feedback">{errors.language_code}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Initiative Heading <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.heading ? "is-invalid" : ""}`}
                          placeholder="Initiative Heading"
                          value={selectedInitiative?.heading || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              heading: e.target.value,
                            })
                          }
                        />
                        {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Initiative Link <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.link ? "is-invalid" : ""}`}
                          placeholder="Initiative Link"
                          value={selectedInitiative?.link || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              link: e.target.value,
                            })
                          }
                        />
                        {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Initiative Icon
                        </label>
                        <input
                          type="file"
                          className={`form-control ${errors.mainIcon ? "is-invalid" : ""}`}
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        {errors.mainIcon && <div className="invalid-feedback">{errors.mainIcon}</div>}
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="preview"
                          width="70"
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

export default Initiatives;