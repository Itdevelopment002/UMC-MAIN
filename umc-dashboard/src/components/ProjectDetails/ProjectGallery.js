import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";

const ProjectGallery = () => {
  const [gardensData, setGardensData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Initialize GLightbox
  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [gardensData]);

  // Fetch gardens data
  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const response = await api.get("/project_images"); // Ensure this matches your backend route
        setGardensData(response.data);
      } catch (error) {
        console.error("Error fetching gardens data:", error);
      }
    };
    fetchGardens();
  }, []);

  // Handle delete action
  const handleDelete = (garden) => {
    setSelectedGarden(garden);
    setShowDeleteModal(true);
  };

  // Handle edit action
  const handleEdit = (garden) => {
    setSelectedGarden(garden);
    setCurrentImages(JSON.parse(garden.images));
    setRemovedImages([]);
    setSelectedFiles([]);
    setShowEditModal(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedGarden(null);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedGarden(null);
    setCurrentImages([]);
    setRemovedImages([]);
    setSelectedFiles([]);
  };

  // Save edited garden
  const handleSaveEdit = async () => {
    if (!selectedGarden) return;

    try {
      const formData = new FormData();
      formData.append("heading", selectedGarden.heading);

      // Append existing images (excluding removed ones)
      currentImages.forEach((img) => {
        if (!removedImages.includes(img)) {
          formData.append("images", img);
        }
      });

      // Append new files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.put(`/project_images/${selectedGarden.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Project updated successfully");

      // Refresh data
      const response = await api.get("/project_images");
      setGardensData(response.data);
      handleCloseEditModal();

    } catch (error) {
      console.error("Error saving garden changes:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };


  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedGarden) return;

    try {
      await api.delete(`/project_images/${selectedGarden.id}`);
      setGardensData(
        gardensData.filter((garden) => garden.id !== selectedGarden.id)
      );
      handleCloseDeleteModal();
      toast.success("Project deletd successfully");
    } catch (error) {
      console.error("Error deleting garden:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(gardensData.length / itemsPerPage);
  const paginatedData = gardensData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Upcoming Projects</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Project Details
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-4 col-3">
                    <h4 className="page-title">Project Category</h4>
                  </div>
                  <div className="col-sm-8 col-9 text-right m-b-20">
                    <Link
                      to="/add-project-category"
                      className="btn btn-primary btn-rounded float-right"
                    >
                      <i className="fa fa-plus"></i> Add Category
                    </Link>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered m-b-0">
                    <thead>
                      <tr>
                        <th width="10%">Sr. No.</th>
                        <th>Project Heading</th>
                        <th>Project Images</th>
                        <th width="15%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((garden, index) => (
                        <tr key={garden.id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{garden.heading}</td>
                          <td>
                            <div className="d-flex flex-wrap">
                              {JSON.parse(garden.images).map((img, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="position-relative me-2"
                                >
                                  <img
                                    src={`${baseURL}${img}`}
                                    alt=""
                                    className="glightbox"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      marginRight: "5px",
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEdit(garden)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger mx-1"
                              onClick={() => handleDelete(garden)}
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
            </div>
          </div>
        </div>

        {/* Pagination */}
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Link
              className="page-link"
              to="#"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Link>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <Link
                className="page-link"
                to="#"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Link
              className="page-link"
              to="#"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Link>
          </li>
        </ul>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal fade show" style={{ display: "block" }}>
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
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedGarden && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4>Edit Garden</h4>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>
                        Project Heading <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedGarden.heading}
                        onChange={(e) =>
                          setSelectedGarden({
                            ...selectedGarden,
                            heading: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>
                      Project Images <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        multiple
                      />
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
        <ToastContainer/>
      </div>
    </div>
  );
};

export default ProjectGallery;