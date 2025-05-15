import React, { useState, useEffect, useRef } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const BottomSlider = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLinkData, setEditLinkData] = useState({
    id: "",
    websitelink: "",
    websitelogo: "",
    websitelogoPreview: "",
  });
  const [links, setLinks] = useState([]);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [errors, setErrors] = useState({
    websitelink: "",
    websitelogo: "",
  });
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentPageData = links.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    initLightbox();
  }, [links, currentPageData]);

  const initLightbox = () => {
    GLightbox({
      selector: ".glightbox",
    });
  };

  const fetchLinks = () => {
    api
      .get('/bottom-sliders')
      .then((response) => {
        setLinks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch slider data", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editLinkData.websitelink.trim()) {
      newErrors.websitelink = "Slider Link is required";
    }

    if (editLinkData.websitelogo instanceof File) {
      const imageError = getImageValidationError(editLinkData.websitelogo);
      if (imageError) {
        newErrors.websitelogo = imageError;
      }
    } else if (!editLinkData.websitelogo) {
      newErrors.websitelogo = "Slider Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteConfirm = () => {
    if (selectedLinkId) {
      api
        .post(`/delete-bottom-sliders/${selectedLinkId}`)
        .then(() => {
          setLinks(links.filter((websitelink) => websitelink.id !== selectedLinkId));
          setShowDeleteModal(false);
          toast.success("Slider deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("Error deleting slider link:", error);
          toast.error("Failed to delete slider", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix errors before submitting.");
      return;
    }
    if (errors.websitelink || errors.websitelogo || errors.websitelogo) {
      toast.error("Please fix errors before submitting.");
      return;
    }


    const formData = new FormData();
    formData.append("websitelink", editLinkData.websitelink);

    if (editLinkData.websitelogo instanceof File) {
      formData.append("websitelogo", editLinkData.websitelogo);
    }

    api
      .post(`/edit-bottom-sliders/${editLinkData.id}`, formData)
      .then((response) => {
        setLinks(links.map((websitelink) =>
          websitelink.id === editLinkData.id ? response.data : websitelink
        ));
        setShowEditModal(false);
        toast.success("Slider updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchLinks();
      })
      .catch((error) => {
        console.error("Error updating slider link:", error);
        toast.error(
          error.response?.data?.message || "Failed to update slider",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      });
  };

  const openEditModal = (websitelink) => {
    setEditLinkData({
      id: websitelink.id,
      websitelink: websitelink.websitelink,
      websitelogo: websitelink.websitelogo,
      websitelogoPreview: `${baseURL}${websitelink.websitelogo}`,
    });
    setErrors({
      websitelink: "",
      websitelogo: "",
    });
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate the image file
      const errorMessage = getImageValidationError(file);

      if (errorMessage) {
        // Clear the file input if invalid file is selected
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Set error message
        setErrors({ ...errors, websitelogo: errorMessage });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditLinkData({
          ...editLinkData,
          websitelogo: file,
          websitelogoPreview: reader.result,
        });
        setErrors({ ...errors, websitelogo: "" });
      };
      reader.readAsDataURL(file);
    } else {
      setEditLinkData({
        ...editLinkData,
        websitelogo: null,
        websitelogoPreview: `${baseURL}${editLinkData.websitelogo}`, // Fallback to the existing image
      });
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Bottom Slider
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Bottom Slider</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-bottom-slider"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Bottom Slider
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Slider Link</th>
                          <th className="text-center">Slider Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((websitelink, index) => (
                          <tr key={websitelink.id}>
                            <td className="text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              <Link to={websitelink.websitelink} className="text-decoration-none" style={{ color: "#000" }} target="_blank">
                                {websitelink.websitelink}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}${websitelink.websitelogo}`}
                                className="glightbox"
                                data-gallery="web-links-gallery"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}${websitelink.websitelogo}`}
                                  alt={websitelink.id}
                                  style={{ borderRadius: "5px" }}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => openEditModal(websitelink)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10 mx-1"
                                onClick={() => {
                                  setSelectedLinkId(websitelink.id);
                                  setShowDeleteModal(true);
                                }}
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
                <div>
                  <ul className="pagination mt-4">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.ceil(links.length / itemsPerPage) },
                      (_, i) => i + 1
                    )
                      .slice(0, 5)
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
                    {Math.ceil(links.length / itemsPerPage) > 5 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(links.length / itemsPerPage)
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

          {/* Delete Confirmation Modal */}
          <div
            className={`modal fade ${showDeleteModal ? "show" : ""}`}
            style={{ display: showDeleteModal ? "block" : "none" }}
            id="deleteModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <h5>Are you sure you want to delete this slider?</h5>
                </div>
                <div className="modal-footer text-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="modal fade show d-block"
              style={{
                overflowY: "auto",
                maxHeight: "100vh",
                scrollbarWidth: "none",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
              tabIndex="-1"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowEditModal(false);
                }
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Bottom Slider</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setShowEditModal(false)}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="websitelink">Slider Link <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          id="websitelink"
                          className={`form-control ${errors.websitelink ? "is-invalid" : ""}`}
                          value={editLinkData.websitelink}
                          onChange={(e) => {
                            setEditLinkData({
                              ...editLinkData,
                              websitelink: e.target.value,
                            });
                            if (errors.websitelink) {
                              setErrors({ ...errors, websitelink: "" });
                            }
                          }}
                        />
                        {errors.websitelink && (
                          <div className="invalid-feedback">{errors.websitelink}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="websitelogo">Slider Image <span className="text-danger">*</span></label>
                        <input
                          type="file"
                          id="websitelogo"
                          accept=".jpg,.jpeg,.png"
                          className={`form-control ${errors.websitelogo ? "is-invalid" : ""}`}
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        {errors.websitelogo && (
                          <div className="invalid-feedback">{errors.websitelogo}</div>
                        )}
                        <small className="text-muted d-block mt-1">
                          📌 Note: Image Max size: 2MB.
                        </small>
                        {editLinkData.websitelogoPreview && (
                          <div className="mt-2">
                            <img
                              src={editLinkData.websitelogoPreview}
                              alt="Preview"
                              width="100px"
                              className="img-thumbnail"
                            />
                          </div>
                        )}

                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
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

export default BottomSlider;