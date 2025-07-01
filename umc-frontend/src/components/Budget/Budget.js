import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Budget.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const Budget = () => {
    const [selectedButton, setSelectedButton] = useState();
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Budget");

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
        const fetchData = async () => {
            try {
                const response = await api.get(`/budgets_data?lang=${i18n.language}`);
                const sortedData = response.data.sort((a, b) => {
                    const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                    const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                    return dateB - dateA;
                });
                setBudgetData(sortedData);
                setLoading(false);
                const years = [...new Set(response.data.map(item => item.year))]
                    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
                setUniqueYears(years);
                if (years.length > 0) {
                    setSelectedButton(years[0]);
                }

            } catch (err) {
                setError("Failed to fetch data.");
                setLoading(false);
            }
        };
        fetchData();
    }, [i18n.language]);


    const handleClick = (link, e) => {
        if (link === "#") {
            e.preventDefault();
            Swal.fire({
                title: 'Information',
                text: 'The PDF will be available soon.',
                icon: 'info',
                confirmButtonText: 'Ok',
            });
        }
    };

    const getTableData = () => {
        return budgetData.filter(item => item.year === selectedButton);
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const tableData = getTableData();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = tableData.filter((item) =>
        item.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // eslint-disable-next-line
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // eslint-disable-next-line
    const convertToLocalizedDigits = (number) => {
        const digits = t('digits', { returnObjects: true });
        return number
            .toString()
            .split('')
            .map((d) => digits[parseInt(d)] || d)
            .join('');
    };

    // eslint-disable-next-line
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


    useEffect(() => {
        fetchHeaderImage();
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
                <div className="container-fluid font-location mt-4 mb-5" id="budget-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('corporation.home')}
                        </Link>
                        <span className="breadcrumb-item text-decoration-none">
                            {t('corporation.corporation')}
                        </span>
                        <span className="breadcrumb-item active1">{t('budget.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('budget.highlight')}</span>
                        <span className="highlighted-text"> {t('budget.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3" id="municipal-css">
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                {[...uniqueYears]
                                    .sort((a, b) => {
                                        const yearA = parseInt(a.split("-")[0], 10);
                                        const yearB = parseInt(b.split("-")[0], 10);
                                        return yearB - yearA;
                                    })
                                    .map((year) => (
                                        <button
                                            key={year}
                                            className={`btn ${selectedButton === year ? "active" : ""}`}
                                            onClick={() => handleButtonClick(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                            </div>
                            <div className="circular-wrapper mt-5">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width="8%">{t('departments.sno')}</th>
                                            <th className="table-heading-styling text-start">{t('corporation.budget')}</th>
                                            <th className="table-heading-styling text-center" width="20%">{t('departments.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3} className="text-center">Loading...</td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={3} className="text-center text-danger">{error}</td>
                                            </tr>
                                        ) : currentData.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center">{t('departments.nodata')}</td>
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
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Budget;
