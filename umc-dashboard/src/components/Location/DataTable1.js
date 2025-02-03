import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DataTable1 = () => {
  const [policyData, setPolicyData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await api.get("/location-info");
      setPolicyData(response.data);
    } catch (error) {
      toast.error("Failed to fetch table 1 data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/location-info/${selectedPolicy.id}`);
      setPolicyData((prevData) =>
        prevData.filter((policy) => policy.id !== selectedPolicy.id)
      );
      setShowDeleteModal(false);
      toast.success("Table 1 data deleted successfully!");
    } catch (error) {
      console.error("Error deleting table 1 data:", error);
      toast.error("Failed to delete the table 1 data!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/location-info/${selectedPolicy.id}`, {
        heading: selectedPolicy.heading,
        description: selectedPolicy.description,
      });

      const updatedPolicy = policyData.map((policy) =>
        policy.id === selectedPolicy.id ? selectedPolicy : policy
      );
      setPolicyData(updatedPolicy);
      setShowEditModal(false);
      toast.success("Table 1 data updated successfully!");
    } catch (error) {
      toast.error("Failed to update the table 1 data!");
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

  const currentPageData = policyData
    .filter((policy) => policy.type === "Table 1") // Filter for "Table 1" type
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(
    policyData.filter((policy) => policy.type === "Table 1").length / itemsPerPage
  );

  const handleLinkClick = (type) => {
    setSelectedType(type);
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <div className="card-block">
              <div className="row">
                <div className="col-6">
                  <h4 className="page-title">Table 1 Data</h4>
                </div>
                <div className="col-6 text-right m-b-20">
                  <Link
                    to="/add-datatable1"
                    onClick={() => handleLinkClick("Table 1")}
                    className="btn btn-primary btn-rounded float-right"
                  >
                    <i className="fa fa-plus"></i> Add Data 1
                  </Link>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered m-b-0">
                  <thead>
                    <tr>
                      <th width="10%" className="text-center">Sr. No.</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th width="15%" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.length > 0 ? (
                      currentPageData.map((policy, index) => (
                        <tr key={policy.id}>
                          <td className="text-center">
                            {((currentPage - 1) * itemsPerPage) + (index + 1)}
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
                          No data available.
                        </td>
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
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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

      {selectedType && (
        <Link
          to={`/add-datatable${selectedType.slice(-1)}`}
          className="btn btn-primary btn-rounded mt-3"
        >
          Go to {selectedType} Form
        </Link>
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
                <h5 className="modal-title">Edit Table 1 Data</h5>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control form-control-md"
                      name="heading"
                      value={selectedPolicy?.heading || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
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
      <ToastContainer />
    </div>
  );
};

export default DataTable1;
