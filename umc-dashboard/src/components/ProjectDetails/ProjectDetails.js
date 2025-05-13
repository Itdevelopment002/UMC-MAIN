import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectDetails = () => {
  const [selectedDepartmentDescription, setSelectedDepartmentDescription] = useState("");
  const [descriptionData, setDescriptionData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [descriptionCurrentPage, setDescriptionCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [objectURLs, setObjectURLs] = useState({ image: [] });
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDepartments();
    fetchDescriptionData();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/project-category");
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDescriptionData = async () => {
    try {
      const response = await api.get("/project-description");
      setDescriptionData(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch description data!");
    }
  };

  useEffect(() => {
    return () => {
      objectURLs.image.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectURLs]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      setSelectedFiles(newFiles);

      objectURLs.image.forEach((url) => URL.revokeObjectURL(url));

      setObjectURLs((prev) => ({
        ...prev,
        image: newFiles.map((file) => URL.createObjectURL(file)),
      }));
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    URL.revokeObjectURL(objectURLs.image[index]);

    setSelectedFiles(updatedFiles);
    setObjectURLs((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id, type) => {
    try {
      await api.post(`/delete-${type === "category" ? "project-category" : "project-description"}/${id}`);

      if (type === "category") {
        setDepartments((prev) => prev.filter((item) => item.id !== id));
      } else {
        setDescriptionData((prev) => prev.filter((item) => item.id !== id));
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the entry!");
    }
    closeModal();
  };

  const openEditModal = (item, type) => {
    if (!item) return;

    setSelectedItem(item);
    setSelectedFiles([]);
    setRemovedImages([]);

    let parsedGallery = [];
    let parsedSubDescriptions = [];

    if (type === "category") {
      try {
        parsedGallery =
          item.image && typeof item.image === "string"
            ? JSON.parse(item.image)
            : Array.isArray(item.image)
              ? item.image
              : [];
      } catch (error) {
        console.error("Error parsing gallery images:", error);
        parsedGallery = [];
      }
      setCurrentImages(parsedGallery);
    }

    if (type === "description") {
      parsedSubDescriptions = Array.isArray(item.subDescriptions)
        ? item.subDescriptions
        : typeof item.subDescriptions === "string" && item.subDescriptions.trim()
          ? item.subDescriptions.split(",")
          : [];
    }

    setEditData(
      type === "category"
        ? { ...item, image: parsedGallery }
        : { ...item, subDescriptions: parsedSubDescriptions }
    );

    setModalType(type);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setSelectedFiles([]);
    setCurrentImages([]);
    setRemovedImages([]);
    setEditData({});
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "description") {
        await api.post(`/edit-project-description/${selectedItem.id}`, {
          heading: editData.heading,
          description: editData.description,
          language_code: editData.language_code,
          subDescriptions: Array.isArray(editData.subDescriptions) ? editData.subDescriptions : [],
        });

        fetchDescriptionData();
      } else if (modalType === "category") {
        const formData = new FormData();
        formData.append("heading", editData.heading);
        formData.append("language_code", editData.language_code);

        currentImages.forEach((img) => {
          if (!removedImages.includes(img)) {
            formData.append("images", img);
          }
        });

        selectedFiles.forEach((file) => {
          formData.append("images", file); // Change "image" to "images"
        });

        await api.post(`/edit-project-category/${selectedItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fetchDepartments();
      }

      toast.success(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} updated successfully!`);
      navigate("/project-details");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
    }
    closeModal();
  };

  const departmentDescriptionOptions = Array.isArray(descriptionData)
    ? [...new Set(descriptionData.map((item) => item.heading))]
    : [];

  useEffect(() => {
    if (departmentDescriptionOptions.length > 0) {
      setSelectedDepartmentDescription(departmentDescriptionOptions[0]);
    }
    //eslint-disable-next-line
  }, [descriptionData]);

  const filteredDescriptionData = descriptionData.filter(
    (item) => item.heading === selectedDepartmentDescription
  );
  const startDescriptionIndex = (descriptionCurrentPage - 1) * itemsPerPage;
  const paginatedDescriptionData = filteredDescriptionData.slice(
    startDescriptionIndex,
    startDescriptionIndex + itemsPerPage
  );

  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const paginatedData = departments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Upcoming Projects</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Project Details
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Project Category</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-project-category"
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
                          <th style={{ width: '10%' }} className="text-center">Sr. No.</th>
                          <th >Project Heading</th>
                          <th className="text-center">Project Images</th>
                          <th style={{ width: '15%' }} className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((item, index) => (
                          <tr key={item.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item.heading}</td>
                            <td className="text-center">
                              <div className="d-flex flex-wrap">
                                {JSON.parse(item.images).map((img, imgIndex) => (
                                  <div key={imgIndex} className="position-relative me-2">
                                    <img
                                      src={`${baseURL}${img}`}
                                      alt={`image-${img}`}
                                      style={{ width: "50px", height: "50px", marginRight: "5px" }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => openEditModal(item, "category")}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setModalType("category");
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
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
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
                      <h4 className="page-title">Project Description</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-project-description"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Description
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <select
                        className="form-control"
                        value={selectedDepartmentDescription}
                        onChange={(e) => {
                          setSelectedDepartmentDescription(e.target.value);
                          setDescriptionCurrentPage(1);
                        }}
                      >
                        {departmentDescriptionOptions.map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
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
                          <th>Department Description</th>
                          <th>Sub Description</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDescriptionData.length > 0 ? (
                          paginatedDescriptionData.map((item, index) => {
                            const subDescriptions = Array.isArray(item.subDescriptions)
                              ? item.subDescriptions
                              : typeof item.subDescriptions === "string" && item.subDescriptions.length > 0
                                ? item.subDescriptions.split(",").map(subDesc => subDesc.trim())
                                : [];

                            return (
                              <React.Fragment key={item.id}>
                                <tr>
                                  <td rowSpan={subDescriptions.length || 1} className="text-center">
                                    {startDescriptionIndex + index + 1}
                                  </td>
                                  <td rowSpan={subDescriptions.length || 1}>{item.description}</td>
                                  <td>{subDescriptions.length > 0 ? subDescriptions[0] : "-"}</td>
                                  <td rowSpan={subDescriptions.length || 1} className="text-center">
                                    <button
                                      onClick={() => openEditModal(item, "description")}
                                      className="btn btn-success btn-sm m-t-10"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setModalType("description");
                                        setShowDeleteModal(true);
                                      }}
                                      className="btn btn-danger btn-sm m-t-10"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                                {subDescriptions.slice(1).map((subDesc, idx) => (
                                  <tr key={`${item.id}-sub-${idx}`}>
                                    <td>{subDesc}</td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No Description Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <ul className="pagination mt-4">
                    <li className={`page-item ${descriptionCurrentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setDescriptionCurrentPage(descriptionCurrentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {descriptionCurrentPage > 2 && (
                      <li className={`page-item ${descriptionCurrentPage === 1 ? "active" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setDescriptionCurrentPage(1)}
                        >
                          1
                        </button>
                      </li>
                    )}
                    {descriptionCurrentPage > 3 && (
                      <li className={`page-item ${descriptionCurrentPage === 2 ? "active" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setDescriptionCurrentPage(2)}
                        >
                          2
                        </button>
                      </li>
                    )}
                    {descriptionCurrentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {Array.from(
                      { length: Math.ceil(filteredDescriptionData.length / itemsPerPage) },
                      (_, i) => i + 1
                    )
                      .filter(
                        (page) =>
                          page >= descriptionCurrentPage - 1 &&
                          page <= descriptionCurrentPage + 1
                      )
                      .map((page) => (
                        <li
                          className={`page-item ${descriptionCurrentPage === page ? "active" : ""
                            }`}
                          key={page}
                        >
                          <button
                            className="page-link"
                            onClick={() => setDescriptionCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    {descriptionCurrentPage <
                      Math.ceil(filteredDescriptionData.length / itemsPerPage) - 3 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                    {descriptionCurrentPage <
                      Math.ceil(filteredDescriptionData.length / itemsPerPage) - 2 && (
                        <li
                          className={`page-item ${descriptionCurrentPage ===
                            Math.ceil(filteredDescriptionData.length / itemsPerPage) - 1
                            ? "active"
                            : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setDescriptionCurrentPage(
                                Math.ceil(filteredDescriptionData.length / itemsPerPage) - 1
                              )
                            }
                          >
                            {Math.ceil(filteredDescriptionData.length / itemsPerPage) - 1}
                          </button>
                        </li>
                      )}
                    {descriptionCurrentPage <
                      Math.ceil(filteredDescriptionData.length / itemsPerPage) - 1 && (
                        <li
                          className={`page-item ${descriptionCurrentPage ===
                            Math.ceil(filteredDescriptionData.length / itemsPerPage)
                            ? "active"
                            : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setDescriptionCurrentPage(
                                Math.ceil(filteredDescriptionData.length / itemsPerPage)
                              )
                            }
                          >
                            {Math.ceil(filteredDescriptionData.length / itemsPerPage)}
                          </button>
                        </li>
                      )}
                    <li
                      className={`page-item ${descriptionCurrentPage ===
                        Math.ceil(filteredDescriptionData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setDescriptionCurrentPage(descriptionCurrentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
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
                        ? "Edit Project Category"
                        : modalType === "description"
                          ? "Edit Department Description"
                          : "Edit Department Pdf"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "category" && (
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
                              setEditData({ ...editData, language_code: e.target.value })
                            }
                          >
                            <option value="" disabled>Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Project Heading</label>
                          <input
                            type="text"
                            className="form-control"
                            id="heading"
                            value={editData.heading}
                            onChange={(e) =>
                              setEditData({ ...editData, heading: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Project Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                          <div className="d-flex flex-wrap mt-2">
                            {objectURLs.image.map((url, index) => (
                              <div key={index} className="position-relative me-2">
                                <img
                                  src={url}
                                  alt={`image-${index+1}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    marginRight: "5px",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {modalType === "description" && (
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
                              setEditData({ ...editData, language_code: e.target.value })
                            }
                          >
                            <option value="" disabled>Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="heading">Department Name</label>
                          <select
                            className="form-control"
                            name="department"
                            value={editData.heading}
                            onChange={(e) =>
                              setEditData({ ...editData, heading: e.target.value })
                            }
                          >
                            <option value="" disabled>Select Department Name</option>
                            {departments.map((department) => (
                              <option value={department.heading} key={department.id}>
                                {department.heading}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="description">Department Description</label>
                          <input
                            type="text"
                            className="form-control"
                            id="description"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({ ...editData, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Sub-Descriptions</label>
                          {editData.subDescriptions.map((subDesc, index) => (
                            <div key={index} className="d-flex mb-2">
                              <input
                                type="text"
                                className="form-control"
                                value={subDesc}
                                onChange={(e) => {
                                  const newSubDescriptions = [...editData.subDescriptions];
                                  newSubDescriptions[index] = e.target.value;
                                  setEditData({ ...editData, subDescriptions: newSubDescriptions });
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm ml-2"
                                onClick={() => {
                                  const newSubDescriptions = editData.subDescriptions.filter((_, i) => i !== index);
                                  setEditData({ ...editData, subDescriptions: newSubDescriptions });
                                }}
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              setEditData({ ...editData, subDescriptions: [...editData.subDescriptions, ""] })
                            }
                          >
                            ➕ Add Sub-Description
                          </button>
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
    </div >
  );
};

export default ProjectDetails;
