import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistoryImage = () => {
  const [gallerys, setGallerys] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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
      const response = await api.get("/history-img");
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
      await api.delete(`/history-img/${selectedGallery.id}`);
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
      await api.put(`/history-img/${selectedGallery.id}`, formData, {
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
    }
  };

  return (
    <>

          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">History Image</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-historyImage"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Image
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Image Name</th>
                          <th>Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((gallery, index) => (
                          <tr key={gallery.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{gallery.photo_name}</td>
                            <td>
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
                            <td>
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
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
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
                    <h5 className="modal-title">Edit History Image</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Image Name</label>
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
                      <label>Upload Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {selectedGallery?.image && (
                      <img
                        src={selectedGallery.image}
                        alt="Selected"
                        style={{ width: "30%", height: "auto", marginTop: "10px" }}
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
    </>
  );
};

export default HistoryImage;