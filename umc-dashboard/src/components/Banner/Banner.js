import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  let lightbox = null;

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    initLightbox();
    // eslint-disable-next-line
  }, [banners, currentPage]);

  const initLightbox = () => {
    if (lightbox) {
      lightbox.destroy();
    }
    lightbox = GLightbox({ selector: ".glightbox" });
  };

  const fetchBanners = async () => {
    try {
      const response = await api.get("/banner");
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleDelete = (banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/banner/${selectedBanner.id}`);
      setBanners(banners.filter((banner) => banner.id !== selectedBanner.id));
      toast.success("Banner deleted successfully!");
      setShowDeleteModal(false);
      setSelectedBanner(null);
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner!");
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setShowEditModal(true);
    setImagePreview(`${baseURL}/${banner.file_path}`);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedBanner.banner_name) {
      formData.append("banner_name", selectedBanner.banner_name);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await api.put(`/banner/${selectedBanner.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchBanners();
      toast.success("Banner updated successfully!");
      setImagePreview(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Error updating banner!");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedBanner({ ...selectedBanner, image: imageUrl });
      setImagePreview(imageUrl);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const currentPageData = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                Banner
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-12">
                      <h4 className="page-title">Banner</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-banner"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Banner
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Banner Name</th>
                          <th className="text-center">Banner Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((banner, index) => (
                          <tr key={banner.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td>{banner.banner_name}</td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}/${banner.file_path}`}
                                className="glightbox"
                                data-gallery="banner-images"
                              >
                                <img
                                  width="150px"
                                  height="20px"
                                  src={`${baseURL}${banner.file_path}`}
                                  alt={`banner-${index + 1}`}
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEdit(banner)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDelete(banner)}
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
                <ul className="pagination mt-4">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {currentPage > 2 && (
                    <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>
                        1
                      </button>
                    </li>
                  )}
                  {currentPage > 3 && (
                    <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(2)}>
                        2
                      </button>
                    </li>
                  )}
                  {currentPage > 4 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
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
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  {currentPage < totalPages - 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {currentPage < totalPages - 2 && (
                    <li
                      className={`page-item ${currentPage === totalPages - 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages - 1)}
                      >
                        {totalPages - 1}
                      </button>
                    </li>
                  )}
                  {currentPage < totalPages - 1 && (
                    <li
                      className={`page-item ${currentPage === totalPages ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {showDeleteModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
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
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Banner</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Banner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedBanner?.banner_name || ""}
                        onChange={(e) =>
                          setSelectedBanner({
                            ...selectedBanner,
                            banner_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Banner Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="preview"
                        width="50%"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
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
    </div>
  );
};

export default Banner;
