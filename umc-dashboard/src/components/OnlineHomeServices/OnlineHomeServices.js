import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnlineHomeServices = () => {
  const [service, setService] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicePerPage = 10;

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await api.get("/online-services-home");
      setService(response.data);
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to fetch service data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/online-services-home/${selectedService.id}`);
      setService(service.filter((w) => w.id !== selectedService.id));
      setShowDeleteModal(false);
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete the service!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/online-services-home/${selectedService.id}`, {
        heading: selectedService.heading,
        link: selectedService.link,
      });
      const updatedService = service.map((service) =>
        service.id === selectedService.id ? selectedService : service
      );
      setService(updatedService);
      setShowEditModal(false);
      toast.success("Service updated successfully!");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update the service!");
    }
  };

  const handleEditClick = (service) => {
    setSelectedService({ ...service });
    setShowEditModal(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedService({ ...selectedService, [name]: value });
  };

  const indexOfLastService = currentPage * servicePerPage;
  const indexOfFirstService = indexOfLastService - servicePerPage;
  const currentService = service.slice(indexOfFirstService, indexOfLastService);

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
                Online Services
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Online Services</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-online-home-services"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Online Service
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Service Name</th>
                          <th>Service Link</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentService.map((service, index) => (
                          <tr key={service.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * servicePerPage}
                            </td>
                            <td>{service.heading}</td>
                            <td>{service.link}</td>
                            <td>
                              <button
                                onClick={() => handleEditClick(service)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(service)}
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
                { length: Math.ceil(service.length / servicePerPage) },
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
                className={`page-item ${currentPage === Math.ceil(service.length / servicePerPage)
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
                    <h5 className="modal-title">Edit Online Service</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Service Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedService?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Service Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedService?.link || ""}
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

export default OnlineHomeServices;
