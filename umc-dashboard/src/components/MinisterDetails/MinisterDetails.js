import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";

const MinisterDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMinister, setSelectedMinister] = useState(null);
  const [ministers, setMinisters] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    designation: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = ministers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => {
      lightbox.destroy();
    };
  }, [ministers]);

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
    setEditData(minister);
    setImagePreview(`${baseURL}${minister.image_path}`);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .delete(`/minister-details/${selectedMinister.id}`)
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
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("designation", editData.designation);
    if (editData.image) {
      formData.append("image", editData.image);
    }

    try {
      await api.put(`/minister-details/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchMinisters();
      setShowEditModal(false);
      toast.success("Minister updated successfully!");
    } catch (error) {
      console.error("Error updating minister!", error);
      toast.error("Failed to update minister.");
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ name: "", designation: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //eslint-disable-next-line
  const currentMinisters = ministers.slice(indexOfFirstItem, indexOfLastItem);

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
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-minister"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Minister
                      </Link>
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
                        {ministers.map((minister, index) => (
                          <tr key={minister.id}>
                            <td className="text-center">{index + 1}</td>
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
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditModalOpen(minister)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
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
              </div>
            </div>
          </div>

          <ul className="pagination  mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
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

          <ToastContainer />

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
                          className="form-control"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            width="100"
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
    </>
  );
};

export default MinisterDetails;
