import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeGallery = () => {
  const [gallerys, setGallerys] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGallerys();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });

    return () => {
      lightbox.destroy();
    };
  }, [gallerys, currentPage]);

  const fetchGallerys = async () => {
    try {
      const response = await api.get("/home-gallerys");
      setGallerys(response.data);
    } catch (error) {
      console.error("Error fetching home gallery:", error);
    }
  };

  const totalPages = Math.ceil(gallerys.length / itemsPerPage);
  const currentPageData = gallerys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = (gallery) => {
    setSelectedGallery(gallery);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/home-gallerys/${selectedGallery.id}`);
      setGallerys(gallerys.filter((gallery) => gallery.id !== selectedGallery.id));
      toast.success("Home gallery deleted successfully!");
      setShowDeleteModal(false);
      setSelectedGallery(null);
    } catch (error) {
      console.error("Error deleting home gallery:", error);
      toast.error("Error deleting home gallery!");
    }
  };

  const handleEdit = (gallery) => {
    setSelectedGallery(gallery);
    setShowEditModal(true);
    setImagePreview(`${baseURL}${gallery.file_path}`);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();

    if (selectedGallery.photo_name) {
      formData.append("photo_name", selectedGallery.photo_name);
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await api.put(`/home-gallerys/${selectedGallery.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchGallerys();
      toast.success("Home gallery updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating home gallery:", error);
      toast.error("Error updating home gallery!");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedGallery({ ...selectedGallery, image: imageUrl });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
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
                Home Gallery
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Home Gallery</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-home-gallery"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Photos
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Photo Gallery Name</th>
                          <th width="30%" className="text-center">Photo Gallery Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((gallery, index) => (
                          <tr key={gallery.id}>
                            <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{gallery.photo_name}</td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}${gallery.file_path}`}
                                className="glightbox"
                                data-gallery="gallery-images"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}${gallery.file_path}`}
                                  alt={`gallery${index + 1}`}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleEdit(gallery)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDelete(gallery)}
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
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary btn-lg"
                      data-dismiss="modal"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger btn-lg"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && (
            <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Home Gallery</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Gallery Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedGallery?.photo_name || ""}
                        onChange={(e) =>
                          setSelectedGallery({
                            ...selectedGallery,
                            photo_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Gallery Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="preview"
                        width="100"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveEdit}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default HomeGallery;
