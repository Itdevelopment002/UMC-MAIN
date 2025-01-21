import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Initiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState(null);

  useEffect(() => {
    fetchInitiatives();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [initiatives]);

  const fetchInitiatives = async () => {
    try {
      const response = await api.get("/initiatives");
      setInitiatives(response.data);
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    }
  };

  const handleDeleteModalOpen = (initiative) => {
    setSelectedInitiative(initiative);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (initiativeId) => {
    try {
      const response = await api.get(`/initiatives/${initiativeId}`);
      setSelectedInitiative(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching initiative:", error);
      toast.error("Failed to fetch initiative details");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/initiatives/${selectedInitiative.id}`);
      setInitiatives(
        initiatives.filter((initiative) => initiative.id !== selectedInitiative.id)
      );
      setShowDeleteModal(false);
      toast.success("Initiative deleted successfully");
    } catch (error) {
      console.error("Error deleting initiative:", error);
      toast.error("Failed to delete initiative");
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
    if (selectedInitiative.mainIcon)
      formData.append("mainIcon", selectedInitiative.mainIcon);

    try {
      await api.put(`/initiatives/${selectedInitiative.id}`, formData);
      fetchInitiatives();
      setShowEditModal(false);
      toast.success("Initiative updated successfully");
    } catch (error) {
      console.error("Error updating initiative:", error);
      toast.error("Failed to update initiative");
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedInitiative((prevInitiative) => ({ ...prevInitiative, [field]: file }));
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Initiatives-Programme
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Initiatives-Programme</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-initiatives"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Initiatives-Programme
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Initiative Heading</th>
                          <th>Initiative Link</th>
                          <th>Initiative Icon</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initiatives.map((initiative, index) => (
                          <tr key={initiative.id}>
                            <td>{index + 1}</td>
                            <td>{initiative.heading}</td>
                            <td>{initiative.link}</td>
                            <td>
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
                            <td>
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
                    <h5>Are you sure you want to delete this service?</h5>
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
                    <h5 className="modal-title">Edit Initiatives-Programme</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Initiative Heading</label>
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
                        <label className="form-label">Initiative Link</label>
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
                        Initiative Icon
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                        />
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
                      className="btn brn-sm btn-primary"
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

export default Initiatives;
