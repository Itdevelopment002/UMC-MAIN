import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MunicipalMeeting.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const MunicipalMeeting = () => {
    const [selectedButton, setSelectedButton] = useState('');
    const [tableData, setTableData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [availableButtons, setAvailableButtons] = useState([]);
    const [headersMap, setHeadersMap] = useState({});
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();



    // Fetch data from the backend
    useEffect(() => {
        api.get(`/muncipal_meetings?lang=${i18n.language}`)
            .then((response) => {
                setTableData(response.data);
                const uniqueNames = [...new Set(response.data.map(item => item.name))];
                setAvailableButtons(uniqueNames);

                const dynamicHeadersMap = {};
                
                uniqueNames.forEach(name => {
                    dynamicHeadersMap[name] = [
                        `${name} ${t('muncipal.agenda')}`,
                        `${name} ${t('muncipal.minutes')}`,
                        `${name} ${t('muncipal.resolution')}`,
                    ];
                });
                
                setHeadersMap(dynamicHeadersMap);

                if (uniqueNames.length > 0) {
                    setSelectedButton(uniqueNames[0]);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, [i18n.language]);

    useEffect(() => {
        fetchHeaderImage();
    }, []);

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Municipal-meeting");

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

    const tableHeaders = headersMap[selectedButton] || [];

    const getTableData = () => {
        return tableData.filter(item => item.name === selectedButton);
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        setCurrentPage(1); // Reset to the first page when changing the button
    };

    const filteredData = getTableData().filter((item) =>
        item.year.toLowerCase().includes(searchTerm.toLowerCase())
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
        setCurrentPage(1); // Reset to the first page when changing items per page
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

    const updatedTotalEntries = filteredData.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedTotalEntries);

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
                        <span className="breadcrumb-item active1">{t('muncipal.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('muncipal.highlight')}</span>
                        <span className="highlighted-text"> {t('muncipal.highlight-text')}</span>
                        <hr />
                    </h2>
                    <div className="row mt-4 row-styling-3" id='municipal-css'>
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                {availableButtons.map((buttonName) => (
                                    <button
                                        key={buttonName}
                                        className={`btn ${selectedButton === buttonName ? "active" : ""}`}
                                        onClick={() => handleButtonClick(buttonName)}
                                    >
                                        {buttonName}
                                    </button>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="entries-wrapper">
                                    <label htmlFor="entries" className="entries-label">{t('corporation.show')}</label>
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
                                    <label htmlFor="searchInput" className="search-label" style={{ whiteSpace: "nowrap" }}>
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

                            {/* Table Rendering */}
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width="8%">{t('departments.sno')}</th>
                                            <th className="table-heading-styling" width="50%">{t('corporation.year')}</th>
                                            {tableHeaders.map((header, index) => (
                                                <th className="table-heading-styling text-center" key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">{startEntry + index}</td>
                                                <td>{item.year}</td>
                                                <td className="text-center">
                                                    {item.pdf_link1 && item.pdf_link1 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link1}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {item.pdf_link2 && item.pdf_link2 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link2}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {item.pdf_link3 && item.pdf_link3 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link3}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="last-updated-container">
                                <p className="last-updated-text">
                                    <b>{t('corporation.showing')} {startEntry} {t('corporation.to')} {endEntry} {t('corporation.of')} {updatedTotalEntries} {t('corporation.entries')}</b>
                                </p>
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

export default MunicipalMeeting;