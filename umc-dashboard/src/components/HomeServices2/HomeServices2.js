import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeServices1 = () => {
  const [services, setServices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/home-services2");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching home services:", error);
      toast.error("Failed to fetch home services details!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/home-services2/${selectedServices.id}`);
      setServices(services.filter((w) => w.id !== selectedServices.id));
      setShowDeleteModal(false);
      toast.success("Home services deleted successfully!");
    } catch (error) {
      console.error("Error deleting home services:", error);
      toast.error("Failed to delete home services!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/home-services2/${selectedServices.id}`, {
        heading: selectedServices.heading,
        link: selectedServices.link,
      });
      const updatedServices = services.map((services) =>
        services.id === selectedServices.id ? selectedServices : services
      );
      setServices(updatedServices);
      setShowEditModal(false);
      toast.success("Home services updated successfully!");
    } catch (error) {
      console.error("Error updating home services:", error);
      toast.error("Failed to update the home services!");
    }
  };

  const handleEditClick = (news) => {
    setSelectedServices({ ...news });
    setShowEditModal(true);
  };

  const handleDeleteClick = (news) => {
    setSelectedServices(news);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedServices({ ...selectedServices, [name]: value });
  };

  const indexOfLastServices = currentPage * servicesPerPage;
  const indexOfFirstServices = indexOfLastServices - servicesPerPage;
  const currentServices = services.slice(indexOfFirstServices, indexOfLastServices);

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
                Home Service 2
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Home Service 2</h4>
                    </div>
                    <div className="col-6">
                      <Link
                        to="/add-home-services2"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Service
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Service heading</th>
                          <th>Service link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentServices.map((service, index) => (
                          <tr key={service.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * servicesPerPage}
                            </td>
                            <td>{service.heading}</td>
                            <td>
                              <Link to={service.link.startsWith("/") ? "#" : `${service.link}`} className="text-decoration-none" target={service.link.startsWith("/") ? "" : "_blank"} style={{ color: "#000" }}>
                                {service.link}
                              </Link>
                            </td>
                            <td className="text-center">
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
                    <h5 className="modal-title">Edit Home Service 2</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Service Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedServices?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Service Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedServices?.link || ""}
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

export default HomeServices1;
