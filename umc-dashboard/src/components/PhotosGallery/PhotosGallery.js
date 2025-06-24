import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const PhotosGallery = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryImageData, setCategoryImageData] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    return () => {
      lightbox.destroy();
    };
  }, [images]);


  const fetchCategoryImageData = async () => {
    try {
      const response = await api.get("/categories");
      setCategoryImageData(response.data);
      const allCategories = response.data;
      const filteredCategories = [];
      for (const category of allCategories) {
        const imageResponse = await api.get(`/category-images/${category.id}`);
        if (imageResponse.data.length > 0) {
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
    fetchCategoryImageData();
    //eslint-disable-next-line
  }, []);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    api.get(`/category-images/${categoryId}`)
      .then((response) => setImages(response.data))
      .catch((error) => toast.error("Failed to fetch images!"));
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "category") {
        await api.post(`/delete-categories/${id}`);
        setCategoryImageData((prevData) => prevData.filter((item) => item.id !== id));
        fetchCategoryImageData();
      }
      else if (type === "categoryImage") {
        await api.post(`/delete-category-images/${id}`);
        setImages(images.filter((img) => img.id !== id));
        handleCategoryChange(selectedCategory);
        fetchCategoryImageData()
      }
      toast.success(
        `${type === "category" ? "Category" : "Category Image"} data deleted successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the entry!");
    }
    closeModal();
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "category" ? { name: item.name, language_code: item.language_code } : { ...item }
    );
    setImagePreview(type === "categoryImage" ? `${baseURL}${item.image_url}` : "");
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
      if (modalType === "category") {
        await api.post(`/edit-categories/${selectedItem.id}`, {
          name: editData.name,
          language_code: editData.language_code,
        });
        setCategoryImageData(
          categoryImageData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, name: editData.name }
              : item
          )
        );
        fetchCategoryImageData();
      }
      else if (modalType === "categoryImage") {
        const formData = new FormData();

        if (editData.imageFile) {
          formData.append("image", editData.imageFile);
        }

        await api.post(`/edit-category-images/${selectedItem.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setImages(
          images.map((item) =>
            item.id === selectedItem.id ? { ...item, ...editData } : item
          )
        );
        handleCategoryChange(selectedCategory);
      }
      toast.success(
        `${modalType === "category" ? "Category" : "Category Image"} data updated successfully!`
      );
      navigate("/photo-gallery");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
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
                <Link to="#">Gallery</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Photo Gallery
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
                        to="/add-category"
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
                        {categoryImageData.length > 0 ? (
                          categoryImageData.map((item, index) => (
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
                      <h4 className="page-title"> Category-wise Images</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-category-images"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Category Image
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
                          <th>Category Image</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCategory && images.length > 0 ? (
                          images.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <Link
                                  className="glightbox"
                                  to={`${baseURL}${item.image_url}`}
                                >
                                  <img
                                    src={`${baseURL}${item.image_url}`}
                                    alt={item.coName}
                                    style={{
                                      width: "100px",
                                    }}
                                  />
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "categoryImage")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("categoryImage");
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
                            <td colSpan={3} className="text-center">No Category Image Data Available</td>
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
                        : "Edit Category Image"}
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
                          <label htmlFor="coImage">Category Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "150px",
                                height: "100px",
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

export default PhotosGallery;
