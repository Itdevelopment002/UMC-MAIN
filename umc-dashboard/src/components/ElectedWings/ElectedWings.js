import React, { useEffect, useState } from "react";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const ElectedWings = () => {
  const [correspondents, setCorrespondents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const electedsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCorrespondentId, setSelectedCorrespondentId] = useState(null);
  const [editData, setEditData] = useState({
    correspondentName: "",
    wardNo: "",
    startDate: "",
    endDate: "",
    mobileNo: "",
    image_path: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });

    return () => {
      lightbox.destroy();
    };
  }, [correspondents]);

  const fetchCorrespondents = async () => {
    try {
      const response = await api.get("/elected-wings");
      setCorrespondents(response.data);
    } catch (error) {
      toast.error("Failed to fetch correspondents!");
    }
  };

  useEffect(() => {
    fetchCorrespondents();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedCorrespondentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/elected-wings/${selectedCorrespondentId}`);
      setCorrespondents(
        correspondents.filter(
          (correspondent) => correspondent.id !== selectedCorrespondentId
        )
      );
      toast.success("Correspondent deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete correspondent!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditClick = (id) => {
    const correspondentToEdit = correspondents.find(
      (correspondent) => correspondent.id === id
    );
    setEditData(correspondentToEdit);
    setSelectedCorrespondentId(id);
    setShowEditModal(true);
    setImageFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formattedStartDate = editData.startDate
      ? formatDate(editData.startDate)
      : "";
    const formattedEndDate = editData.endDate
      ? formatDate(editData.endDate)
      : "";

    const formData = new FormData();
    formData.append("correspondentName", editData.correspondentName);
    formData.append("wardNo", editData.wardNo);
    formData.append("startDate", formattedStartDate);
    formData.append("endDate", formattedEndDate);
    formData.append("mobileNo", editData.mobileNo);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await api.put(`/elected-wings/${selectedCorrespondentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Correspondent updated successfully!");
      fetchCorrespondents();
    } catch (error) {
      toast.error("Failed to update correspondent!");
    } finally {
      setShowEditModal(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // Show a preview of the image
    if (file) {
      setEditData((prevData) => ({
        ...prevData,
        image_path: URL.createObjectURL(file),
      }));
    }
  };

  const indexOfLastElected = currentPage * electedsPerPage;
  const indexOfFirstElected = indexOfLastElected - electedsPerPage;
  const currentElecteds = correspondents.slice(
    indexOfFirstElected,
    indexOfLastElected
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">About KBMC</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Elected Wings
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Elected Wings</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-elected-wings"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Correspondent
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Ward No.</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Mobile</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentElecteds.map((correspondent, index) => (
                          <tr key={correspondent.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link
                                to={`${baseURL}${correspondent.image_path}`}
                                className="glightbox"
                              >
                                <img
                                  width="50px"
                                  src={`${baseURL}${correspondent.image_path}`}
                                  alt={`correspondent${index + 1}`}
                                />
                              </Link>
                            </td>
                            <td>{correspondent.correspondentName}</td>
                            <td>{correspondent.wardNo}</td>
                            <td>
                              {new Date(correspondent.startDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")}
                            </td>
                            <td>
                              {new Date(correspondent.endDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")}
                            </td>
                            <td>{correspondent.mobileNo}</td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() =>
                                  handleEditClick(correspondent.id)
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() =>
                                  handleDeleteClick(correspondent.id)
                                }
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
                { length: Math.ceil(correspondents.length / electedsPerPage) },
                (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
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
                  currentPage ===
                  Math.ceil(correspondents.length / electedsPerPage)
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
                      onClick={confirmDelete}
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
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Correspondent</h5>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-3">
                        <label
                          htmlFor="correspondentName"
                          className="form-label"
                        >
                          Correspondent Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          id="correspondentName"
                          name="correspondentName"
                          value={editData.correspondentName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="wardNo" className="form-label">
                          Ward No.
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          id="wardNo"
                          name="wardNo"
                          value={editData.wardNo}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">
                          Start Date
                        </label>
                        <Flatpickr
                          id="startDate"
                          value={
                            editData.startDate
                              ? new Date(editData.startDate)
                              : ""
                          }
                          onChange={(date) =>
                            handleFormChange({
                              target: { name: "startDate", value: date[0] },
                            })
                          }
                          className="form-control form-control-md"
                          options={{ dateFormat: "d-m-Y" }}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">
                          End Date
                        </label>
                        <Flatpickr
                          id="endDate"
                          value={
                            editData.endDate ? new Date(editData.endDate) : ""
                          }
                          onChange={(date) =>
                            handleFormChange({
                              target: { name: "endDate", value: date[0] },
                            })
                          }
                          className="form-control form-control-md"
                          options={{ dateFormat: "d-m-Y" }}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="mobileNo" className="form-label">
                          Mobile No.
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          id="mobileNo"
                          name="mobileNo"
                          value={editData.mobileNo}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="uploadImage" className="form-label">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-md"
                          id="uploadImage"
                          onChange={handleImageChange}
                        />
                      </div>

                      <div className="mb-3">
                        {imageFile ? (
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            width="100"
                          />
                        ) : (
                          editData.image_path && (
                            <img
                              src={`${baseURL}${editData.image_path}`}
                              alt="Current"
                              width="100"
                            />
                          )
                        )}
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
                      type="submit"
                      className="btn btn-primary btn-sm"
                      onClick={handleEditSubmit}
                    >
                      Save Changes
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

export default ElectedWings;
