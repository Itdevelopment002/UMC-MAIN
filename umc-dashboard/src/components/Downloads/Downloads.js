import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Downloads = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [newDownload, setNewDownload] = useState({ name: "", pdf: null });
  const [selectedDownloadId, setSelectedDownloadId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const downloadsPerPage = 10;

  useEffect(() => {
    fetchDownloads();
  }, []);

  const [errors, setErrors] = useState({ name: "", pdf: "" });
  const validateForm = () => {
    const newErrors = {};
    if (!newDownload.name) {
      newErrors.name = "File name is required.";
    }
    if (!newDownload.pdf) {
      newErrors.pdf = "PDF file is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDownloads = async () => {
    try {
      const response = await api.get("/downloads");
      setDownloads(response.data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      toast.error("Error fetching downloads!");
    }
  };

  const indexOfLastDownload = currentPage * downloadsPerPage;
  const indexOfFirstDownload = indexOfLastDownload - downloadsPerPage;
  const currentDownloads = downloads.slice(
    indexOfFirstDownload,
    indexOfLastDownload
  );

  const totalPages = Math.ceil(downloads.length / downloadsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileChange = (e) => {
    setNewDownload({ ...newDownload, pdf: e.target.files[0] });
  };

  const resetForm = () => {
    setNewDownload({ name: "", pdf: null });
    setErrors({ name: "", pdf: "" });
    const pdfInput = document.getElementById("pdf");
    if (pdfInput) pdfInput.value = "";
  };

  const handleAddDownload = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newDownload.name);
    if (newDownload.pdf) {
      formData.append("pdf", newDownload.pdf);
    }

    try {
      await api.post("/downloads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchDownloads();
      setNewDownload({ name: "", pdf: null });
      setNewDownload({ name: "", pdf: "" });
      resetForm();
      setErrors({ name: "", pdf: "" });
      toast.success("Download added successfully!");
    } catch (error) {
      console.error("Error adding download file:", error);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedDownloadId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteDownload = async () => {
    try {
      await api.delete(`/downloads/${selectedDownloadId}`);
      fetchDownloads();
      setShowDeleteModal(false);
      setNewDownload({ name: "", pdf: null });
      toast.success("Download deleted successfully!");
    } catch (error) {
      toast.error("Error deleting download!");
    }
  };

  const handleOpenEditModal = (download) => {
    setSelectedDownloadId(download.id);
    setNewDownload({ name: download.name, pdf: null });
    setShowEditModal(true);
  };

  const handleEditDownload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newDownload.name);
    if (newDownload.pdf) {
      formData.append("pdf", newDownload.pdf);
    }

    try {
      await api.put(`/downloads/${selectedDownloadId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowEditModal(false);
      fetchDownloads();
      setNewDownload({ name: "", pdf: null });
      resetForm();
      toast.success("Download updated successfully!");
    } catch (error) {
      console.error("Error editing download:", error);
      toast.error("Error updating download!");
    }
  };

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
                Downloads
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title m-b-0">Downloads</h4>
                    </div>
                  </div>
                  <hr />
                  <div className="card-block">
                    <form onSubmit={handleAddDownload}>
                      <div className="form-group row">
                        <label className="col-form-label col-md-2">
                          File Name <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            className={`form-control form-control-md ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            value={newDownload.name}
                            onChange={(e) => {
                              setNewDownload({
                                ...newDownload,
                                name: e.target.value,
                              });
                              if (errors.name) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  name: "",
                                }));
                              }
                            }}
                          />
                          {errors.name && (
                            <small className="text-danger">{errors.name}</small>
                          )}
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-form-label col-lg-2">
                          Upload PDF <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <div className="input-group">
                            <input
                              id="pdf"
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                handleFileChange(e);
                                if (e.target.files[0]) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    pdf: "",
                                  }));
                                }
                              }}
                              className={`form-control form-control-md ${
                                errors.pdf ? "is-invalid" : ""
                              }`}
                            />
                          </div>
                          {errors.pdf && (
                            <small className="text-danger">{errors.pdf}</small>
                          )}
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-2">
                          <input
                            type="submit"
                            className="btn btn-primary btn-sm"
                            value="Submit"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>File Name</th>
                          <th>Uploaded PDF</th>
                          <th width="20%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDownloads.map((download, index) => (
                          <tr key={download.id}>
                            <td>{indexOfFirstDownload + index + 1}</td>
                            <td>{download.name}</td>
                            <td>
                              <Link
                                to={`${baseURL}/${download.pdf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaFilePdf size={35} color="red" />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleOpenEditModal(download)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() =>
                                  handleOpenDeleteModal(download.id)
                                }
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

          <div className="mt-4">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Link
                  className="page-link"
                  to="#!"
                  onClick={handlePreviousClick}
                >
                  Previous
                </Link>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      to="#!"
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </Link>
                  </li>
                )
              )}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Link className="page-link" to="#!" onClick={handleNextClick}>
                  Next
                </Link>
              </li>
            </ul>
          </div>

          {showDeleteModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this entry?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleDeleteDownload}
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
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Downloads</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">File Name</label>
                        <input
                          className="form-control form-control-md"
                          type="text"
                          value={newDownload.name}
                          onChange={(e) =>
                            setNewDownload({
                              ...newDownload,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Upload Pdf</label>
                        <input
                          id="edit-pdf"
                          className="form-control form-control-md"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setShowEditModal(false);
                        setNewDownload({ name: "", pdf: null });
                        resetForm();
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleEditDownload}
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
    </div>
  );
};

export default Downloads;
