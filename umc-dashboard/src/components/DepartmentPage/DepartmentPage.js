import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [errors, setErrors] = useState({
    heading: "",
    link: "",
    language_code: "",
    mainIcon: ""
  });
  const itemsPerPage = 10;
  const totalItems = departments.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [departments, currentDepartments]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
      setDepartments(sortedData);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDepartment?.heading?.trim()) {
      newErrors.heading = "Department Name is required";
    }
    if (!selectedDepartment?.link?.trim()) {
      newErrors.link = "Department Link is required";
    }
    if (!selectedDepartment?.language_code) {
      newErrors.language_code = "Language selection is required";
    }

    if (selectedDepartment?.mainIcon instanceof File) {
      const imageError = getImageValidationError(selectedDepartment.mainIcon);
      if (imageError) {
        newErrors.mainIcon = imageError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteModalOpen = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (departmentId) => {
    try {
      const response = await api.get(`/department-info/${departmentId}`);
      setSelectedDepartment(response.data);
      setImagePreview(`${baseURL}/${response.data.main_icon_path}`);
      setErrors({
        heading: "",
        link: "",
        language_code: "",
        mainIcon: ""
      });
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching department:", error);
      toast.error("Failed to fetch department details", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-department-info/${selectedDepartment.id}`);
      setDepartments(
        departments.filter((department) => department.id !== selectedDepartment.id)
      );
      setShowDeleteModal(false);
      toast.success("Department deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDepartment(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.error("Please fix errors before submitting.");
      return;
    }
    if (errors.mainIcon) {
      toast.error("Please fix errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", selectedDepartment.heading);
    formData.append("link", selectedDepartment.link);
    formData.append("language_code", selectedDepartment.language_code);

    if (selectedDepartment.mainIcon instanceof File) {
      formData.append("mainIcon", selectedDepartment.mainIcon);
    }

    try {
      await api.post(`/edit-department-info/${selectedDepartment.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchDepartments();
      setShowEditModal(false);
      toast.success("Department updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update department. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error updating department:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate the image file
      const errorMessage = getImageValidationError(file);

      if (errorMessage) {
        // Clear the file input if invalid file is selected
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Set error message
        setErrors({ ...errors, mainIcon: errorMessage });
        return;
      }

      setSelectedDepartment({
        ...selectedDepartment,
        mainIcon: file
      });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, mainIcon: "" });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Departments
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Departments</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-departments"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Department
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Department Name</th>
                          <th>Department Link</th>
                          <th className="text-center">Department Icon</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDepartments.map((department, index) => (
                          <tr key={department.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{department.heading}</td>
                            <td>
                              <a href={department.link} target="_blank" rel="noopener noreferrer">
                                {department.link}
                              </a>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`${baseURL}/${department.main_icon_path}`}
                                className="glightbox"
                                data-gallery="department-images"
                              >
                                <img
                                  width="35px"
                                  src={`${baseURL}/${department.main_icon_path}`}
                                  alt={department.heading}
                                  className="img-thumbnail"
                                />
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(department.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(department)}
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
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this department?</h5>
                  </div>
                  <div className="modal-footer">
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
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseEditModal();
                }
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Department</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={handleCloseEditModal}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.language_code ? "is-invalid" : ""}`}
                          value={selectedDepartment?.language_code || ""}
                          onChange={(e) => {
                            setSelectedDepartment({
                              ...selectedDepartment,
                              language_code: e.target.value,
                            });
                            if (errors.language_code) {
                              setErrors({ ...errors, language_code: "" });
                            }
                          }}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && (
                          <div className="invalid-feedback">{errors.language_code}</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Department Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.heading ? "is-invalid" : ""}`}
                          placeholder="Department Name"
                          value={selectedDepartment?.heading || ""}
                          onChange={(e) => {
                            setSelectedDepartment({
                              ...selectedDepartment,
                              heading: e.target.value,
                            });
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        />
                        {errors.heading && (
                          <div className="invalid-feedback">{errors.heading}</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Department Link <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.link ? "is-invalid" : ""}`}
                          placeholder="Department Link"
                          value={selectedDepartment?.link || ""}
                          onChange={(e) => {
                            setSelectedDepartment({
                              ...selectedDepartment,
                              link: e.target.value,
                            });
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <div className="invalid-feedback">{errors.link}</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Department Icon
                        </label>
                        <input
                          type="file"
                          className={`form-control ${errors.mainIcon ? "is-invalid" : ""}`}
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        {errors.mainIcon && (
                          <div className="invalid-feedback">{errors.mainIcon}</div>
                        )}
                        <small className="text-muted d-block mt-1">
                          📌 Note: Image Max size: 2MB.
                        </small>
                        {imagePreview && (
                          <div className="mt-2">
                            <img
                              src={imagePreview}
                              alt="preview"
                              width="100px"
                              className="img-thumbnail"
                            />
                          </div>
                        )}

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
    </>
  );
};

export default DepartmentPage;