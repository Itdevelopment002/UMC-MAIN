import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const ENews = () => {
    const [enewsList, setEnewsList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const agendasPerPage = 10;

    useEffect(() => {
        fetchEnews();
    }, []);

    const fetchEnews = async () => {
        try {
            const response = await api.get("/enews_data");
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setEnewsList(sortedData);
        } catch (error) {
            console.error("Error fetching e-news:", error);
            toast.error("Failed to fetch e-news!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/enews_data/${selectedAgenda.id}`);
            setEnewsList(
                enewsList.filter((agenda) => agenda.id !== selectedAgenda.id)
            );
            setShowDeleteModal(false);
            toast.success("e-News deleted successfully!");
        } catch (error) {
            console.error("Error deleting e-news:", error);
            toast.error("Failed to delete the e-news!");
        }
    };

    const handleEditSave = async () => {
        const formattedPublishDate = selectedAgenda.issue_date
            ? formatDate(selectedAgenda.issue_date)
            : "";
        try {
            await api.put(`/enews_data/${selectedAgenda.id}`, {
                info: selectedAgenda.info,
                issue_date: formattedPublishDate,
                pdf_link: selectedAgenda.pdf_link,
                language_code: selectedAgenda.language_code,

            });
            const updatedAgendaList = enewsList.map((agenda) =>
                agenda.id === selectedAgenda.id ? selectedAgenda : agenda
            );
            setEnewsList(updatedAgendaList);
            setShowEditModal(false);
            toast.success("e-News updated successfully!");
        } catch (error) {
            console.error("Error updating e-news:", error);
            toast.error("Failed to update the e-news!");
        }
    };

    const handleEditClick = (agenda) => {
        setSelectedAgenda({ ...agenda });
        setShowEditModal(true);
    };

    const handleDeleteClick = (agenda) => {
        setSelectedAgenda(agenda);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedAgenda({ ...selectedAgenda, [name]: value });
    };

    const indexOfLastAgenda = currentPage * agendasPerPage;
    const indexOfFirstAgenda = indexOfLastAgenda - agendasPerPage;
    const currentAgendas = enewsList.slice(indexOfFirstAgenda, indexOfLastAgenda);

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
                                e-News Letter
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-6">
                                            <h4 className="page-title">e-News Letter</h4>
                                        </div>
                                        <div className="col-6 text-right m-b-20">
                                            <Link
                                                to="/add-enews-letter"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add e-News
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th width="40%">Information</th>
                                                    <th width="15%" className="text-center">Issue Date</th>
                                                    <th width="20%">PDF Link</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentAgendas.map((agenda, index) => (
                                                    <tr key={agenda.id}>
                                                        <td className="text-center">
                                                            {index + 1 + (currentPage - 1) * agendasPerPage}
                                                        </td>
                                                        <td>{agenda.info}</td>
                                                        <td className="text-center">
                                                            {new Date(agenda.issue_date)
                                                                .toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                .replace(/\//g, "-")}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to={agenda.pdf_link !== "#" ? `${agenda.pdf_link}` : "#"}
                                                                target={agenda.pdf_link !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {agenda.pdf_link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                onClick={() => handleEditClick(agenda)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDeleteClick(agenda)}
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
                                            { length: Math.ceil(enewsList.length / agendasPerPage) },
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
                                            className={`page-item ${currentPage === Math.ceil(enewsList.length / agendasPerPage)
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

                    {/* Modals */}
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
                                        <h5 className="modal-title">Edit e-News Letter</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Select Language
                                                </label>

                                                <select
                                                    className="form-control"
                                                    value={selectedAgenda?.language_code || ""}
                                                    onChange={handleEditChange}
                                                    name="language_code"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                <label className="form-label">Information</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="info"
                                                    value={selectedAgenda?.info || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Issue Date</label>
                                                <Flatpickr
                                                    value={selectedAgenda?.issue_date || ""}
                                                    onChange={(date) =>
                                                        setSelectedAgenda({
                                                            ...selectedAgenda,
                                                            issue_date: date[0],
                                                        })
                                                    }
                                                    className="form-control"
                                                    options={{ dateFormat: "d-m-Y" }}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link"
                                                    value={selectedAgenda?.pdf_link || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEditSave}
                                            className="btn btn-primary btn-sm"
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
                                            onClick={() => setShowDeleteModal(false)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="btn btn-danger btn-sm"
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

export default ENews;
