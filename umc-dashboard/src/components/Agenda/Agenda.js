import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Agenda = () => {
    const [resolutions, setResolutions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resolutionsPerPage = 10;

    useEffect(() => {
        fetchResolutions();
    }, []);

    const fetchResolutions = async () => {
        try {
            const response = await api.get("/agenda_data");
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.Schedule_Date_of_Meeting ? new Date(a.Schedule_Date_of_Meeting) : new Date(0);
                const dateB = b.Schedule_Date_of_Meeting ? new Date(b.Schedule_Date_of_Meeting) : new Date(0);
                return dateB - dateA;
              });
            setResolutions(sortedData);
        } catch (error) {
            console.error("Error fetching agenda:", error);
            toast.error("Failed to fetch agenda!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/agenda_data/${selectedResolution.Sr_No}`);
            setResolutions(
                resolutions.filter((r) => r.Sr_No !== selectedResolution.Sr_No)
            );
            setShowDeleteModal(false);
            toast.success("Agenda deleted successfully!");
        } catch (error) {
            console.error("Error deleting agenda:", error);
            toast.error("Failed to delete the agenda!");
        }
    };

    const handleEditSave = async () => {
        const formattedPublishDate = selectedResolution.Schedule_Date_of_Meeting
            ? formatDate(selectedResolution.Schedule_Date_of_Meeting)
            : "";
        try {
            await api.put(`/agenda_data/${selectedResolution.Sr_No}`, {
                Department_Name: selectedResolution.Department_Name,
                Agenda_No_Date: selectedResolution.Agenda_No_Date,
                Schedule_Date_of_Meeting: formattedPublishDate,
                Adjournment_Notice: selectedResolution.Adjournment_Notice,
                pdf_link: selectedResolution.pdf_link,
                language_code: selectedResolution.language_code,

            });
            fetchResolutions();
            setShowEditModal(false);
            toast.success("Agenda updated successfully!");
        } catch (error) {
            console.error("Error updating agenda:", error);
            toast.error("Failed to update the agenda!");
        }
    };

    const handleEditClick = (resolution) => {
        setSelectedResolution({ ...resolution });
        setShowEditModal(true);
    };

    const handleDeleteClick = (resolution) => {
        setSelectedResolution(resolution);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedResolution({ ...selectedResolution, [name]: value });
    };

    const indexOfLastResolution = currentPage * resolutionsPerPage;
    const indexOfFirstResolution = indexOfLastResolution - resolutionsPerPage;
    const currentResolutions = resolutions.slice(
        indexOfFirstResolution,
        indexOfLastResolution
    );

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
                                <Link to="#">Corporation</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                UMC Agenda
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">UMC Agenda</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-agenda"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Agenda
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th width="15%">Department Name</th>
                                                    <th width="15%" className="text-center">Agenda No/Date</th>
                                                    <th width="15%" className="text-center">Schedule Date</th>
                                                    <th width="10%">Adjournment Notice</th>
                                                    <th>PDF Link</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentResolutions.map((resolution, index) => (
                                                    <tr key={resolution.Sr_No}>
                                                        <td className="text-center">
                                                            {index + 1 + (currentPage - 1) * resolutionsPerPage}
                                                        </td>
                                                        <td>{resolution.Department_Name}</td>
                                                        <td className="text-center">{resolution.Agenda_No_Date}</td>
                                                        <td className="text-center">
                                                            {new Date(resolution.Schedule_Date_of_Meeting)
                                                                .toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                .replace(/\//g, "-")}
                                                        </td>
                                                        <td>{resolution.Adjournment_Notice}</td>
                                                        <td>
                                                            <Link
                                                                to={resolution.pdf_link !== "#" ? `${resolution.pdf_link}` : "#"}
                                                                target={resolution.pdf_link !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {resolution.pdf_link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                onClick={() => handleEditClick(resolution)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDeleteClick(resolution)}
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
                                            { length: Math.ceil(resolutions.length / resolutionsPerPage) },
                                            (_, i) => (
                                                <li
                                                    className={`page-item ${currentPage === i + 1 ? "active" : ""
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
                                            className={`page-item ${currentPage === Math.ceil(resolutions.length / resolutionsPerPage)
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

                    {showEditModal && (
                        <div
                            className="modal fade show"
                            style={{
                                display: "block",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                overflowY: "scroll",
                            }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit UMC Agenda</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Select Language
                                                </label>

                                                <select
                                                    className="form-control"
                                                    value={selectedResolution?.language_code || ""}
                                                    onChange={handleEditChange}
                                                    name="language_code"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                <label className="form-label">Department Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Department_Name"
                                                    value={selectedResolution?.Department_Name || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Agenda No/Date</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Agenda_No_Date"
                                                    value={selectedResolution?.Agenda_No_Date || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Schedule Date</label>
                                                <Flatpickr
                                                    value={selectedResolution?.Schedule_Date_of_Meeting || ""}
                                                    onChange={(date) =>
                                                        setSelectedResolution({
                                                            ...selectedResolution,
                                                            Schedule_Date_of_Meeting: date[0],
                                                        })
                                                    }
                                                    className="form-control"
                                                    options={{ dateFormat: "d-m-Y" }}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Adjournment Notice</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Adjournment_Notice"
                                                    value={selectedResolution?.Adjournment_Notice || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link"
                                                    value={selectedResolution?.pdf_link || ""}
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
                                            Cancel
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

export default Agenda;
