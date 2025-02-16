import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivacyPolicy = () => {
  const [policyData, setPolicyData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await api.get("/privacy-policy");
      setPolicyData(response.data);
    } catch (error) {
      toast.error("Failed to fetch privacy policy data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/privacy-policy/${selectedPolicy.id}`);
      setPolicyData((prevData) =>
        prevData.filter((policy) => policy.id !== selectedPolicy.id)
      );
      setShowDeleteModal(false);
      toast.success("Privacy Policy deleted successfully!");
    } catch (error) {
      console.error("Error deleting privacy policy:", error);
      toast.error("Failed to delete the privacy policy!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/privacy-policy/${selectedPolicy.id}`, {
        heading: selectedPolicy.heading,
        description: selectedPolicy.description,
        language_code: selectedPolicy.language_code,
      });

      const updatedPolicy = policyData.map((policy) =>
        policy.id === selectedPolicy.id ? selectedPolicy : policy
      );
      setPolicyData(updatedPolicy);
      setShowEditModal(false);
      toast.success("Privacy Policy updated successfully!");
    } catch (error) {
      toast.error("Failed to update the privacy policy!");
    }
  };

  const handleEditClick = (policy) => {
    setSelectedPolicy({ ...policy });
    setShowEditModal(true);
  };

  const handleDeleteClick = (policy) => {
    setSelectedPolicy(policy);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPolicy({ ...selectedPolicy, [name]: value });
  };

  const currentPageData = policyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(policyData.length / itemsPerPage);

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
                Privacy Policy
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Privacy Policy</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-privacy-policy"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Policy
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Policy Heading</th>
                          <th>Policy Description</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((policy, index) => (
                            <tr key={policy.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{policy.heading}</td>
                              <td>{policy.description}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(policy)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(policy)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No privacy policy available.
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
                    {currentPage > 2 && (
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                    )}
                    {currentPage > 3 && (
                      <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(2)}>
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
                            onClick={() => setCurrentPage(page)}
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
                          onClick={() => setCurrentPage(totalPages - 1)}
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
                          onClick={() => setCurrentPage(totalPages)}
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
                    <h5 className="modal-title">Edit Privacy Policy</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedPolicy?.language_code || ""}
                          onChange={handleEditChange}
                          name="language_code"
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Policy Heading</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          name="heading"
                          value={selectedPolicy?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Policy Description</label>
                        <textarea
                          className="form-control form-control-md"
                          name="description"
                          value={selectedPolicy?.description || ""}
                          onChange={handleEditChange}
                        ></textarea>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleEditSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={handleDelete}
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

export default PrivacyPolicy;
