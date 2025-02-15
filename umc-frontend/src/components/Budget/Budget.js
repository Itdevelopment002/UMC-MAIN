import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Budget.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const Budget = () => {
    const [selectedButton, setSelectedButton] = useState('2020-2021');
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    useEffect(() => {
        fetchHeaderImage();

    }, []);
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
    // Fetching data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/budgets_data?lang=${i18n.language}`);

                setBudgetData(response.data);
                setLoading(false);

                // Extracting unique years from the budget data
                const years = [...new Set(response.data.map(item => item.year))];
                setUniqueYears(years);

            } catch (err) {
                setError("Failed to fetch data.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const updatedtotalEntries = filteredData.length;
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
                <div className="container-fluid font-location mt-4 mb-5" id="budget-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Budget</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Budget</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3" id="municipal-css">
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">

                            {/* Dynamic Year Buttons */}
                            <div className="button-group mb-4 d-flex justify-content-start">
                                {[...uniqueYears]
                                    .sort((a, b) => {
                                        const yearA = parseInt(a.split("-")[0], 10);
                                        const yearB = parseInt(b.split("-")[0], 10);
                                        return yearB - yearA; // Sort in descending order
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
                                            <th className="table-heading-styling text-center" width="8%">Sr. No.</th>
                                            <th className="table-heading-styling text-start">Budget Name</th>
                                            <th className="table-heading-styling text-center" width="10%">Action</th>
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
                                                <td colSpan={3} className="text-center">No Data Available</td>
                                            </tr>
                                        ) : (
                                            currentData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="font-large text-center">
                                                        {startIndex + index + 1}
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
                                                            View PDF
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
