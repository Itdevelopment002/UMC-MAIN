import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recruitment = () => {
  const [recruitment, setRecruitment] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageOld, setCurrentPageOld] = useState(1);
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

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const { heading, description, link, language_code } = selectedRecruitment;

      await api.put(`/recruitment/${selectedRecruitment.id}`, {
        heading,
        description,
        link,
        language_code,
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

  const contractRecruitment = recruitment.filter(
    (item) => item.heading === "Contract Basis Recruitment"
  );
  const oldRecruitment = recruitment.filter(
    (item) => item.heading === "Old Recruitment"
  );

  const currentPageDataContract = contractRecruitment.slice(
    (currentPageContract - 1) * itemsPerPage,
    currentPageContract * itemsPerPage
  );

  const currentPageDataOld = oldRecruitment.slice(
    (currentPageOld - 1) * itemsPerPage,
    currentPageOld * itemsPerPage
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
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
                    <div className="col-6">
                      <h4 className="page-title">Recruitment</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-recruitment"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Data
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Contract Basis Recruitment Advertisement</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th width="35%">Job Description</th>
                          <th width="35%">Job Link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageDataContract.length > 0 ? (
                          currentPageDataContract.map((recruitment, index) => (
                            <tr key={recruitment.id}>
                              <td className="text-center">
                                {(currentPageContract - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{recruitment.description}</td>
                              <td>
                                <Link
                                  to={recruitment.link === "#" || recruitment.link.startsWith("/") ? "#" : recruitment.link}
                                  target={recruitment.link === "#" || recruitment.link.startsWith("/") ? "" : "_blank"}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {recruitment.link}
                                </Link>
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
                              No Contract basis recruitment data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <ul className="pagination">
                      <li className={`page-item ${currentPageContract === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPageContract(currentPageContract - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        { length: Math.ceil(contractRecruitment.length / itemsPerPage) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <li
                          className={`page-item ${currentPageContract === page ? "active" : ""}`}
                          key={page}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPageContract(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${currentPageContract === Math.ceil(contractRecruitment.length / itemsPerPage)
                          ? "disabled"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPageContract(currentPageContract + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="row mt-5">
                    <div className="col-12">
                      <h4 className="page-title">Old Recruitment Advertisement</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th width="35%">Job Description</th>
                          <th width="35%">Job Link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageDataOld.length > 0 ? (
                          currentPageDataOld.map((recruitment, index) => (
                            <tr key={recruitment.id}>
                              <td className="text-center">
                                {(currentPageOld - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{recruitment.description}</td>
                              <td>
                                <Link
                                  to={recruitment.link === "#" || recruitment.link.startsWith("/") ? "#" : recruitment.link}
                                  target={recruitment.link === "#" || recruitment.link.startsWith("/") ? "" : "_blank"}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {recruitment.link}
                                </Link>
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
                              No Old recruitment data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <ul className="pagination">
                      <li className={`page-item ${currentPageOld === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPageOld(currentPageOld - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        { length: Math.ceil(oldRecruitment.length / itemsPerPage) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <li
                          className={`page-item ${currentPageOld === page ? "active" : ""}`}
                          key={page}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPageOld(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${currentPageOld === Math.ceil(oldRecruitment.length / itemsPerPage)
                          ? "disabled"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPageOld(currentPageOld + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <h5>Are you sure you want to delete this item?</h5>
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
                        <label>
                          Select Language
                        </label>
                        <select
                          className="form-control"
                          value={selectedRecruitment?.language_code || ""}
                          onChange={(e) =>
                            setSelectedRecruitment({
                              ...selectedRecruitment,
                              language_code: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Job Heading</label>
                        <select
                          className="form-control"
                          value={selectedRecruitment?.heading || ""}
                          onChange={(e) =>
                            setSelectedRecruitment({
                              ...selectedRecruitment,
                              heading: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select Job Heading
                          </option>
                          <option value="Contract Basis Recruitment">
                            Contract Basis Recruitment
                          </option>
                          <option value="Old Recruitment">
                            Old Recruitment
                          </option>
                        </select>
                      </div>
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
                        <label>Job Link</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedRecruitment?.link || ""}
                          onChange={(e) =>
                            setSelectedRecruitment({
                              ...selectedRecruitment,
                              link: e.target.value,
                            })
                          }
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