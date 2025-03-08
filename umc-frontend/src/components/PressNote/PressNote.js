import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PressNote.css";
import "../DepartmentCustomCss/DepartmentCustom.css";
import "../TableCss/TableCss.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from "sweetalert2";
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const PressNote = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [notes, setNotes] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();
    const ITEMS_PER_PAGE = 20;

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Press-Note");

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

    const fetchNotes = async () => {
        try {
            const response = await api.get(`/press-note?lang=${i18n.language}`);
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setNotes(sortedData);
        } catch (error) {
            console.error("Error fetching press notes", error);
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchHeaderImage();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = notes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                <div className="container-fluid font-location mt-4 mb-2" id="press-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('departments.home')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('pressNote.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('pressNote.highlight')}</span>
                        <span className="highlighted-text"> {t('pressNote.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                {t('departments.sno')}
                                            </th>
                                            <th className="table-heading-styling">{t('tourism.description')}</th>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                {t('departments.action')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="6%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
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
                                                <td
                                                    width="80%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textWrap: "pretty"
                                                    }}
                                                >
                                                    {item.description}
                                                </td>
                                                <td
                                                    width="10%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#333333",
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <nav aria-label="Page navigation" className="d-flex justify-content-start">
                            <ul className="pagination custom-pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        {t('departments.previous')}
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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

export default PressNote;
