import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TermsAndConditions = () => {
  const [conditionsData, setConditionsData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await api.get("/terms-and-conditions");
      setConditionsData(response.data);
    } catch (error) {
      toast.error("Failed to fetch condition data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/terms-and-conditions/${selectedCondition.id}`);
      setConditionsData((prevData) =>
        prevData.filter((func) => func.id !== selectedCondition.id)
      );
      setShowDeleteModal(false);
      toast.success("Terms and Conditions deleted successfully!");
    } catch (error) {
      console.error("Error deleting terms and conditions:", error);
      toast.error("Failed to delete the terms and conditions!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/terms-and-conditions/${selectedCondition.id}`, {
        heading: selectedCondition.heading,
        description: selectedCondition.description,
      });

      const updatedFunctions = conditionsData.map((func) =>
        func.id === selectedCondition.id ? selectedCondition : func
      );
      setConditionsData(updatedFunctions);
      setShowEditModal(false);
      toast.success("Terms and Conditions updated successfully!");
    } catch (error) {
      toast.error("Failed to update the terms and conditions!");
    }
  };

  const handleEditClick = (func) => {
    setSelectedCondition({ ...func });
    setShowEditModal(true);
  };

  const handleDeleteClick = (func) => {
    setSelectedCondition(func);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedCondition({ ...selectedCondition, [name]: value });
  };

  const currentPageData = conditionsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(conditionsData.length / itemsPerPage);

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
                Terms & Conditions
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Terms & Conditions</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-terms-and-conditions"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Terms & Conditions
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Heading</th>
                          <th>Description</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((condition, index) => (
                            <tr key={condition.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{condition.heading}</td>
                              <td>{condition.description}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(condition)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(condition)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No terms & condition available.
                            </td>
                          </tr>
                        )}
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
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
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
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
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
                    <h5 className="modal-title">Edit Terms & Conditions</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Heading</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          name="heading"
                          value={selectedCondition?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control form-control-md"
                          name="description"
                          value={selectedCondition?.description || ""}
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
                    <h5>Are you sure you want to delete this condition?</h5>
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

export default TermsAndConditions;
