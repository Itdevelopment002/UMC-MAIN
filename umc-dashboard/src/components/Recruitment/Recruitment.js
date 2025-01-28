import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Recruitment = () => {
  const [recruitment, setRecruitment] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRecruitment();
  }, []);

  const fetchRecruitment = async () => {
    try {
      const response = await api.get("/recruitment");
      setRecruitment(response.data.reverse());
    } catch (error) {
      console.error("Error fetching recruitment:", error);
      toast.error("Error fetching recruitment");
    }
  };

  const handleDelete = (recruitment) => {
    setSelectedRecruitment(recruitment);
    setShowDeleteModal(true);
  };

  const handleEdit = (recruitment) => {
    setSelectedRecruitment(recruitment);
    setShowEditModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRecruitment(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRecruitment(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const { description } = selectedRecruitment;

      const formattedPublishDate = selectedRecruitment.publish_date
        ? formatDate(selectedRecruitment.publish_date)
        : "";

      await api.put(`/recruitment/${selectedRecruitment.id}`, {
        description,
        publish_date: formattedPublishDate,
      });
      toast.success("Recruitment updated successfully");
      fetchRecruitment();
    } catch (error) {
      console.error("Error updating recruitment:", error);
      toast.error("Error updating recruitment");
    } finally {
      setIsLoading(false);
      handleCloseEditModal();
    }
  };

  const handleDeleteRecruitment = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/recruitment/${selectedRecruitment.id}`);
      toast.success("Recruitment deleted successfully");
      fetchRecruitment();
    } catch (error) {
      console.error("Error deleting recruitment:", error);
      toast.error("Error deleting recruitment");
    } finally {
      setIsLoading(false);
      handleCloseDeleteModal();
    }
  };

  const currentPageData = recruitment.slice(
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
                Recruitment
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Recruitment</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-recruitment"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Recruitment
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Job Description</th>
                          <th className="text-center">Posting Date</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((recruitment, index) => (
                            <tr key={recruitment.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{recruitment.description}</td>
                              <td className="text-center">
                                {new Date(recruitment.publish_date)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEdit(recruitment)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDelete(recruitment)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                              No recruitment data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.ceil(recruitment.length / itemsPerPage) },
                      (_, i) => (
                        <li
                          className={`page-item ${currentPage === i + 1 ? "active" : ""
                            }`}
                          key={i}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      )
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(recruitment.length / itemsPerPage)
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

          {/* Delete Modal */}
          <div
            className={`modal fade ${showDeleteModal ? "show" : ""}`}
            tabIndex="-1"
            aria-hidden={!showDeleteModal}
            style={{ display: showDeleteModal ? "block" : "none" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <h5>Are you sure you want to delete this entry?</h5>
                </div>
                <div className="modal-footer">
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
                    onClick={handleDeleteRecruitment}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
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
                    <h5 className="modal-title">Edit Recruitment</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Job Description</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedRecruitment?.description || ""}
                          onChange={(e) =>
                            setSelectedRecruitment({
                              ...selectedRecruitment,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Posting Date</label>
                        <Flatpickr
                          value={selectedRecruitment?.publish_date || ""}
                          onChange={(date) =>
                            setSelectedRecruitment({
                              ...selectedRecruitment,
                              publish_date: date[0],
                            })
                          }
                          className="form-control"
                          options={{ dateFormat: "d-m-Y" }}
                        />
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
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Recruitment;
