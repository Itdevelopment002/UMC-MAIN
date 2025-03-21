import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WardOffice = () => {
  const [wardOffices, setWardOffices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWardOffice, setSelectedWardOffice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const wardOfficesPerPage = 5;

  useEffect(() => {
    fetchWardOffices();
  }, []);

  const fetchWardOffices = async () => {
    try {
      const response = await api.get("/ward-offices");
      setWardOffices(response.data);
    } catch (error) {
      console.error("Error fetching ward offices:", error);
      toast.error("Failed to fetch ward offices data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ward-offices/${selectedWardOffice.id}`);
      setWardOffices(wardOffices.filter((w) => w.id !== selectedWardOffice.id));
      setShowDeleteModal(false);
      toast.success("Ward office deleted successfully!");
    } catch (error) {
      console.error("Error deleting ward office:", error);
      toast.error("Failed to delete the ward office!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/ward-offices/${selectedWardOffice.id}`, {
        ward_no: selectedWardOffice.ward_no,
        ward_name: selectedWardOffice.ward_name,
        officer_name: selectedWardOffice.officer_name,
        address: selectedWardOffice.address,
        email: selectedWardOffice.email,
        mobile: selectedWardOffice.mobile,
        landline: selectedWardOffice.landline,
        areas: selectedWardOffice.areas,
        map_url: selectedWardOffice.map_url,
        language_code: selectedWardOffice.language_code,

      });
      const updatedWardOffices = wardOffices.map((wardOffice) =>
        wardOffice.id === selectedWardOffice.id ? selectedWardOffice : wardOffice
      );
      setWardOffices(updatedWardOffices);
      setShowEditModal(false);
      toast.success("Ward office updated successfully!");
    } catch (error) {
      console.error("Error updating ward office:", error);
      toast.error("Failed to update the ward office!");
    }
  };

  const handleEditClick = (wardOffice) => {
    setSelectedWardOffice({ ...wardOffice });
    setShowEditModal(true);
  };

  const handleDeleteClick = (wardOffice) => {
    setSelectedWardOffice(wardOffice);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedWardOffice({ ...selectedWardOffice, [name]: value });
  };

  const indexOfLastWardOffice = currentPage * wardOfficesPerPage;
  const indexOfFirstWardOffice = indexOfLastWardOffice - wardOfficesPerPage;
  const currentWardOffices = wardOffices.slice(
    indexOfFirstWardOffice,
    indexOfLastWardOffice
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Corporation</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Ward Offices
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Ward Offices</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-ward-office"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Ward Office
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Ward Name</th>
                          <th>Officer Name</th>
                          <th>Office Address</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Landline No.</th>
                          <th>Ward No</th>
                          <th>Areas</th>
                          <th width="20%">Iframe Src</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentWardOffices.map((wardOffice, index) => (
                          <tr key={wardOffice.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * wardOfficesPerPage}
                            </td>
                            <td>{wardOffice.ward_name}</td>
                            <td>{wardOffice.officer_name}</td>
                            <td>{wardOffice.address}</td>
                            <td>{wardOffice.email}</td>
                            <td>{wardOffice.mobile}</td>
                            <td>{wardOffice.landline}</td>
                            <td>{wardOffice.ward_no}</td>
                            <td>{wardOffice.areas}</td>
                            <td style={{ textWrap: "pretty", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {wardOffice.map_url.length > 15 ? `${wardOffice.map_url.slice(0, 30)}...` : wardOffice.map_url}
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => handleEditClick(wardOffice)}
                                className="btn btn-success btn-sm"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteClick(wardOffice)}
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
                      className={`page-item ${currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.ceil(wardOffices.length / wardOfficesPerPage) },
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
                      className={`page-item ${currentPage ===
                        Math.ceil(wardOffices.length / wardOfficesPerPage)
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
        </div>
      </div>
      <ToastContainer />
      {showEditModal && (
        <div id="editModal" className="modal fade show" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true" style={{ overflowY: 'auto', maxHeight: '100vh', scrollbarWidth: 'none', display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Ward Office</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">
                      Select Language
                    </label>

                    <select
                      className="form-control"
                      value={selectedWardOffice?.language_code || ""}
                      onChange={handleEditChange}
                      name="language_code"
                    >
                      <option value="">Select Language</option>
                      <option value="en">English</option>
                      <option value="mr">Marathi</option>
                    </select>
                    <label className="form-label">Ward No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ward_no"
                      value={selectedWardOffice?.ward_no || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ward Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ward_name"
                      value={selectedWardOffice?.ward_name || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Officer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="officer_name"
                      value={selectedWardOffice?.officer_name || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Office Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={selectedWardOffice?.address || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={selectedWardOffice?.email || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobile"
                      value={selectedWardOffice?.mobile || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Landline No.</label>
                    <input
                      type="text"
                      className="form-control"
                      name="landline"
                      value={selectedWardOffice?.landline || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Areas</label>
                    <input
                      type="text"
                      className="form-control"
                      name="areas"
                      value={selectedWardOffice?.areas || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Iframe Src</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      name="map_url"
                      value={selectedWardOffice?.map_url || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary me-2"
                      onClick={handleEditSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && (
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
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WardOffice;
