import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Budget = () => {
    const [budgetsData, setBudgetsData] = useState([]);
    const [filteredBudgets, setFilteredBudgets] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(null);
    const budgetsPerPage = 10;

    useEffect(() => {
        fetchBudgetsData();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            setFilteredBudgets(
                budgetsData.filter((budget) => budget.year === selectedYear)
            );
        } else {
            setFilteredBudgets(budgetsData);
        }
    }, [selectedYear, budgetsData]);

    const fetchBudgetsData = async () => {
        try {
            const response = await api.get("/budgets_data");
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setBudgetsData(sortedData);
            setFilteredBudgets(sortedData);
            const uniqueYears = [...new Set(sortedData.map((budget) => budget.year))];
            const sortedUniqueYears = uniqueYears.sort((a, b) => {
                const yearA = parseInt(a.split("-")[0], 10);
                const yearB = parseInt(b.split("-")[0], 10);
                return yearB - yearA;
            });
            if (sortedUniqueYears.length > 0) {
                setSelectedYear(sortedUniqueYears[0]);
            }
        } catch (error) {
            console.error("Error fetching budgets:", error);
            toast.error("Failed to fetch budgets!");
        }
    };


    const handleDelete = async () => {
        try {
            await api.delete(`/budgets_data/${selectedBudget.id}`);
            setBudgetsData(budgetsData.filter((budget) => budget.id !== selectedBudget.id));
            setShowDeleteModal(false);
            toast.success("Budget deleted successfully!");
        } catch (error) {
            console.error("Error deleting budget:", error);
            toast.error("Failed to delete the budget!");
        }
    };

    const handleEditSave = async () => {
        const formattedIssueDate = selectedBudget.issue_date
            ? formatDate(selectedBudget.issue_date)
            : "";
        try {
            await api.put(`/budgets_data/${selectedBudget.id}`, {
                year: selectedBudget.year,
                heading: selectedBudget.heading,
                link: selectedBudget.link,
                issue_date: formattedIssueDate,
                language_code: selectedBudget.language_code,

            });
            const updatedBudgets = budgetsData.map((budget) =>
                budget.id === selectedBudget.id ? selectedBudget : budget
            );
            setBudgetsData(updatedBudgets);
            fetchBudgetsData();
            setShowEditModal(false);
            toast.success("Budget updated successfully!");
        } catch (error) {
            console.error("Error updating budget:", error);
            toast.error("Failed to update the budget!");
        }
    };

    const handleEditClick = (budget) => {
        setSelectedBudget({ ...budget });
        setShowEditModal(true);
    };

    const handleDeleteClick = (budget) => {
        setSelectedBudget(budget);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedBudget({ ...selectedBudget, [name]: value });
    };

    const indexOfLastBudget = currentPage * budgetsPerPage;
    const indexOfFirstBudget = indexOfLastBudget - budgetsPerPage;
    const currentBudgets = filteredBudgets.slice(indexOfFirstBudget, indexOfLastBudget);
    const uniqueYears = [...new Set(budgetsData.map((budget) => budget.year))];

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
                                UMC Budget
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-6">
                                            <h4 className="page-title">UMC Budget</h4>
                                        </div>
                                        <div className="col-6 text-right m-b-20">
                                            <Link
                                                to="/add-budget"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Budget
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500' }}>Filter by Year</label>
                                        <select
                                            className="form-control"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            style={{ width: '200px' }}
                                        >

                                            {uniqueYears
                                                .sort((a, b) => {
                                                    const yearA = parseInt(a.split("-")[0], 10);
                                                    const yearB = parseInt(b.split("-")[0], 10);
                                                    return yearB - yearA;
                                                })
                                                .map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}

                                        </select>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Heading</th>
                                                    <th>PDF Link</th>
                                                    <th width="15%" className="text-center">Issue Date</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentBudgets.map((budget, index) => (
                                                    <tr key={budget.id}>
                                                        <td className="text-center">
                                                            {index + 1 + (currentPage - 1) * budgetsPerPage}
                                                        </td>
                                                        <td>{budget.heading}</td>
                                                        <td>
                                                            <Link
                                                                to={budget.link !== "#" ? `${budget.link}` : "#"}
                                                                target={budget.link !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {budget.link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            {new Date(budget.issue_date)
                                                                .toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                .replace(/\//g, "-")}
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                onClick={() => handleEditClick(budget)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDeleteClick(budget)}
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
                                            { length: Math.ceil(filteredBudgets.length / budgetsPerPage) },
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
                                            className={`page-item ${currentPage === Math.ceil(filteredBudgets.length / budgetsPerPage) ? "disabled" : ""}`}
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
                                        <h5 className="modal-title">Edit UMC Budget</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Select Language
                                                </label>

                                                <select
                                                    className="form-control"
                                                    value={selectedBudget?.language_code || ""}
                                                    onChange={handleEditChange}
                                                    name="language_code"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
                                                <label className="form-label">Heading</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="heading"
                                                    value={selectedBudget?.heading || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="link"
                                                    value={selectedBudget?.link || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Issue Date</label>
                                                <Flatpickr
                                                    value={selectedBudget?.issue_date || ""}
                                                    onChange={(date) =>
                                                        setSelectedBudget({
                                                            ...selectedBudget,
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

export default Budget;
