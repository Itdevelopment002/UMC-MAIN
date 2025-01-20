import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import api, { baseURL } from "../api";

const Garden = () => {
  const [gardensData, setGardensData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [gardensData]);

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const response = await api.get("/gardens");
        setGardensData(response.data);
      } catch (error) {
        console.error("Error fetching gardens data:", error);
      }
    };
    fetchGardens();
  }, []);

  const handleDelete = (garden) => {
    setSelectedGarden(garden);
    setShowDeleteModal(true);
  };

  const handleEdit = (garden) => {
    setSelectedGarden(garden);
    setSelectedFiles([]);
    setCurrentImages(JSON.parse(garden.images));
    setRemovedImages([]);
    setShowEditModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedGarden(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedGarden(null);
    setSelectedFiles([]);
    setCurrentImages([]);
    setRemovedImages([]);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("heading", selectedGarden.heading);

      currentImages.forEach((img) => {
        if (!removedImages.includes(img)) {
          formData.append("images", img);
        }
      });

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.put(`/gardens/${selectedGarden.id}`, formData);
      const response = await api.get("/gardens");
      setGardensData(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving garden changes:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/gardens/${selectedGarden.id}`);
      setGardensData(
        gardensData.filter((garden) => garden.id !== selectedGarden.id)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting garden:", error);
    }
  };

  //eslint-disable-next-line
  const handleRemoveImage = (image) => {
    if (currentImages.includes(image)) {
      setRemovedImages([...removedImages, image]);
      setCurrentImages(currentImages.filter((img) => img !== image));
    } else {
      setSelectedFiles(
        selectedFiles.filter((file) => file.name !== image.name)
      );
    }
  };

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
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/garden">City Profile</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Gardens
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Gardens</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-garden"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Gardens
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Garden Names</th>
                          <th>Garden Images</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((garden, index) => (
                          <tr key={garden.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{garden.heading}</td>
                            <td>
                              <div className="d-flex flex-wrap">
                                {JSON.parse(garden.images).map(
                                  (img, imgIndex) => (
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
                                  )
                                )}
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
          <div
            className={`modal fade ${showDeleteModal ? "show" : ""}`}
            style={{ display: showDeleteModal ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
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

          {/* Edit Modal */}
          {/* Edit Modal */}
          <div
            className={`modal fade ${showEditModal ? "show" : ""}`}
            style={{ display: showEditModal ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4>Edit Garden</h4>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>
                        Garden Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedGarden?.heading || ""}
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
                        Garden Photo <span className="text-danger">*</span>
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
        </div>
      </div>
    </>
  );
};

export default Garden;
