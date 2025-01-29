import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Administration = () => {
  const [administration, setAdministration] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdministration, setSelectedAdministration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const administrationPerPage = 10;

  useEffect(() => {
    fetchAdministrative();
  }, []);

  const fetchAdministrative = async () => {
    try {
      const response = await api.get("/administration");
      setAdministration(response.data);
    } catch (error) {
      console.error("Error fetching administrations:", error);
      toast.error("Failed to fetch administration data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/administration/${selectedAdministration.id}`);
      setAdministration(administration.filter((w) => w.id !== selectedAdministration.id));
      setShowDeleteModal(false);
      toast.success("Administration deleted successfully!");
    } catch (error) {
      console.error("Error deleting Administration:", error);
      toast.error("Failed to delete the Administration!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/administration/${selectedAdministration.id}`, {
        name: selectedAdministration.name,
        designation: selectedAdministration.designation,
        phone: selectedAdministration.phone,
      });
      const updatedadministration = administration.map((administration) =>
        administration.id === selectedAdministration.id ? selectedAdministration : administration
      );
      setAdministration(updatedadministration);
      setShowEditModal(false);
      toast.success("administration updated successfully!");
    } catch (error) {
      console.error("Error updating administration:", error);
      toast.error("Failed to update the administration!");
    }
  };

  const handleEditClick = (administration) => {
    setSelectedAdministration({ ...administration });
    setShowEditModal(true);
  };

  const handleDeleteClick = (administration) => {
    setSelectedAdministration(administration);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdministration({ ...selectedAdministration, [name]: value });
  };

  const indexOfLastAdministration = currentPage * administrationPerPage;
  const indexOfFirstAdministration = indexOfLastAdministration - administrationPerPage;
  const currentadministration = administration.slice(indexOfFirstAdministration, indexOfLastAdministration);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Corporation</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Administration
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Administration</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-adminstration"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Administration
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Phone No.</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentadministration.map((administration, index) => (
                          <tr key={administration.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * administrationPerPage}
                            </td>
                            <td>{administration.name}</td>
                            <td>{administration.designation}</td>
                            <td>{administration.phone}</td>
                            <td>
                              <button
                                onClick={() => handleEditClick(administration)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(administration)}
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
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from(
                { length: Math.ceil(administration.length / administrationPerPage) },
                (_, i) => (
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
                )
              )}
              <li
                className={`page-item ${
                  currentPage === Math.ceil(administration.length / administrationPerPage)
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
                    <h5 className="modal-title">Edit Administration</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={selectedAdministration?.name || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          name="designation"
                          value={selectedAdministration?.designation || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone No.</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={selectedAdministration?.phone || ""}
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

export default Administration;
