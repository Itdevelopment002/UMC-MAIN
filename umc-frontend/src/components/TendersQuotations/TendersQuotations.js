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

    const fetchTenders = async () => {
        try {
            const response = await api.get(`/tenders-quotations?lang=${i18n.language}`);
            const sortedTenders = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setTenders(sortedTenders);
        } catch (error) {
            console.error("Error fetching tender data", error);
        }
    };

    useEffect(() => {
        fetchTenders();
        fetchHeaderImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

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
        let hasLeftEllipsis = false;
        let hasRightEllipsis = false;

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
            } else if (i < currentPage - 1 && !hasLeftEllipsis) {
                pageNumbers.push(
                    <li key="left-ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
                hasLeftEllipsis = true;
            } else if (i > currentPage + 1 && !hasRightEllipsis) {
                pageNumbers.push(
                    <li key="right-ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
                hasRightEllipsis = true;
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
                        <span className="breadcrumb-item text-decoration-none">
                            {t('tender.name')}
                        </span>
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
                                            <th className="table-heading-styling text-center" width='8%'>{t('tender.issue_date')}</th>
                                            <th className="table-heading-styling" width='60%'>{t('tender.tendername')}</th>
                                            <th className="table-heading-styling">{t("propertyTaxDept.department")}</th>
                                            <th className="table-heading-styling text-center">{t('departments.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">
                                                    {new Date(item.issue_date)
                                                        .toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        .replace(/\//g, "-")}
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