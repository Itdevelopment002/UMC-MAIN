import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PropertyTaxDept = () => {
  const [tax, setTax] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const taxPerPage = 10;

  useEffect(() => {
    fetchTax();
  }, []);

  const fetchTax = async () => {
    try {
      const response = await api.get("/property-dept");
      setTax(response.data.reverse());
    } catch (error) {
      console.error("Error fetching property tax data:", error);
      toast.error("Failed to fetch property tax data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/property-dept/${selectedTax.id}`);
      setTax(tax.filter((w) => w.id !== selectedTax.id));
      setShowDeleteModal(false);
      toast.success("Tax deleted successfully!");
    } catch (error) {
      console.error("Error deleting property tax data:", error);
      toast.error("Failed to delete the property tax data!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/property-dept/${selectedTax.id}`, {
        description: selectedTax.description,
        link: selectedTax.link,
      });
      const updatedTax = tax.map((tax) =>
        tax.id === selectedTax.id ? selectedTax : tax
      );
      setTax(updatedTax);
      setShowEditModal(false);
      toast.success("Tax updated successfully!");
    } catch (error) {
      console.error("Error updating property tax data:", error);
      toast.error("Failed to update the property tax data!");
    }
  };

  const handleEditClick = (tax) => {
    setSelectedTax({ ...tax });
    setShowEditModal(true);
  };

  const handleDeleteClick = (tax) => {
    setSelectedTax(tax);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedTax({ ...selectedTax, [name]: value });
  };

  const indexOfLastTax = currentPage * taxPerPage;
  const indexOfFirstTax = indexOfLastTax - taxPerPage;
  const currentTax = tax.slice(indexOfFirstTax, indexOfLastTax);

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
                Property Tax Department
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Property Tax Department</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-property-tax-department"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Property Tax
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Description</th>
                          <th>Link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTax.length > 0 ? (
                          currentTax.map((tax, index) => (
                            <tr key={tax.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * taxPerPage}
                              </td>
                              <td>{tax.description}</td>
                              <td>
                                <Link
                                  to={tax.link}
                                  target="_blank"
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {tax.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(tax)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(tax)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No Property tax data available</td>
                          </tr>
                        )}

                      </tbody>
                    </table>
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
                    {Array.from(
                      { length: Math.ceil(tax.length / taxPerPage) },
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
                      className={`page-item ${currentPage === Math.ceil(tax.length / taxPerPage)
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
                    <h5 className="modal-title">Edit Solid Waste Management System</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={selectedTax?.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedTax?.link || ""}
                          onChange={handleEditChange}
                        />
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
                    <h5>Are you sure you want to delete this entry?</h5>
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

export default PropertyTaxDept;
