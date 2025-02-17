import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoGallery = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryVideoData, setCategoryVideoData] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchCategoryVideoData = async () => {
    try {
      const response = await api.get("/video-categories");
      setCategoryVideoData(response.data);
      const allCategories = response.data;
      const filteredCategories = [];
      for (const category of allCategories) {
        const videoResponse = await api.get(`/category-videos/${category.id}`);
        if (videoResponse.data.length > 0) {
          filteredCategories.push(category);
        }
      }
      if (filteredCategories.length > 0) {
        setCategoryData(filteredCategories)
        setSelectedCategory(filteredCategories[0].id);
        handleCategoryChange(filteredCategories[0].id);
      }
    } catch (error) {
      toast.error("Failed to fetch Category data!");
    }
  };

  useEffect(() => {
    fetchCategoryVideoData();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    api.get(`/category-videos/${categoryId}`)
      .then((response) => setVideos(response.data))
      .catch((error) => toast.error("Failed to fetch videos!"));
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "category") {
        await api.delete(`/video-categories/${id}`);
        setCategoryVideoData(prevData => prevData.filter(item => item.id !== id));
      } else if (type === "categoryVideo") {
        await api.delete(`/category-videos/${id}`);
        setVideos(prevData => prevData.filter(item => item.id !== id));
        handleCategoryChange(selectedCategory);
      }
      fetchCategoryVideoData();
      toast.success(`${type === "category" ? "Category" : "Category Video"} deleted successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the entry!");
    } finally {
      closeModal();
    }
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "category" ? { name: item.name, language_code: item.language_code } : { video_url: item.video_url }
    );
    setModalType(type);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditData({});
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "category") {
        await api.put(`/video-categories/${selectedItem.id}`, {
          name: editData.name,
          language_code: editData.language_code,
        });
        setCategoryVideoData(
          categoryVideoData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, name: editData.name }
              : item
          )
        );
        fetchCategoryVideoData();
      }
      else if (modalType === "categoryVideo") {
        await api.put(`/category-videos/${selectedItem.id}`, { video_url: editData.video_url });
        setVideos(
          videos.map((item) =>
            item.id === selectedItem.id ? { ...item, video_url: editData.video_url } : item
          )
        );
        handleCategoryChange(selectedCategory);
      }
      toast.success(
        `${modalType === "category" ? "Category" : "Category Video"} data updated successfully!`
      );
      navigate("/video-gallery");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
    }
    closeModal();
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Gallery</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Video Gallery
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Category</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-video-category"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Category
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Category Name</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryVideoData.length > 0 ? (
                          categoryVideoData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item.name}</td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "category")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("category");
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
                            <td colSpan="3" className="text-center">No Category Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Category Videos</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-category-videos"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Category Video
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        {categoryData.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-responsive m-t-20">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Category Video</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCategory && videos.length > 0 ? (
                          videos.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <Link
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                  target="_blank"
                                  to={item.video_url}
                                >
                                  {item.video_url}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "categoryVideo")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("categoryVideo");
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
                            <td colSpan={3} className="text-center">No Category Video Data Available</td>
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
                      {modalType === "category"
                        ? "Edit Category"
                        : "Edit Category Video"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "category" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="language_code">
                            Select Language
                          </label>

                          <select
                            className="form-control"
                            name="language_code"
                            value={editData.language_code}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                language_code: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled>Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Category Name</label>
                          <input
                            className="form-control"
                            id="name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="video_url">Category Name</label>
                          <input
                            className="form-control"
                            id="video_url"
                            value={editData.video_url}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                video_url: e.target.value,
                              })
                            }
                          />
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
                    <h5>Are you sure you want to delete this item?</h5>
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

export default VideoGallery;
