import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";
import { getImageValidationError } from "../../validation/ImageValidation";

const Slider = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    image: null,
  });
  const [editErrors, setEditErrors] = useState({
    name: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = sliders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSliders = sliders.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [currentSliders]);

  const fetchSliders = () => {
    api
      .get("/sliders")
      .then((response) => setSliders(response.data))
      .catch((error) => {
        console.error("Error fetching slider!", error);
        toast.error("Failed to load slider.");
      });
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDeleteModalOpen = (slider) => {
    setSelectedSlider(slider);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (slider) => {
    setEditData({
      id: slider.id,
      name: slider.name,
      image: null
    });
    setImagePreview(`${baseURL}${slider.image_path}`);
    setEditErrors({ name: "", image: "" });
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .post(`/delete-sliders/${selectedSlider.id}`)
      .then(() => {
        setSliders(sliders.filter((slider) => slider.id !== selectedSlider.id));
        setShowDeleteModal(false);
        setSelectedSlider(null);
        toast.success("Slider deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting slider!", error);
        toast.error("Failed to delete slider.");
      });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate name
    if (!editData.name.trim()) {
      newErrors.name = "Slider name is required.";
      isValid = false;
    }

    // Validate image (must not be empty and must be valid)
    if (!editData.image) {
      newErrors.image = "Image is required.";
      isValid = false;
    } else {
      const error = getImageValidationError(editData.image);
      if (error) {
        newErrors.image = error;
        isValid = false;
      }
    }

    setEditErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = getImageValidationError(file);
      if (error) {
        setEditErrors((prev) => ({ ...prev, image: error }));
        setEditData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
      } else {
        setEditData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
        setEditErrors((prev) => ({ ...prev, image: "" }));
      }
    } else {
      setEditData((prev) => ({ ...prev, image: null }));
      setEditErrors((prev) => ({ ...prev, image: "Image is required." }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    // Only proceed if no errors
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      if (editData.image) {
        formData.append("image", editData.image);
      }

      await api.post(`/edit-sliders/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchSliders();
      setShowEditModal(false);
      toast.success("Slider updated successfully!");
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Failed to update slider. Please try again.");
    }
  };



  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ name: "", image: null });
    setImagePreview(null);
    setEditErrors({ name: "", image: "" });
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
                Sliders
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Sliders</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-slider"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Slider
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Slider Name</th>
                          <th className="text-center">Slider Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSliders.map((slider, index) => (
                          <tr key={slider.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{slider.name}</td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}${slider.image_path}`}
                                className="glightbox"
                                data-gallery="slider-images"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}${slider.image_path}`}
                                  alt={`slider-img${slider.image_path}`}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditModalOpen(slider)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteModalOpen(slider)}
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
            <div className="modal fade show d-block" style={{ overflowY: "auto", maxHeight: "100vh" }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Slider</h5>
                    <button type="button" className="close" onClick={handleCloseEditModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <form onSubmit={handleEditSubmit}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Slider Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${editErrors.name ? "is-invalid" : ""}`}
                          value={editData.name}
                          onChange={(e) => {
                            setEditData(prev => ({ ...prev, name: e.target.value }));
                            if (editErrors.name) {
                              setEditErrors(prev => ({ ...prev, name: "" }));
                            }
                          }}
                        />
                        {editErrors.name && (
                          <div className="invalid-feedback d-block">{editErrors.name}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Slider Image</label>
                        <input
                          type="file"
                          id="editImage"
                          className={`form-control ${editErrors.image ? "is-invalid" : ""}`}
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {editErrors.image && (
                          <div className="invalid-feedback d-block">{editErrors.image}</div>
                        )}
                        <small className="text-muted d-block mt-1">
                          📌 Note: Image must be 2018×787 pixels
                        </small>
                      </div>
                      {imagePreview && (
                          <img src={imagePreview} alt="preview" width="100" className="mt-2" />
                        )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
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

export default Slider;