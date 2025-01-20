import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import api, { baseURL } from "../api";
import { Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddGeneralYear = () => {
  const location = useLocation();
  const state = location.state || {};
  const { id } = state;
  const [year, setYear] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [pdfHeading, setPdfHeading] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [data, setData] = useState([]);
  const [editYearData, setEditYearData] = useState({
    year: "",
    meetingtype: "",
    heading: "",
    pdf: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const [currentDeletingId, setCurrentDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!year.trim()) newErrors.year = "Year is required.";
    if (!meetingType.trim())
      newErrors.meetingType = "Meeting Type is required.";
    if (!pdfHeading.trim()) newErrors.pdfHeading = "PDF Heading is required.";
    if (!pdfFile) newErrors.pdfFile = "PDF file is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDeptData = async () => {
    try {
      const response = await api.get(`generaladmindepartment`);
      const filteredData = response.data.filter(
        (item) => String(item.id) === String(id)
      );
      setDeptData(filteredData);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const fetchData = async () => {
    try {
      if (deptData.length === 0) return;
      const response = await api.get("/generaladminaddyear");
      const filteredData = response.data.filter(
        (item) => item.department_id === deptData[0]?.id
      );
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDeptData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (deptData.length > 0) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [deptData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("department_id", deptData[0].id);
    formData.append("department_heading", deptData[0].department_heading);
    formData.append("year", year);
    formData.append("meetingtype", meetingType);
    formData.append("pdfheading", pdfHeading);
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    try {
      await api.post("/generaladminaddyear", formData);
      const updatedEntries = await api.get("/generaladminaddyear");
      const newEntry = updatedEntries.data.find(
        (entry) =>
          entry.year === year &&
          entry.meetingtype === meetingType &&
          entry.pdfheading === pdfHeading
      );

      if (!newEntry) {
        throw new Error("Unable to find the added entry.");
      }

      const newId = newEntry.id;

      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];
      const notificationData = {
        description: `In General Admin Department new pdf '${pdfHeading}' added.`,
        role: "General Admin Department",
        name: "generaladminaddyear",
        new_id: newId,
        date,
        time,
      };
      await api.post("/admin-notifications", notificationData);

      const notificationAdminData = {
        heading: "Request Generated",
        description: `Added year: '${year}', meeting type: '${meetingType}', and heading: '${pdfHeading}'`,
        role: "Admin",
        readed: 0,
      };

      // eslint-disable-next-line
      const notificationResponse = await api.post(
        "/notification",
        notificationAdminData
      );
      fetchData();
      setYear("");
      setMeetingType("");
      setPdfHeading("");
      setPdfFile(null);
      document.getElementById("pdf").value = "";
      setErrors({});
      toast.success("Year added successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error adding year.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("year", editYearData.year);
    formData.append("meetingtype", editYearData.meetingtype);
    formData.append("pdfheading", editYearData.heading);
    if (editYearData.pdf) {
      formData.append("pdf", editYearData.pdf);
    }
    try {
      await api.put(`/generaladminaddyear/${currentEditingId}`, formData);
      fetchData();
      setShowEditModal(false);
      toast.success("Year updated successfully!");
    } catch (error) {
      console.error("Error editing data:", error);
      toast.error("Error updating year!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/generaladminaddyear/${id}`);
      fetchData();
      toast.success("Year deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting year!");
    }
  };

  const handleDeleteConfirm = () => {
    if (currentDeletingId) {
      handleDelete(currentDeletingId);
      setShowDeleteModal(false);
    }
  };

  const currentPageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <div class="page-wrapper">
        <div class="content">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li class="breadcrumb-item">
              <Link to="/add-general-department">
                Add General Admin Department
              </Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Add {deptData[0]?.departments_heading}
            </li>
          </ol>
          <div class="row">
            <div class="col-lg-12">
              <div class="card-box">
                <div class="card-block">
                  <div class="row">
                    <div class="col-sm-4 col-3">
                      <h4 class="page-title">
                        Add {deptData[0]?.departments_heading}
                      </h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div class="row">
                      <div class="col-md-2">
                        <div class="form-group">
                          <label>Year</label>
                          <input
                            type="text"
                            className={`form-control form-control-md ${
                              errors.year ? "is-invalid" : ""
                            }`}
                            value={year}
                            onChange={(e) => {
                              setYear(e.target.value);
                              setErrors((prev) => ({ ...prev, year: "" }));
                            }}
                            placeholder="Enter Year"
                          />
                          {errors.year && (
                            <small className="text-danger">{errors.year}</small>
                          )}
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Select Meeting</label>
                          <select
                            className={`form-control form-control-md`}
                            value={meetingType}
                            onChange={(e) => setMeetingType(e.target.value)}
                          >
                            <option value="" disabled>
                              Select Meeting
                            </option>
                            <option>General Meeting</option>
                            <option>Standing Committee Meeting</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>PDF Heading</label>
                          <input
                            type="text"
                            className={`form-control form-control-md ${
                              errors.pdfHeading ? "is-invalid" : ""
                            }`}
                            value={pdfHeading}
                            onChange={(e) => {
                              setPdfHeading(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                pdfHeading: "",
                              }));
                            }}
                            placeholder="Enter Pdf Heading"
                          />
                          {errors.pdfHeading && (
                            <small className="text-danger">
                              {errors.pdfHeading}
                            </small>
                          )}
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label>Upload PDF</label>
                          <input
                            id="pdf"
                            type="file"
                            className={`form-control form-control-md ${
                              errors.pdfFile ? "is-invalid" : ""
                            }`}
                            onChange={(e) => {
                              setPdfFile(e.target.files[0]);
                              setErrors((prev) => ({ ...prev, pdfFile: "" }));
                            }}
                          />
                          {errors.pdfFile && (
                            <small className="text-danger">
                              {errors.pdfFile}
                            </small>
                          )}
                        </div>
                      </div>
                      <div class="col-md-2">
                        <input
                          type="submit"
                          class="btn btn-primary"
                          value="Submit"
                        />
                      </div>
                    </div>
                  </form>
                  <hr />
                  <div class="table-responsive mt-4">
                    <table class="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Year</th>
                          <th>Meeting Type</th>
                          <th>PDF Heading</th>
                          <th>PDF File</th>
                          <th width="8%">Status</th>
                          <th width="20%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{item.year}</td>
                              <td>{item.meetingtype}</td>
                              <td>{item.pdfheading}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    item.status === 1
                                      ? "bg-success"
                                      : item.status === 0
                                      ? "bg-danger"
                                      : "bg-info"
                                  }`}
                                  style={{
                                    display: "inline-block",
                                    padding: "5px 10px",
                                    color: "whitesmoke",
                                  }}
                                >
                                  {item.status === 1
                                    ? "Approved"
                                    : item.status === 0
                                    ? "Rejected"
                                    : "In Progress"}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`${baseURL}/${item.pdf}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaFilePdf
                                    style={{ color: "red" }}
                                    size={35}
                                  />
                                </Link>
                              </td>

                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10 mx-1"
                                  onClick={() => {
                                    setShowEditModal(true);
                                    setCurrentEditingId(item.id);
                                    setEditYearData({
                                      year: item.year,
                                      meetingtype: item.meetingtype,
                                      heading: item.pdfheading,
                                      pdf: null,
                                    });
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => {
                                    setCurrentDeletingId(item.id);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                              No {deptData[0]?.departments_heading} data
                              available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        { length: Math.ceil(data.length / itemsPerPage) },
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
                          currentPage === Math.ceil(data.length / itemsPerPage)
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
                    <h5 className="modal-title">Edit Year</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Year</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          value={editYearData.year}
                          onChange={(e) =>
                            setEditYearData({
                              ...editYearData,
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Select Meeting</label>
                        <select
                          className="form-control form-control-md"
                          value={editYearData.meetingtype}
                          onChange={(e) =>
                            setEditYearData({
                              ...editYearData,
                              meetingtype: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select Meeting
                          </option>
                          <option>General Meeting</option>
                          <option>Standing Committee Meeting</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Pdf Heading</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          value={editYearData.heading}
                          onChange={(e) =>
                            setEditYearData({
                              ...editYearData,
                              heading: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Upload Pdf</label>
                        <input
                          type="file"
                          className="form-control form-control-md"
                          onChange={(e) =>
                            setEditYearData({
                              ...editYearData,
                              pdf: e.target.files[0],
                            })
                          }
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleEditSubmit}
                    >
                      Save changes
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
                    <h5>Are you sure you want to delete this entry?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleDeleteConfirm}
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

export default AddGeneralYear;
