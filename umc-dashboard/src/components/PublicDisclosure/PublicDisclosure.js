import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const PublicDisclosure = ({ fetchDepartments, fetchDepartmentData }) => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const departmentsPerPage = 10;

  const fetchDeptDatas = async () => {
    try {
      const response = await api.get("/public_disclosure");
      setDepartments(response.data);
      // eslint-disable-next-line
      const ids = response.data.map((department) => department.id);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchDeptDatas();
  }, []);

  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = departments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  );

  const totalPages = Math.ceil(departments.length / departmentsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // eslint-disable-next-line
        const response = await api.post(
          "/public_disclosure",
          {
            department_name: newDepartment,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const updatedDepartments = await api.get("/public_disclosure");
        const newDepartmentEntry = updatedDepartments.data.find(
          (dept) => dept.department_name === newDepartment
        );

        if (!newDepartmentEntry) {
          throw new Error("Unable to find the added department.");
        }

        const newId = newDepartmentEntry.id;

        const currentDate = new Date();
        const date = currentDate.toISOString().split("T")[0];
        const time = currentDate.toTimeString().split(" ")[0];

        const notificationData = {
          description: `New Department: ${newDepartment}`,
          role: "Admin",
          name: "public_disclosure",
          new_id: newId,
          date,
          time,
        };

        await api.post("/admin-notifications", notificationData);

        const notificationAdminData = {
          heading: "Request Generated",
          description: `A request has been generated for New department: ${newDepartment}`,
          role: "Admin",
          readed: 0,
        };
        // eslint-disable-next-line
        const notificationResponse = await api.post(
          "/notification",
          notificationAdminData
        );

        setDepartments([
          ...departments,
          { id: newId, department_name: newDepartment },
        ]);

        setNewDepartment("");
        setErrors({});
        await fetchDepartmentData();
        await fetchDepartments();
        fetchDeptDatas();

        toast.success("Department added successfully!");
      } catch (error) {
        console.error("Error adding department:", error);
        toast.error("Failed to add department. Please try again.");
      }
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    if (!selectedDepartment || !selectedDepartment.id) {
      console.error("Selected department or department ID is missing.");
      return;
    }

    try {
      const response = await api.put(
        `/public_disclosure/${selectedDepartment.id}`,
        { department_name: selectedDepartment.department_name },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setDepartments((prevDepartments) =>
          prevDepartments.map((dept) =>
            dept.id === selectedDepartment.id
              ? { ...dept, department_name: selectedDepartment.department_name }
              : dept
          )
        );
        await fetchDepartmentData();
        await fetchDepartments();
        fetchDeptDatas();
        setIsEditModalOpen(false);
        setSelectedDepartment(null);
        toast.success("Department updated successfully!");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Error updating department!");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await api.delete(`/public_disclosure/${selectedDepartment.id}`);
      setDepartments((prev) =>
        prev.filter((department) => department.id !== selectedDepartment.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
      toast.success("Department deleted successfully!");
      await fetchDepartmentData();
      await fetchDepartments();
      fetchDeptDatas();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department! Please try again.");
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!newDepartment.trim()) {
      newErrors.newDepartment = "Department name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
                Public Disclosure
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Public Disclosure</h4>
                    </div>
                  </div>
                  <hr />
                  <div className="card-block">
                    <form onSubmit={handleAddDepartment}>
                      <div className="form-group row">
                        <label className="col-form-label col-md-2">
                          Department Name <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4 mt-1">
                          <input
                            type="text"
                            className={`form-control form-control-md ${
                              errors.newDepartment ? "is-invalid" : ""
                            }`}
                            value={newDepartment}
                            onChange={(e) => {
                              setNewDepartment(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                newDepartment: "",
                              }));
                            }}
                          />
                          {errors.newDepartment && (
                            <div className="invalid-feedback">
                              {errors.newDepartment}
                            </div>
                          )}
                        </div>
                        <div className="col-md-2 mt-1">
                          <input
                            type="submit"
                            className="btn btn-primary"
                            value="Submit"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Departments Name</th>
                          <th width="8%">Status</th>
                          <th width="20%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDepartments.map((department, index) => (
                          <tr key={department.id}>
                            <td>{indexOfFirstDepartment + index + 1}</td>
                            <td>{department.department_name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  department.status === 1
                                    ? "bg-success"
                                    : department.status === 0
                                    ? "bg-danger"
                                    : "bg-info"
                                }`}
                                style={{
                                  display: "inline-block",
                                  padding: "5px 10px",
                                  color: "whitesmoke",
                                }}
                              >
                                {department.status === 1
                                  ? "Approved"
                                  : department.status === 0
                                  ? "Rejected"
                                  : "In Progress"}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={
                                  department?.department_name ===
                                  "General Admin Department"
                                    ? "/add-general-department"
                                    : department?.department_name ===
                                      "Town Planning"
                                    ? "/development-plan"
                                    : `/add-${department.department_name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                }
                                state={{ id: department?.id }}
                                className="btn btn-primary btn-sm m-t-10"
                              >
                                Add
                              </Link>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => {
                                  if (department?.id) {
                                    setSelectedDepartment(department);
                                    setIsEditModalOpen(true);
                                  } else {
                                    console.error(
                                      "Invalid department selected for editing."
                                    );
                                  }
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => {
                                  setSelectedDepartment(department);
                                  setIsDeleteModalOpen(true);
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

          <div className="mt-4">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Link
                  className="page-link"
                  to="#!"
                  onClick={handlePreviousClick}
                >
                  Previous
                </Link>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      to="#!"
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </Link>
                  </li>
                )
              )}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Link className="page-link" to="#!" onClick={handleNextClick}>
                  Next
                </Link>
              </li>
            </ul>
          </div>

          {isDeleteModalOpen && (
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
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleDeleteDepartment}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditModalOpen && (
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
                    <h5 className="modal-title">Edit Public Disclosure</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Department Name</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          value={selectedDepartment?.department_name || ""}
                          onChange={(e) =>
                            setSelectedDepartment({
                              ...selectedDepartment,
                              department_name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleEditDepartment}
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

export default PublicDisclosure;
