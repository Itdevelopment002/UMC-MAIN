import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import { FaFilePdf } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const Tender = () => {
  const [tenders, setTenders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedPdf, setEditedPdf] = useState(null);
  const [tendersPerPage] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await api.get("/tenders");
      setTenders(response.data);
    } catch (error) {
      toast.error("Error fetching tenders");
    }
  };

  const handleDeleteClick = (tenderId) => {
    setSelectedTender(tenderId);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    api
      .delete(`/tenders/${selectedTender}`)
      .then(() => {
        setTenders(tenders.filter((tender) => tender.id !== selectedTender));
        setModalVisible(false);
        setSelectedTender(null);
        toast.success("Tender deleted successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to deleted the tender");
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedPdf(e.target.files[0]);
    }
  };

  const handleEditClick = (tender) => {
    setSelectedTender(tender.id);
    setEditedDescription(tender.description);
    setEditedStatus(tender.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const formData = new FormData();
    formData.append("description", editedDescription);
    formData.append("status", editedStatus);

    if (editedPdf) {
      formData.append("pdf", editedPdf);
    } else {
      formData.append("retainPdf", true);
    }

    api
      .put(`/tenders/${selectedTender}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        fetchTenders();
        setShowEditModal(false);
        setSelectedTender(null);
        fetchTenders();
        toast.success("Tender updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update the tender.");
      });
  };

  const lastTenderIndex = currentPage * tendersPerPage;
  const firstTenderIndex = lastTenderIndex - tendersPerPage;
  const currentTenders = tenders.slice(firstTenderIndex, lastTenderIndex);
  const totalPages = Math.ceil(tenders.length / tendersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
                Tender
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Tender</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-tenders"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Tender
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Tender Description</th>
                          <th>Status</th>
                          <th>Pdf</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTenders.map((tender, index) => (
                          <tr key={tender.id}>
                            <td>{firstTenderIndex + index + 1}</td>
                            <td>{tender.description}</td>
                            <td>{tender.status}</td>
                            <td>
                              <Link
                                to={`${baseURL}/${tender.pdf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaFilePdf size={35} color="red" />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleEditClick(tender)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(tender.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <nav>
                    <ul className="pagination mt-3">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button onClick={handlePrevPage} className="page-link">
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((page) => (
                        <li
                          key={page + 1}
                          className={`page-item ${
                            currentPage === page + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            onClick={() => paginate(page + 1)}
                            className="page-link"
                          >
                            {page + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button onClick={handleNextPage} className="page-link">
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {modalVisible && (
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
                      onClick={() => setModalVisible(false)}
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

          {showEditModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Tender</h5>
                  </div>
                  <div className="modal-body">
                    <label className="form-label">Tender Description</label>
                    <textarea
                      className="form-control"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />

                    <label className="form-label mt-3">Status</label>
                    <select
                      className="form-control"
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      <option value="New">New</option>
                      <option value="-">-</option>
                    </select>

                    <label className="form-label mt-3">Upload New PDF</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
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
                      onClick={handleSaveEdit}
                    >
                      Save Changes
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

export default Tender;
