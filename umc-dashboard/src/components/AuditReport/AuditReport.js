import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const AuditReport = () => {
    const [municipalMeetingsData, setMunicipalMeetingsData] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [selectedMeetingName, setSelectedMeetingName] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const meetingsPerPage = 10;

    useEffect(() => {
        fetchAuditReportData();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        filterMeetingsByName(selectedMeetingName);
        //eslint-disable-next-line
    }, [selectedMeetingName, municipalMeetingsData]);

    const fetchAuditReportData = async () => {
        try {
            const response = await api.get("/audit-report");
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
              });
            setMunicipalMeetingsData(sortedData);
            if (response.data.length > 0) {
                setSelectedMeetingName(response.data[0].name);
            }
            filterMeetingsByName("");
        } catch (error) {
            console.error("Error fetching audit reports:", error);
            toast.error("Failed to fetch audit reports!");
        }
    };

    const filterMeetingsByName = (name) => {
        const filtered = name
            ? municipalMeetingsData.filter((meeting) =>
                meeting.name.toLowerCase() === name.toLowerCase()
            )
            : municipalMeetingsData;
        setFilteredMeetings(filtered);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/audit-report/${selectedMeeting.id}`);
            setMunicipalMeetingsData(municipalMeetingsData.filter((meeting) => meeting.id !== selectedMeeting.id));
            setShowDeleteModal(false);
            toast.success("Audit Report deleted successfully!");
        } catch (error) {
            console.error("Error deleting audit report:", error);
            toast.error("Failed to delete the audit report!");
        }
    };

    const handleEditSave = async () => {
        const formattedIssueDate = selectedMeeting.issue_date
      ? formatDate(selectedMeeting.issue_date)
      : "";
        try {
            await api.put(`/audit-report/${selectedMeeting.id}`, {
                name: selectedMeeting.name,
                year: selectedMeeting.year,
                pdf_link: selectedMeeting.pdf_link,
                issue_date: formattedIssueDate,
                language_code: selectedMeeting.language_code,
            });

            const updatedMeetings = municipalMeetingsData.map((meeting) =>
                meeting.id === selectedMeeting.id ? selectedMeeting : meeting
            );

            setMunicipalMeetingsData(updatedMeetings);
            filterMeetingsByName(selectedMeetingName);
            window.location.reload();

            setShowEditModal(false);
            toast.success("Audit Report updated successfully!");
        } catch (error) {
            console.error("Error updating audit report:", error);
            toast.error("Failed to update the audit report!");
        }
    };

    const handleEditClick = (meeting) => {
        setSelectedMeeting({ ...meeting });
        setShowEditModal(true);
    };

    const handleDeleteClick = (meeting) => {
        setSelectedMeeting(meeting);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedMeeting({ ...selectedMeeting, [name]: value });
    };

    const handleMeetingNameChange = (e) => {
        setSelectedMeetingName(e.target.value);
    };

    const indexOfLastMeeting = currentPage * meetingsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
    const currentMeetings = filteredMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

    const meetingNames = Array.from(new Set(municipalMeetingsData.map(meeting => meeting.name)));

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Departments</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Audit Report
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Audit Report</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-audit-report"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Report Data
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ fontWeight: "500" }}>Select Report Name</label>
                                        <select
                                            className="form-control"
                                            value={selectedMeetingName}
                                            onChange={handleMeetingNameChange}
                                            style={{ width: '250px' }}
                                        >
                                            {meetingNames.map((name, index) => (
                                                <option key={index} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Year</th>
                                                    <th>PDF Link</th>
                                                    <th width="15%" className="text-center">Issue Date</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{currentMeetings.map((meeting, index) => (
                                                <React.Fragment key={meeting.id}>
                                                    <tr>
                                                        <td className="text-center">
                                                            {index + 1 + (currentPage - 1) * meetingsPerPage}
                                                        </td>
                                                        <td>{meeting.year}</td>
                                                        <td>
                                                            <Link
                                                                to={meeting.pdf_link !== "#" ? `${meeting.pdf_link}` : "#"}
                                                                target={meeting.pdf_link !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {meeting.pdf_link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            {new Date(meeting.issue_date)
                                                                .toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                .replace(/\//g, "-")}
                                                        </td>
                                                        <td className="text-center" style={{ textAlign: 'center' }}>
                                                            <button
                                                                onClick={() => handleEditClick(meeting)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(meeting)}
                                                                className="btn btn-danger btn-sm m-t-10"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-4">
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
                                            { length: Math.ceil(filteredMeetings.length / meetingsPerPage) },
                                            (_, i) => (
                                                <li
                                                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                                            className={`page-item ${currentPage === Math.ceil(filteredMeetings.length / meetingsPerPage) ? "disabled" : ""}`}
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
                                        <h5 className="modal-title">Edit Audit Report</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Select Language
                                                </label>
                                                <select
                                                    className="form-control"
                                                    value={selectedMeeting?.language_code || ""}
                                                    onChange={handleEditChange}
                                                    name="language_code"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                <label className="form-label">Year</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="year"
                                                    value={selectedMeeting?.year || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link"
                                                    value={selectedMeeting?.pdf_link || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Issue Date</label>
                                                <Flatpickr
                                                    value={selectedMeeting?.issue_date || ""}
                                                    onChange={(date) =>
                                                        setSelectedMeeting({
                                                            ...selectedMeeting,
                                                            issue_date: date[0],
                                                        })
                                                    }
                                                    className="form-control"
                                                    options={{ dateFormat: "d-m-Y" }}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={handleEditSave}
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
                                        <h5>Are you sure you want to delete this item?</h5>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={handleDelete}
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
        </>
    );
};

export default AuditReport;