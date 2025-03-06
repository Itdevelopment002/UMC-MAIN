import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

const BottomSlider = () => {
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

  const API_URL = "/bottom-sliders";

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    initLightbox();
  }, [links, currentPageData]);

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
          console.error("Error deleting slider link:", error);
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
        console.error("Error updating slider link:", error);
      });
  };

  const openEditModal = (websitelink) => {
    setEditLinkData({
      id: websitelink.id,
      websitelink: websitelink.websitelink,
      websitelogo: websitelink.websitelogo,
      websitelogoPreview: `${baseURL}${websitelink.websitelogo}`,
    });
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditLinkData({
          ...editLinkData,
          websitelogo: file,
          websitelogoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setEditLinkData({
        ...editLinkData,
        websitelogo: null,
        websitelogoPreview: `${baseURL}${editLinkData.websitelogo}`, // Fallback to the existing image
      });
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Bottom Slider
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Bottom Slider</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-bottom-slider"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Bottom Slider
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Slider Link</th>
                          <th className="text-center">Slider Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((websitelink, index) => (
                          <tr key={websitelink.id}>
                            <td className="text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              <Link to={websitelink.websitelink} className="text-decoration-none" style={{ color: "#000" }} target="_blank">
                                {websitelink.websitelink}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}${websitelink.websitelogo}`}
                                className="glightbox"
                                data-gallery="web-links-gallery"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}${websitelink.websitelogo}`}
                                  alt={websitelink.id}
                                  style={{ borderRadius: "5px" }}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
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
                <div>
                  <ul className="pagination mt-4">
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
                      { length: Math.ceil(links.length / itemsPerPage) },
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
                    {currentPage < Math.ceil(links.length / itemsPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(links.length / itemsPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(links.length / itemsPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(links.length / itemsPerPage) - 1)
                          }
                        >
                          {Math.ceil(links.length / itemsPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(links.length / itemsPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(links.length / itemsPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(links.length / itemsPerPage))
                          }
                        >
                          {Math.ceil(links.length / itemsPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(links.length / itemsPerPage)
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

          {showEditModal && (
            <div className="modal fade show d-block"
              style={{
                overflowY: "auto",
                maxHeight: "100vh",
                scrollbarWidth: "none",
              }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Bottom Slider</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="websitelink">Slider Link</label>
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
                        <label htmlFor="websitelogo">Slider Image</label>
                        <input
                          type="file"
                          id="websitelogo"
                          accept="image/*"
                          className="form-control"
                          onChange={handleFileChange}
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
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary" onClick={handleEditSubmit}>
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomSlider;
