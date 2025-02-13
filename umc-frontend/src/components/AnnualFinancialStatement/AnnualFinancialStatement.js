import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AnnualFinancialStatement.css";
import pdficon from '../../assets/images/Departments/document 1.png'
import Swal from 'sweetalert2';
import api, { baseURL } from "../api";

const AnnualFinancialStatement = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [annualData, setAnnualData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [bgImage, setBgImage] = useState("");

    const totalEntries = annualData.length;
    const filteredData = annualData.filter((item) =>
        item.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchAnnual();
        fetchHeaderImage();
    }, []);

    const fetchAnnual = async () => {
        try {
            const response = await api.get("/annual-finance");
            setAnnualData(response.data);
        } catch (error) {
            console.error("Error fetching Annual:", error);
        }
    };

    const totalPages = Math.ceil(annualData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.reverse().slice(startIndex, startIndex + itemsPerPage);

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
    const handleClick = (link, e) => {
        if (link === "#") {
            e.preventDefault();
            Swal.fire({
                title: 'Information',
                text: 'The PDF will be available soon.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
        }
    };
    const updatedtotalEntries = annualData.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Annual-financial");

                if (selectedBanner) {
                    setBgImage(`${baseURL}${selectedBanner.file_path}`);
                } else {
                    console.error("Banner with specified name not found.");
                }
            } else {
                console.error("No banner image found.");
            }
        } catch (error) {
            console.error("Error fetching header image:", error);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,
                   
                }}
            ></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="accounts-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Annual Financial Statement</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Annual</span>
                        <span className="highlighted-text"> Financial Statement</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12 col-xl-7 col-lg-7 col-md-12 col-sm-12">
                            <div className="d-flex  justify-content-between align-items-center mb-3">
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
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width='10%'>Sr. No.</th>
                                            <th className="table-heading-styling">Annual Financial Statement</th>
                                            <th className="table-heading-styling text-center" width='10%'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td>{item.heading}</td>
                                                <td
                                                    width="20%"
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Link
                                                        to={item.link}
                                                        className="text-decoration-none"
                                                        target={item.link === "#" ? "" : "_blank"}
                                                        style={{ color: "#333333" }}
                                                        onClick={(e) => handleClick(item.link, e)}
                                                    >
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
                                                        View PDF
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex">
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

                                <div class="last-updated-container">
                                    <p className="last-updated-text">
                                        <b>Showing {startEntry} to {endEntry} of {totalEntries} entries</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </>
    );
};

export default AnnualFinancialStatement;
