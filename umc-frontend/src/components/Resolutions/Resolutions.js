import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Resolutions.css";
import api, { baseURL } from "../api";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

const Resolutions = () => {
    const [resolutions, setResolutions] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    useEffect(() => {
        fetchResolutions();
        fetchHeaderImage();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const fetchResolutions = async () => {
        try {
            const response = await api.get(`/resolution?lang=${i18n.language}`);
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.Schedule_Date_of_Meeting ? new Date(a.Schedule_Date_of_Meeting) : new Date(0);
                const dateB = b.Schedule_Date_of_Meeting ? new Date(b.Schedule_Date_of_Meeting) : new Date(0);
                return dateB - dateA;
            });
            setResolutions(sortedData);
        } catch (error) {
            console.error("Error fetching resolutions:", error);
        }
    };

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Resolutions");

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

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    //eslint-disable-next-line
    const [searchTerm, setSearchTerm] = useState("");
    const totalEntries = resolutions.length;
    const filteredData = resolutions;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    //eslint-disable-next-line
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

    const updatedtotalEntries = resolutions.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

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
                <div className="container-fluid font-location mt-4 mb-5" id="resolution-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('corporation.home')}
                        </Link>
                        <span className="breadcrumb-item text-decoration-none">
                            {t('corporation.corporation')}
                        </span>
                        <span className="breadcrumb-item active1">{t('resolution.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('resolution.highlight')}</span>
                        <span className="highlighted-text"> {t('resolution.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="system-style-div text-start">
                                <p className="mb-0">
                                    <span className="span-system1">{t('corporation.resolutionText')}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('departments.sno')}
                                            </th>
                                            <th className="table-heading-styling">
                                                {t('corporation.deptname')}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('corporation.resolutionno')}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('corporation.schedule')}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('corporation.adjournment')}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('departments.action')}
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
                                                        textAlign: "center"
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
                                                    width="20%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.Department_Name}
                                                </td>
                                                <td
                                                    width="20%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.Resolutions_No_Date}
                                                </td>
                                                <td
                                                    width="20%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {new Date(item.Schedule_Date_of_Meeting)
                                                        .toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        .replace(/\//g, "-")}
                                                </td>
                                                <td
                                                    width="20%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.Adjournment_Notice}
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
                                                    <Link
                                                        to={item.pdf_link}
                                                        className="text-decoration-none"
                                                        target={item.pdf_link === "#" ? "" : "_blank"}
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
                                        <b>{t('corporation.showing')} {startEntry} {t('corporation.to')} {endEntry} {t('corporation.of')} {totalEntries} {t('corporation.entries')}</b>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Resolutions;

