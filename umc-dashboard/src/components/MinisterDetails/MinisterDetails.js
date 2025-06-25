//minister
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";
import { getImageValidationError } from "../../validation/ImageValidation";

const MinisterDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMinister, setSelectedMinister] = useState(null);
  const [ministers, setMinisters] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    designation: "",
    language_code: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageError, setImageError] = useState("");

  const itemsPerPage = 5;
  const totalItems = ministers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMinisters = ministers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [currentMinisters]);

  const fetchMinisters = () => {
    api
      .get("/minister-details")
      .then((response) => setMinisters(response.data))
      .catch((error) => {
        console.error("Error fetching minister details!", error);
        toast.error("Failed to load minister details.");
      });
  };

  useEffect(() => {
    fetchMinisters();
  }, []);

  const handleDeleteModalOpen = (minister) => {
    setSelectedMinister(minister);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (minister) => {
    setEditData({
      id: minister.id,
      name: minister.name,
      designation: minister.designation,
      language_code: minister.language_code,
      image: null,
    });
    setImagePreview(`${baseURL}${minister.image_path}`);
    setImageError("");
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .post(`/delete-minister-details/${selectedMinister.id}`)
      .then(() => {
        setMinisters(
          ministers.filter((minister) => minister.id !== selectedMinister.id)
        );
        setShowDeleteModal(false);
        setSelectedMinister(null);
        toast.success("Minister deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting minister!", error);
        toast.error("Failed to delete minister.");
      });
  };

  const handleEditSubmit = async () => {
    if (imageError) {
      toast.error("Please fix image errors before submitting", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("designation", editData.designation);
    formData.append("language_code", editData.language_code);
    if (editData.image) {
      formData.append("image", editData.image);
    }

    try {
      const response = await api.post(`/edit-minister-details/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        fetchMinisters();
        setShowEditModal(false);
        toast.success("Minister updated successfully!", {
          position: "top-right",
          autoClose: 3000,
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
          error.response?.data?.message || "Failed to update minister. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error updating minister:", error);
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ name: "", designation: "", image: null });
    setImagePreview(null);
    setImageError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const errorMessage = getImageValidationError(file);
      if (errorMessage) {
        setImageError(errorMessage);
        return;
      }
      setEditData({ ...editData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                Ministers
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Ministers</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20 position-relative">
                      <div className="tooltip-container">
                        <Link
                          to={ministers.length > 7 ? "#" : "/add-minister"}
                          className={`btn btn-primary btn-rounded float-right ${ministers.length > 7 ? "disabled-custom-button" : ""}`}
                          onClick={(e) => {
                            if (ministers.length > 7) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <i className="fa fa-plus"></i> Add Minister
                        </Link>
                        {ministers.length > 7 && (
                          <div className="custom-tooltip">
                            Maximum 4 ministers allowed per language
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th>Minister Name</th>
                          <th>Designation</th>
                          <th className="text-center">Minister Image</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMinisters.map((minister, index) => (
                          <tr key={minister.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{minister.name}</td>
                            <td>{minister.designation}</td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}${minister.image_path}`}
                                className="glightbox"
                                data-gallery="minister-images"
                              >
                                <img
                                  width="50px"
                                  src={`${baseURL}${minister.image_path}`}
                                  alt={`minister-img${minister.image_path}`}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleEditModalOpen(minister)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(minister)}
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
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer">
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
            <div className="modal fade show d-block"
              style={{
                overflowY: "auto",
                maxHeight: "100vh",
                scrollbarWidth: "none",
              }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Minister</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>
                          Select Language
                        </label>
                        <select
                          className="form-control"
                          value={editData.language_code}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              language_code: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Minister Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.designation}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              designation: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Image</label>
                        <input
                          type="file"
                          className={`form-control ${imageError ? "is-invalid" : ""}`}
                          accept=".jpg,.jpeg,.png"
                          onChange={handleImageChange}
                        />
                        {imageError && (
                          <small className="text-danger">{imageError}</small>
                        )}
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="preview"
                          width="100px"
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
                      onClick={handleEditSubmit}
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

export default MinisterDetails;
