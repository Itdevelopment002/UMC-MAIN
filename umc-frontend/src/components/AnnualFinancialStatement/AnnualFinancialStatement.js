import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AnnualFinancialStatement.css";
import pdficon from '../../assets/images/Departments/document 1.png'
import Swal from 'sweetalert2';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const AnnualFinancialStatement = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [annualData, setAnnualData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const totalEntries = annualData.length;
    const filteredData = annualData.filter((item) =>
        item.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchAnnual();
        fetchHeaderImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const fetchAnnual = async () => {
        try {
            const response = await api.get(`/annual-finance?lang=${i18n.language}`);
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setAnnualData(sortedData);
        } catch (error) {
            console.error("Error fetching Annual:", error);
        }
    };

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

    const convertToLocalizedDigits = (number) => {
        const digits = t('digits', { returnObjects: true });
        return number
            .toString()
            .split('')
            .map((d) => digits[parseInt(d)] || d)
            .join('');
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        let leftEllipsisAdded = false;
        let rightEllipsisAdded = false;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                const displayNumber = convertToLocalizedDigits(String(i).padStart(2, '0'));
                pageNumbers.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        <button className="page-link">{displayNumber}</button>
                    </li>
                );
            } else if (i < currentPage - 1 && !leftEllipsisAdded) {
                pageNumbers.push(
                    <li key="left-ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
                leftEllipsisAdded = true;
            } else if (i > currentPage + 1 && !rightEllipsisAdded) {
                pageNumbers.push(
                    <li key="right-ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
                rightEllipsisAdded = true;
            }
            // Skip other page numbers to avoid extra rendering
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

    const updatedtotalEntries = filteredData.length;
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
                            {t('corporation.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            {t('corporation.corporation')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('financialstatement.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('financialstatement.highlight')}</span>
                        <span className="highlighted-text"> {t('financialstatement.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12 col-xl-7 col-lg-7 col-md-12 col-sm-12">
                            <div className="d-flex  justify-content-between align-items-center mb-3">
                                <div className="entries-wrapper">
                                    <label htmlFor="entries" className="entries-label">
                                        {t('corporation.show')}
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
                                    <span className="entries-text">{t('corporation.entries')}</span>
                                </div>

                                <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
                                    <label
                                        htmlFor="searchInput"
                                        className="search-label"
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {t('corporation.search')}
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
                                            <th className="table-heading-styling text-center" width='10%'>{t('departments.sno')}</th>
                                            <th className="table-heading-styling">{t('financialstatement.heading')}</th>
                                            <th className="table-heading-styling text-center" width='10%'>{t('departments.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    {t('corporation.noResults')}
                                                </td>
                                            </tr>
                                        ) : (
                                            currentData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="font-large text-center">
                                                        {(() => {
                                                            const language = i18n.language;

                                                            const toMarathiNumbers = (num) => {
                                                                const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                                                return num
                                                                    .toString()
                                                                    .split("")
                                                                    .map((digit) => marathiDigits[parseInt(digit, 10)])
                                                                    .join("");
                                                            };

                                                            const number = startIndex + index + 1;
                                                            return language === "mr" ? toMarathiNumbers(number) : number;
                                                        })()}
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
                                                            {t('departments.view')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredData.length > 0 && (
                                <div className="d-flex">
                                    <nav aria-label="Page navigation" className="d-flex justify-content-start">
                                        <ul className="pagination custom-pagination">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                >
                                                    {t('departments.previous')}
                                                </button>
                                            </li>
                                            {renderPageNumbers()}
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                >
                                                    {t('departments.next')}
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                    <div className="last-updated-container">
                                        <p className="last-updated-text">
                                            <b>{t('corporation.showing')} {startEntry} {t('corporation.to')} {endEntry} {t('corporation.of')} {updatedtotalEntries} {t('corporation.entries')}</b>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnnualFinancialStatement;