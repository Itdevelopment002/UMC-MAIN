import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeServices2 = () => {
  const [info, setInfo] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const infoPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/home-services2");
      setInfo(response.data);
    } catch (error) {
      console.error("Error fetching home services:", error);
      toast.error("Failed to fetch home services details!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-home-services2/${selectedServices.id}`);
      setInfo(info.filter((w) => w.id !== selectedServices.id));
      setShowDeleteModal(false);
      toast.success("Home services deleted successfully!");
    } catch (error) {
      console.error("Error deleting home services:", error);
      toast.error("Failed to delete home services!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.post(`/edit-home-services2/${selectedServices.id}`, {
        heading: selectedServices.heading,
        link: selectedServices.link,
        language_code: selectedServices.language_code,
      });
      const updatedServices = info.map((services) =>
        services.id === selectedServices.id ? selectedServices : services
      );
      setInfo(updatedServices);
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

  const indexOfLastServices = currentPage * infoPerPage;
  const indexOfFirstServices = indexOfLastServices - infoPerPage;
  const currentServices = info.slice(indexOfFirstServices, indexOfLastServices);

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
                              {index + 1 + (currentPage - 1) * infoPerPage}
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
                    {Array.from(
                      { length: Math.ceil(info.length / infoPerPage) },
                      (_, i) => i + 1
                    )
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
                    {currentPage < Math.ceil(info.length / infoPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage) - 1)
                          }
                        >
                          {Math.ceil(info.length / infoPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage))
                          }
                        >
                          {Math.ceil(info.length / infoPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
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
                    <h5 className="modal-title">Edit Home Service 2</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          name="language_code"
                          value={selectedServices?.language_code || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
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

export default HomeServices2;
