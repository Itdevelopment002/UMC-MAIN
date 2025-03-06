import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeService1 = () => {
  const [info, setInfo] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const infoPerPage = 10;

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const response = await api.get("/home-services1");
      setInfo(response.data);
    } catch (error) {
      console.error("Error fetching home services:", error);
    }
  };

  const handleDeleteModalOpen = (initiative) => {
    setSelectedInitiative(initiative);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (initiativeId) => {
    try {
      const response = await api.get(`/home-services1/${initiativeId}`);
      setSelectedInitiative(response.data);
      setImagePreview(`${baseURL}/${response.data.main_icon_path}`);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching home services:", error);
      toast.error("Failed to fetch home services details");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/home-services1/${selectedInitiative.id}`);
      setInfo(
        info.filter((initiative) => initiative.id !== selectedInitiative.id)
      );
      setShowDeleteModal(false);
      toast.success("Home Service deleted successfully");
    } catch (error) {
      console.error("Error deleting home services:", error);
      toast.error("Failed to delete home services");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedInitiative(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedInitiative(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedInitiative.heading)
      formData.append("heading", selectedInitiative.heading);
    if (selectedInitiative.link)
      formData.append("link", selectedInitiative.link);
    if (selectedInitiative.language_code)
      formData.append("language_code", selectedInitiative.language_code);
    if (selectedInitiative.mainIcon)
      formData.append("mainIcon", selectedInitiative.mainIcon);

    try {
      await api.put(`/home-services1/${selectedInitiative.id}`, formData);
      fetchInitiatives();
      setShowEditModal(false);
      toast.success("Home Service updated successfully");
    } catch (error) {
      console.error("Error updating home service 1:", error);
      toast.error("Failed to update home service 1");
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedInitiative((prevInitiative) => ({ ...prevInitiative, [field]: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const indexOfLastServices = currentPage * infoPerPage;
  const indexOfFirstServices = indexOfLastServices - infoPerPage;
  const currentServices = info.slice(indexOfFirstServices, indexOfLastServices);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [info, currentServices]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Home Service 1
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-6">
                      <h4 className="page-title">Home Service 1</h4>
                    </div>
                    <div className="col-sm-8 col-6 text-right m-b-20">
                      <Link
                        to="/add-home-services1"
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
                          <th>Service Heading</th>
                          <th>Service Link</th>
                          <th className="text-center">Service Icon</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentServices.map((initiative, index) => (
                          <tr key={initiative.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * infoPerPage}
                            </td>
                            <td>{initiative.heading}</td>
                            <td>
                              <Link to={initiative.link.startsWith("/") ? "#" : `${initiative.link}`} className="text-decoration-none" target={initiative.link.startsWith("/") ? "" : "_blank"} style={{ color: "#000" }}>
                                {initiative.link}
                              </Link>
                            </td>
                            <td style={{ backgroundColor: "black" }} className="text-center">
                              <Link
                                to={`${baseURL}/${initiative.main_icon_path}`}
                                className="glightbox"
                                data-gallery="initiative-images"
                              >
                                <img
                                  width="35px"
                                  src={`${baseURL}/${initiative.main_icon_path}`}
                                  alt={initiative.heading}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(initiative.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(initiative)}
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

          {showDeleteModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer justify-content-right">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseDeleteModal}
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

          {showEditModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Home Service 1</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>
                        <select
                          className="form-control"
                          value={selectedInitiative?.language_code || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              language_code: e.target.value,
                            })
                          }
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
                          placeholder="Initiative Heading"
                          value={selectedInitiative?.heading || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              heading: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Service Link</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Initiative Link"
                          value={selectedInitiative?.link || ""}
                          onChange={(e) =>
                            setSelectedInitiative({
                              ...selectedInitiative,
                              link: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Service Icon
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            width="100px"
                            style={{ backgroundColor: "#000" }}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseEditModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default HomeService1;
