import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Administration.css"
import "../DepartmentCustomCss/DepartmentCustom.css";
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

const Administration = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [administration, setAdinistration] = useState([]);
    const totalPages = Math.ceil(administration.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = administration.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const [bgImage, setBgImage] = useState("");
      const { i18n, t } = useTranslation();
    

    const fetchAdministration = async () => {
        try {
            const response = await api.get(`/administration?lang=${i18n.language}`);
            setAdinistration(response.data);
        } catch (error) {
            console.error("Error fetching administration data", error);
        }
    };

    useEffect(() => {
        fetchAdministration();
        fetchHeaderImage();
    }, [i18n.language]);

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
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Administration");

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
                        <span className="breadcrumb-item active1">{t('administration.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('administration.highlight')}</span>
                        <span className="highlighted-text"> {t('administration.highlight-text')}</span>
                        <hr />
                    </h2>
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
                                                {t('departments.sno')}
                                            </th>
                                            <th className="table-heading-styling">{t('corporation.name')}</th>
                                            <th className="table-heading-styling">{t('corporation.designation')}</th>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                {t('corporation.phoneNo')}
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
                                <p class="last-updated-text"><b>{t('corporation.update')} :</b> 20-09-2024 01:00 pm</p>
                            </div>
                        </div>
                        <nav aria-label="Page navigation" className="d-flex justify-content-start paginationtop">
                            <ul className="pagination custom-pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                    {t('corporation.previous')}
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                    {t('corporation.next')}
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
