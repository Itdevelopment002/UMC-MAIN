import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { FaFilePdf } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  let lightbox = null;

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    initLightbox();
    // eslint-disable-next-line
  }, [publications, currentPage]);

  const initLightbox = () => {
    if (lightbox) {
      lightbox.destroy();
    }
    lightbox = GLightbox({ selector: ".glightbox" });
  };

  const fetchPublications = async () => {
    try {
      const response = await api.get("/publications");
      setPublications(response.data);
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const handleDelete = (publication) => {
    setSelectedPublication(publication);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/publications/${selectedPublication.id}`);
      setPublications(
        publications.filter(
          (publication) => publication.id !== selectedPublication.id
        )
      );
      toast.success("Publication deleted successfully!");
      setShowDeleteModal(false);
      setSelectedPublication(null);
      fetchPublications();
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast.error("Error deleting publication!");
    }
  };

  const handleEdit = (publication) => {
    setSelectedPublication(publication);
    setShowEditModal(true);
    setSelectedFile(null);
    setSelectedPDF(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedPublication.publication_name) {
      formData.append("publication_name", selectedPublication.publication_name);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (selectedPDF) {
      formData.append("pdf", selectedPDF);
    }

    try {
      await api.put(`/publications/${selectedPublication.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchPublications();
      toast.success("Publication updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating publication:", error);
      toast.error("Error updating publication!");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedPublication({ ...selectedPublication, image: imageUrl });
    }
  };

  const handlePDFChange = (e) => {
    setSelectedPDF(e.target.files[0]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(publications.length / itemsPerPage);
  const currentPageData = publications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Official Publications
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Official Publications</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-official-publications"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Publication
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Publication Name</th>
                          <th>Image</th>
                          <th>PDF</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((publication, index) => (
                          <tr key={publication.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td>{publication.publication_name}</td>
                            <td>
                              <Link
                                to={`${baseURL}${publication.file_path}`}
                                className="glightbox"
                              >
                                <img
                                  src={`${baseURL}${publication.file_path}`}
                                  alt="Publication"
                                  width="100px"
                                />
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`${baseURL}${publication.pdf_path}`}
                                target="_blank"
                              >
                                <FaFilePdf size={35} color="red" />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEdit(publication)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(publication)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="pagination mt-3">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
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
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
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

          {showEditModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Publication</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Publication Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedPublication?.publication_name || ""}
                        onChange={(e) =>
                          setSelectedPublication({
                            ...selectedPublication,
                            publication_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Publication Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {selectedPublication?.image && (
                      <img
                        src={selectedPublication.image}
                        alt="Preview"
                        width="60px"
                        className="img-thumbnail my-3"
                      />
                    )}
                    <div className="form-group">
                      <label>Publication PDF</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handlePDFChange}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Publications;
