import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Circular.css"
import "../DepartmentCustomCss/DepartmentCustom.css"
import pdficon from '../../assets/images/Departments/document 1.png'

const circularData = [
    // {
    //     title: "Circular Title Here",
    //     number: "CLR/04-01-25/000123",
    //     date: "04-01-2025",
    //     posting: "View PDF",
    // },
    // {
    //     title: "Circular Title Here",
    //     number: "CLR/04-01-25/000123",
    //     date: "04-01-2025",
    //     posting: "View PDF",
    // },
    // {
    //     title: "Circular Title Here",
    //     number: "CLR/04-01-25/000123",
    //     date: "04-01-2025",
    //     posting: "View PDF",
    // },
    // {
    //     title: "Circular Title Here",
    //     number: "CLR/04-01-25/000123",
    //     date: "04-01-2025",
    //     posting: "View PDF",
    // },

];

const Circular = () => {

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = circularData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
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
                        <span className="breadcrumb-item active1">Circular</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Circular</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="entries-wrapper">
                            <label htmlFor="entries" className="entries-label">
                                Show
                            </label>
                            <select
                                id="entries"
                                className="entries-select"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="entries-text">entries</span>
                        </div>

                        <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
                            <label
                                htmlFor="searchInput"
                                className="search-label"
                                style={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Search
                            </label>
                            <input
                                type="text"
                                id="searchInput"
                                className="form-control serching-shorting"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width='8%'>Sr. No.</th>
                                            <th className="table-heading-styling" width='50%'>Circular Title</th>
                                            <th className="table-heading-styling text-center">Circular Number</th>
                                            <th className="table-heading-styling text-center">Circular Date</th>
                                            <th className="table-heading-styling text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="font-large text-center">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td className="text-center">{item.number}</td>
                                                    <td className="text-center">{item.date}</td>
                                                    <td className="text-center">
                                                        <img
                                                            src={pdficon}
                                                            alt="PDF Icon"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                marginRight: "8px",
                                                                verticalAlign: "middle",
                                                            }}
                                                        />
                                                        {item.posting}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", color: "#333333" }}>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <nav aria-label="Page navigation" className="d-flex justify-content-start">
                            <ul className="pagination custom-pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
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

export default Circular;