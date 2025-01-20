import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Budget.css"
import pdficon from '../../assets/images/Departments/document 1.png'
import Swal from 'sweetalert2';

const firstYearData = [
    { name: 'UMC Budget 2014-2015', pdf: '#', },
];

const secondYearData = [
    { name: 'UMC Budget 2015-2016', pdf: '#', },
];

const thirdYearData = [
    { name: 'UMC Budget 2017-2018', pdf: '#', },
];

const fourthYearData = [
    { name: 'UMC Budget 2018-2019', pdf: 'https://drive.google.com/file/d/11CPGbI6vtn62rKi-mGLxNwz2y8eTxMbG/view?usp=drive_link', },
];

const fifthYearData = [
    { name: 'UMC Budget 2019-2020', pdf: 'https://drive.google.com/file/d/1JFJOnioYR9lGDFutlgnivM2daaa_Yd7W/view?usp=drive_link', },
];

const sixthYearData = [
    { name: 'UMC Budget 2020-2021', pdf: '#', },
];

const Budget = () => {
    const [selectedButton, setSelectedButton] = useState('2020-2021');

    const headersMap = {
        "2020-2021": ["Budget Name"],
        "2019-2020": ["Budget Name"],
        "2018-2019": ["Budget Name"],
        "2017-2018": ["Budget Name"],
        "2015-2016": ["Budget Name"],
        "2014-2015": ["Budget Name"],
    };
    const tableHeaders = headersMap[selectedButton] || [];

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

    const getTableData = () => {
        switch (selectedButton) {
            case '2020-2021':
                return sixthYearData;
            case '2019-2020':
                return fifthYearData;
            case '2018-2019':
                return fourthYearData;
            case '2017-2018':
                return thirdYearData;
            case '2015-2016':
                return secondYearData;
            case '2014-2015':
                return firstYearData;
            default:
                return [];
        }
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const tableData = getTableData();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    //eslint-disable-next-line
    const [searchTerm, setSearchTerm] = useState("");
    //eslint-disable-next-line
    const totalEntries = tableData.length;

    const filteredData = tableData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    //eslint-disable-next-line
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

    const updatedtotalEntries = tableData.length;
    //eslint-disable-next-line
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    //eslint-disable-next-line
    const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>
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

                    <div className="row mt-4 row-styling-3" id='municipal-css'>
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                <button className={`btn ${selectedButton === '2020-2021' ? "active" : ""}`} onClick={() => handleButtonClick('2020-2021')}>2020-2021</button>
                                <button className={`btn ${selectedButton === '2019-2020' ? "active" : ""}`} onClick={() => handleButtonClick('2019-2020')}>2019-2020</button>
                                <button className={`btn ${selectedButton === '2018-2019' ? "active" : ""}`} onClick={() => handleButtonClick('2018-2019')}>2018-2019</button>
                                <button className={`btn ${selectedButton === '2017-2018' ? "active" : ""}`} onClick={() => handleButtonClick('2017-2018')}>2017-2018</button>
                                <button className={`btn ${selectedButton === '2015-2016' ? "active" : ""}`} onClick={() => handleButtonClick('2015-2016')}>2015-2016</button>
                                <button className={`btn ${selectedButton === '2014-2015' ? "active" : ""}`} onClick={() => handleButtonClick('2014-2015')}>2014-2015</button>
                            </div>
                            <div className="circular-wrapper mt-5">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">

                                        <tr>
                                            <th className="table-heading-styling text-center" width="8%">Sr. No.</th>
                                            {tableHeaders.map((header, index) => {
                                                if (header === "Budget Name") {
                                                    return (
                                                        <th className="table-heading-styling text-start" key={index}>
                                                            {header}
                                                        </th>
                                                    );
                                                }
                                                return (
                                                    <th className="table-heading-styling text-center" key={index}>
                                                        {header}
                                                    </th>
                                                );
                                            })}
                                            <th className="table-heading-styling text-center" width="10%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td>{item.name}</td>
                                                <td className="text-center">
                                                    <Link
                                                        to={item.pdf}
                                                        className="text-decoration-none"
                                                        target={item.pdf === "#" ? "" : "_blank"}
                                                        style={{ color: "#333333" }}
                                                        onClick={(e) => handleClick(item.pdf, e)}
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
                                        ))}
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