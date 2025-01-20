import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

const GovernmentWebsiteLinks = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLinkData, setEditLinkData] = useState({
    id: "",
    websitelink: "",
    websitelogo: "",
    websitelogoPreview: "",
  });
  const [links, setLinks] = useState([]);
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentPageData = links.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const API_URL = "/websitelinks";

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    initLightbox();
  }, [links]);

  const initLightbox = () => {
    GLightbox({
      selector: ".glightbox",
    });
  };

  const fetchLinks = () => {
    api
      .get(API_URL)
      .then((response) => {
        setLinks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleDeleteConfirm = () => {
    if (selectedLinkId) {
      api
        .delete(`${API_URL}/${selectedLinkId}`)
        .then(() => {
          setLinks(
            links.filter((websitelink) => websitelink.id !== selectedLinkId)
          );
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting websitelink:", error);
        });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("websitelink", editLinkData.websitelink);

    if (editLinkData.websitelogo instanceof File) {
      formData.append("websitelogo", editLinkData.websitelogo);
    }

    const updatedLinks = links.map((websitelink) =>
      websitelink.id === editLinkData.id
        ? {
            ...websitelink,
            websitelink: editLinkData.websitelink,
            websitelogo:
              editLinkData.websitelogo instanceof File
                ? URL.createObjectURL(editLinkData.websitelogo)
                : websitelink.websitelogo,
          }
        : websitelink
    );
    setLinks(updatedLinks);

    api
      .put(`${API_URL}/${editLinkData.id}`, formData)
      .then((response) => {
        setLinks(
          links.map((websitelink) =>
            websitelink.id === editLinkData.id ? response.data : websitelink
          )
        );
        setShowEditModal(false);
        fetchLinks();
      })
      .catch((error) => {
        console.error("Error updating websitelink:", error);
      });
  };

  const openEditModal = (websitelink) => {
    setEditLinkData({
      id: websitelink.id,
      websitelink: websitelink.websitelink,
      websitelogo: websitelink.websitelogo,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Govt. Website Link
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Govt. Website Link</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-gov-website-link"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Link
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Govt. Website Link</th>
                          <th>Govt. Website Logo</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((websitelink, index) => (
                          <tr key={websitelink.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{websitelink.websitelink}</td>
                            <td>
                              <Link
                                to={`${baseURL}${websitelink.websitelogo}`}
                                className="glightbox"
                                data-gallery="web-links-gallery"
                              >
                                <img
                                  width="50px"
                                  src={`${baseURL}${websitelink.websitelogo}`}
                                  alt={websitelink.id}
                                  style={{ borderRadius: "5px" }}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => openEditModal(websitelink)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10 mx-1"
                                onClick={() => {
                                  setSelectedLinkId(websitelink.id);
                                  setShowDeleteModal(true);
                                }}
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

          <div>
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
                { length: Math.ceil(links.length / itemsPerPage) },
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
                  currentPage === Math.ceil(links.length / itemsPerPage)
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

          {/* Delete Modal */}
          <div
            className={`modal fade ${showDeleteModal ? "show" : ""}`}
            style={{ display: showDeleteModal ? "block" : "none" }}
            id="deleteModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <h5>Are you sure you want to delete this item?</h5>
                </div>
                <div className="modal-footer text-center">
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
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          <div
            className={`modal fade ${showEditModal ? "show" : ""}`}
            style={{ display: showEditModal ? "block" : "none" }}
            id="editModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <h5 className="mb-3">Edit Govt. Website Link</h5>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label htmlFor="websitelink">Website Link</label>
                      <input
                        type="text"
                        id="websitelink"
                        className="form-control"
                        value={editLinkData.websitelink}
                        onChange={(e) =>
                          setEditLinkData({
                            ...editLinkData,
                            websitelink: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="websitelogo">Website Logo</label>
                      <input
                        type="file"
                        id="websitelogo"
                        className="form-control"
                        onChange={(e) =>
                          setEditLinkData({
                            ...editLinkData,
                            websitelogo: e.target.files[0],
                          })
                        }
                      />
                      {editLinkData.websitelogoPreview && (
                        <img
                          src={editLinkData.websitelogoPreview}
                          alt="Preview"
                          width="100px"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-sm btn-primary">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GovernmentWebsiteLinks;
