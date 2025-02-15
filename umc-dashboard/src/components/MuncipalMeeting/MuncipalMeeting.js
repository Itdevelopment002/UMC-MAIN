import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MuncipalMeeting = () => {
    const [municipalMeetingsData, setMunicipalMeetingsData] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [selectedMeetingName, setSelectedMeetingName] = useState(""); // Default to empty, will be set later
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const meetingsPerPage = 10;

    useEffect(() => {
        fetchMunicipalMeetingsData();
    }, []);

    useEffect(() => {
        filterMeetingsByName(selectedMeetingName);
    }, [selectedMeetingName, municipalMeetingsData]);

    const fetchMunicipalMeetingsData = async () => {
        try {
            const response = await api.get("/muncipal_meetings");
            setMunicipalMeetingsData(response.data);
            if (response.data.length > 0) {
                setSelectedMeetingName(response.data[0].name); // Set the default to the first meeting's name
            }
            filterMeetingsByName(""); // Show all meetings by default
        } catch (error) {
            console.error("Error fetching municipal meetings:", error);
            toast.error("Failed to fetch municipal meetings!");
        }
    };

    const filterMeetingsByName = (name) => {
        const filtered = name
            ? municipalMeetingsData.filter((meeting) =>
                meeting.name.toLowerCase() === name.toLowerCase() // Exact match
            )
            : municipalMeetingsData; // If name is empty, show all
        setFilteredMeetings(filtered);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/muncipal_meetings/${selectedMeeting.id}`);
            setMunicipalMeetingsData(municipalMeetingsData.filter((meeting) => meeting.id !== selectedMeeting.id));
            setShowDeleteModal(false);
            toast.success("Municipal meeting deleted successfully!");
        } catch (error) {
            console.error("Error deleting municipal meeting:", error);
            toast.error("Failed to delete the municipal meeting!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/muncipal_meetings/${selectedMeeting.id}`, {
                name: selectedMeeting.name,
                year: selectedMeeting.year,
                pdf_link1: selectedMeeting.pdf_link1,
                pdf_link2: selectedMeeting.pdf_link2,
                pdf_link3: selectedMeeting.pdf_link3,
                language_code: selectedMeeting.language_code,

            });
            const updatedMeetings = municipalMeetingsData.map((meeting) =>
                meeting.id === selectedMeeting.id ? selectedMeeting : meeting
            );
            setMunicipalMeetingsData(updatedMeetings);
            fetchMunicipalMeetingsData();
            filterMeetingsByName();
            setShowEditModal(false);
            toast.success("Municipal meeting updated successfully!");
        } catch (error) {
            console.error("Error updating municipal meeting:", error);
            toast.error("Failed to update the municipal meeting!");
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
        setSelectedMeetingName(e.target.value); // Update the selected meeting name
    };

    const indexOfLastMeeting = currentPage * meetingsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
    const currentMeetings = filteredMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

    // Get unique meeting names dynamically from the data
    const meetingNames = Array.from(new Set(municipalMeetingsData.map(meeting => meeting.name)));

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Corporation</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Municipal Meeting
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Municipal Meeting</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-muncipal-meeting"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Data
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ fontWeight: "500" }}>Select Meeting Name</label>
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
                                                    <th>PDF Links</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{currentMeetings.map((meeting, index) => (
                                                <React.Fragment key={meeting.id}>
                                                    <tr>
                                                        <td rowSpan="3" className="text-center">
                                                            {index + 1 + (currentPage - 1) * meetingsPerPage}
                                                        </td>
                                                        <td rowSpan="3">{meeting.year}</td>
                                                        <td>
                                                            <Link
                                                                to={meeting.pdf_link1 !== "#" ? `${meeting.pdf_link1}` : "#"}
                                                                target={meeting.pdf_link1 !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {meeting.pdf_link1}
                                                            </Link>
                                                        </td>
                                                        <td rowSpan="3" className="text-center" style={{ textAlign: 'center' }}>
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
                                                    <tr>
                                                        <td>
                                                            <Link
                                                                to={meeting.pdf_link2 !== "#" ? `${meeting.pdf_link2}` : "#"}
                                                                target={meeting.pdf_link2 !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {meeting.pdf_link2}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Link
                                                                to={meeting.pdf_link3 !== "#" ? `${meeting.pdf_link3}` : "#"}
                                                                target={meeting.pdf_link3 !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {meeting.pdf_link3}
                                                            </Link>
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

                    {/* Edit and Delete Modals */}
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
                                        <h5 className="modal-title">Edit Municipal Meeting</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            {/* <div className="mb-3">
                                                <label className="form-label">Meeting Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={selectedMeeting?.name || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div> */}
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
                                                <label className="form-label">PDF Link 1</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link1"
                                                    value={selectedMeeting?.pdf_link1 || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link 2</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link2"
                                                    value={selectedMeeting?.pdf_link2 || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link 3</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link3"
                                                    value={selectedMeeting?.pdf_link3 || ""}
                                                    onChange={handleEditChange}
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

                    {/* Delete Modal */}
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

export default MuncipalMeeting;
