import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import api, { baseURL } from "../api";

const Awards = () => {
  const [awardData, setAwardData] = useState([]);
  const [awardImageData, setAwardImageData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchAwardData();
    fetchAwardImageData();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    return () => {
      lightbox.destroy();
    };
  }, [awardImageData]);

  const fetchAwardData = async () => {
    try {
      const response = await api.get("/awards");
      setAwardData(response.data);
    } catch (error) {
      toast.error("Failed to fetch award data.");
    }
  };

  const fetchAwardImageData = async () => {
    try {
      const response = await api.get("/award-images");
      setAwardImageData(response.data);
    } catch (error) {
      toast.error("Failed to fetch Award Images.");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "award") {
        await api.delete(`/awards/${id}`);
        setAwardData((prevData) => prevData.filter((item) => item.id !== id));
      } else if (type === "awardImage") {
        await api.delete(`/award-images/${id}`);
        setAwardImageData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      }
      toast.success(
        `${type === "award" ? "Award" : "Award image"} deleted successfully.`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the entry.");
    }
    closeModal();
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "award"
        ? { heading: item.heading, description: item.description }
        : { ...item }
    );
    setImagePreview(
      type === "awardImage" ? `${baseURL}${item.image_path}` : ""
    );
    setModalType(type);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditData({});
    setImagePreview("");
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "award") {
        await api.put(`/awards/${selectedItem.id}`, {
          heading: editData.heading,
          description: editData.description,
        });
        setAwardData(
          awardData.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  heading: editData.heading,
                  description: editData.description,
                }
              : item
          )
        );
        fetchAwardData();
      } else if (modalType === "awardImage") {
        const formData = new FormData();
        if (editData.imageFile) {
          formData.append("awardImage", editData.imageFile);
        }

        await api.put(`/award-images/${selectedItem.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAwardImageData(
          awardImageData.map((item) =>
            item.id === selectedItem.id ? { ...item, ...editData } : item
          )
        );
        fetchAwardImageData();
      }
      toast.success(
        `${
          modalType === "award" ? "Award" : "Award image"
        } updated successfully.`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry.");
    }
    closeModal();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData({ ...editData, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#.">About KBMC</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Awards
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Awards</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-awards"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Awards
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
                        {awardData.length > 0 ? (
                          awardData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.heading}</td>
                              <td>{item.description}</td>
                              <td>
                                <button
                                  onClick={() => openEditModal(item, "award")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("award");
                                    setShowDeleteModal(true);
                                  }}
                                  className="btn btn-danger btn-sm m-t-10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No Award Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="row m-t-50">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Award Images</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-award-images"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Award Images
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Award Image</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awardImageData.length > 0 ? (
                          awardImageData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>
                                <Link
                                  className="glightbox"
                                  to={`${baseURL}${item.image_path}`}
                                >
                                  <img
                                    src={`${baseURL}${item.image_path}`}
                                    alt={item.coName}
                                    style={{
                                      width: "100px",
                                    }}
                                  />
                                </Link>
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    openEditModal(item, "awardImage")
                                  }
                                  className="btn btn-success btn-sm m-t-10 mx-1"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("awardImage");
                                    setShowDeleteModal(true);
                                  }}
                                  className="btn btn-danger btn-sm m-t-10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No Award image Data Available</td>
                          </tr>
                        )}
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
                    <h5 className="modal-title">
                      {modalType === "award"
                        ? "Edit Award"
                        : "Edit Award Image"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "award" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="heading">Heading</label>
                          <input
                            type="text"
                            className="form-control"
                            id="heading"
                            value={editData.heading}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                heading: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <textarea
                            className="form-control"
                            id="description"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="coImage">Award Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="awardImage"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "100px",
                                marginTop: "10px",
                              }}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveChanges}
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
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(selectedItem.id, modalType)}
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

export default Awards;
