import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TendersQuotations.css";
import "../DepartmentCustomCss/DepartmentCustom.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import "../TableCss/TableCss.css"
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const TendersQuotations = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [tenders, setTenders] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();


    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Tenders-and-Quotations");

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

    const filteredData = tenders.filter((item) =>
        item.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const fetchTenders = async () => {
        try {
            const response = await api.get(`/tenders-quotations?lang=${i18n.language}`);
            setTenders(response.data.reverse());
        } catch (error) {
            console.error("Error fetching tender data", error);
        }
    };

    useEffect(() => {
        fetchTenders();
        fetchHeaderImage();
    }, [i18n.language]);

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
                <div className="container-fluid font-location mt-4 mb-5" id="tender-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                        {t('departments.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                        {t('tender.name')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('tender.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('tender.highlight')}</span>
                        <span className="highlighted-text"> {t('tender.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="d-flex justify-content-between align-items-center mb-3">
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

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width='8%'>{t('departments.sno')}</th>
                                            <th className="table-heading-styling" width='60%'>{t('tender.tendername')}</th>
                                            <th className="table-heading-styling">{t("propertyTaxDept.department")}</th>
                                            <th className="table-heading-styling text-center">{t('departments.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td style={{ textWrap: "pretty" }}>{item.heading}</td>
                                                <td>{item.department}</td>
                                                <td className="text-center">
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
                                        ))}
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
                    </div>

                </div>
            </div>
        </>
    );
};

export default TendersQuotations;
