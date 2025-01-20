import React, { useState, useEffect } from "react";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  let lightbox = null;

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    initLightbox();
    // eslint-disable-next-line
  }, [sliders, currentPage]);

  const initLightbox = () => {
    if (lightbox) {
      lightbox.destroy();
    }
    lightbox = GLightbox({ selector: ".glightbox" });
  };

  const fetchSliders = async () => {
    try {
      const response = await api.get("/sliders");
      setSliders(response.data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const handleDelete = (slider) => {
    setSelectedSlider(slider);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/sliders/${selectedSlider.id}`);
      setSliders(sliders.filter((slider) => slider.id !== selectedSlider.id));
      toast.success("Slider deleted successfully!");
      setShowDeleteModal(false);
      setSelectedSlider(null);
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Error deleting slider!");
    }
  };

  const handleEdit = (slider) => {
    setSelectedSlider(slider);
    setShowEditModal(true);
    setSelectedFile(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedSlider.slider_name) {
      formData.append("slider_name", selectedSlider.slider_name);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await api.put(`/sliders/${selectedSlider.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchSliders();
      toast.success("Slider updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Error updating slider!");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedSlider({ ...selectedSlider, image: imageUrl });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(sliders.length / itemsPerPage);
  const currentPageData = sliders.slice(
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
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Slider
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Slider</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-slider"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Slider
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Image Name</th>
                          <th>Slider Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.map((slider, index) => (
                          <tr key={slider.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td>{slider.slider_name}</td>
                            <td>
                              <Link
                                to={`${baseURL}/${slider.file_path}`}
                                className="glightbox"
                                data-gallery="slider-images"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}${slider.file_path}`}
                                  alt={`slider${index + 1}`}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEdit(slider)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDelete(slider)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="pagination mt-3">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
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
                    <h5 className="modal-title">Edit Slider</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Slider Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSlider?.slider_name || ""}
                        onChange={(e) =>
                          setSelectedSlider({
                            ...selectedSlider,
                            slider_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Slider Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    {selectedSlider?.image && (
                      <div className="form-group">
                        <img
                          src={selectedSlider.image}
                          alt="Preview"
                          width="20%"
                          className="img-thumbnail"
                        />
                      </div>
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

export default Slider;
