import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Administration.css"
import "../DepartmentCustomCss/DepartmentCustom.css"

const circularData = [
    {
        name: "Mr. Vikas Dhakane",
        designation: "Commissioner",
        phone: "9851199999",
    },
    {
        name: "Ms. Dr. Karuna Juikar",
        designation: "Additional Commissioner (Services)",
        phone: "-",
    },
    {
        name: "Mr. Jamir Lengarekar",
        designation: "Additional Commissioner (City)",
        phone: "9404242823",
    },
    {
        name: "Mr. Ashok Naikwade",
        designation: "Deputy Municipal Commissioner(HQ)",
        phone: "-",
    },
    {
        name: "Mrs. Priyanka Rajput",
        designation: "Deputy Municipal Commissioner (Tax)",
        phone: "-",
    },
    {
        name: "Mr. Dr. Subhash Jadhav",
        designation: "Deputy Municipal Commissioner (Health)",
        phone: "-",
    },
    {
        name: "Mr. Sharad Deshmukh",
        designation: "Chief Auditor",
        phone: "9881250920",
    },
    {
        name: "Mr. Kiran Bhilare",
        designation: "Chief Account Officer",
        phone: "8806102364",
    },
];

const ITEMS_PER_PAGE = 10;

const Administration = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(circularData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = circularData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                pageNumbers.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? "active" : ""}`}
                        onClick={() => handlePageChange(i)}
                    >
                        <button className="page-link">{String(i).padStart(2, "0")}</button>
                    </li>
                );
            } else if (
                pageNumbers[pageNumbers.length - 1]?.key !== "ellipsis" &&
                (i < currentPage - 1 || i > currentPage + 1)
            ) {
                pageNumbers.push(
                    <li key="ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }
        return pageNumbers;
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="accounts-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Administration</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Administration</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* <div>
                        <label htmlFor="entries" className="me-2">
                            Show
                        </label>
                        <select
                            id="entries"
                            className="form-select d-inline-block"
                            style={{ width: "auto" }}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span className="ms-2">entries</span>
                    </div> */}
                        {/* <div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            style={{ width: "200px" }}
                        />
                    </div> */}
                    </div>
                    <div className="row mt-3 row-styling-3">
                        <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">Name</th>
                                            <th className="table-heading-styling">Designation</th>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                Phone No.
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="5%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {startIndex + index + 1}
                                                </td>
                                                <td
                                                    width="55%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.name}
                                                </td>
                                                <td
                                                    width="15%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.designation}
                                                </td>
                                                <td
                                                    width="10%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.phone}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="last-updated-container">
                                <p class="last-updated-text"><b>Last Updated :</b> 20-09-2024 01:00 pm</p>
                            </div>
                        </div>
                        <nav aria-label="Page navigation" className="d-flex justify-content-start paginationtop">
                            <ul className="pagination custom-pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Administration;
