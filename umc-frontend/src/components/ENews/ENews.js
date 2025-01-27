import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ENews.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';

const enews = [
    { description: "जागतिक सायकल दिनानिमित्त उल्हासनगर महानगरपालिका आयोजित महापालिका मुख्यालयापासून गोल मैदान व शहाड स्टेशन पासुन परत महापालिका मुख्यालय या मार्गावरून पर्यावरण जनजागृतीकरीता सायकल रॅली दि. ०३.०६.२०२२", date: "2022-06-07", link: "https://drive.google.com/file/d/1Id8i8I5f11gkl7oFdrXo9W_dBUR94O_Z/view?usp=drive_link", posting: "View PDF" },
    { description: "उल्हासनगर महापालिका शिक्षण विभागामार्फत झुलेलाल हायस्कुल, उल्हासनगर- २ येथे महानगरपालिका शाळेच्या सर्व मुख्याध्यापक व शिक्षक यांचे एकदिवसीय शैक्षणिक कार्यशाळेचे आयोजन करण्यात आले", date: "2022-04-28", link: "https://drive.google.com/file/d/1NN_wvF6A8nuP1rPGPSHx752L1f02dUJA/view?usp=drive_link", posting: "View PDF" },
];

const ENews = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    //eslint-disable-next-line
    const [searchTerm, setSearchTerm] = useState("");
    const totalEntries = enews.length;
    const filteredData = enews.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const updatedtotalEntries = enews.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>

            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="resolution-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">e-News Letter</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">e-News</span>
                        <span className="highlighted-text"> Letter</span>
                        <hr />
                    </h2>
                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Detail's/Information
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Issue Date
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="8%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {startIndex + index + 1}
                                                </td>
                                                <td
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textWrap: "pretty",
                                                    }}
                                                >
                                                    {item.description}
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
                                                    {item.date}
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
                                                        {item.posting}
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

export default ENews;

