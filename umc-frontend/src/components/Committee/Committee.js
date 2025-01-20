import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Committee.css"
// import pdficon from '../../assets/images/Departments/document 1.png'
// import Swal from 'sweetalert2';

const standingCommitteeData = [
    { name1: "Shri. Deepak Sirwani" },
    { name1: "Shri. Rajesh Vadhariya" },
    { name1: "Shri. Bhagwan Bhalerav" },
    { name1: "Shri. Jamnadas Purswani" },
    { name1: "Smt. Jaya Prakash Makhija" },
    { name1: "Smt. Kavita Lal Panjabi" },
    { name1: "Smt. Archana Karankale" },
    { name1: "Smt. Kanchan Amar Loond" },
    { name1: "Shri. Rajkumar Kishanchand Jagyasi" },
    { name1: "Shri. Kulwantsinh Sohata" },
    { name1: "Shri. Chandrashekar Yadav" },
    { name1: "Shri. Ramesh Chavan" },
    { name1: "Shri. Aakash Patil" },
    { name1: "Shri. Swapnil Bagul" },
    { name1: "Smt. Sunita Bagade" },
    { name1: "Shri. Gajanan Shelake" },
];

const womenChildWefareCommitteeData = [
    // { name1: "" },
];
const wardCommitteeData = [
    { name1: "Smt. Archana Gokul Karankale", name2: "Shri. Mangal Balkrushna Waghe", name3: "Smt. Jayshree Dnyaneshwar Patil", name4: "Smt. Jyoti Dilip Gaikwad" },
    { name1: "Shri. Haresh Parmanand Jagyasi", name2: "Smt. Meenakaur Ajitsingh Labana", name3: "Smt. Pancham Umesh Kalani", name4: "Shri. Jamnadas Khubchand Purswani" },
    { name1: "Smt. Asha Nana Birade", name2: "Shri. Ravindra Dasharath Bagul", name3: "Smt. Charanjitkaur Rajendrasinh Bhullar", name4: "Shri. Rajendrasinh Veersingh Bhullar" },
    { name1: "Shri. Swapnil Milind Bagul", name2: "Smt. Surekha Hanumant Aavhad", name3: "Smt. Anjana Ankush Mhaske", name4: "Shri. Kalwantsinh Gurudev Sohata" },
    { name1: "Shri. Raju Kishanchand Jagyasi", name2: "Smt. Meena kumar Aaylani", name3: "Smt. Geeta Lalchand Sadhanani", name4: "Dr. Prakash Ghanshyam Nathani" },
    { name1: "Smt. Rekha Ashok Thakur", name2: "Smt. Shubhangini Rajesh Nikam", name3: "Smt. Jaya Prakash Makhija", name4: "Shri. Mahesh Pahilraj Sukharamani" },
    { name1: "Smt. Apeksha Bhagwan Bhalerav", name2: "Smt. Sarojini Murlidhar Tekchandani", name3: "Smt. Laxmi Surendra Singh", name4: "Shri. Bhagwan Shankar Bhalerav" },
    { name1: "Smt. Chaya Sujith Chakarvarti urfa adasul", name2: "Smt. Jyoti Prashant Patil", name3: "Smt. Chandravati Ayodhyaprasad Singh", name4: "Shri. Rajesh Nanikram Vadariya" },
    { name1: "Smt. Dimple Narendra Thakur(Kumari)", name2: "Smt. Dipa Narayan Panjabi", name3: "Shri. Ajit Prabhunath Gupta", name4: "Shri. Rajendra Shantaram Choudhari" },
    { name1: "Smt. Pushpa Nana Bagul", name2: "Smt. Rajashri Rajendra Choudhari", name3: "Smt. Shubangi Manohar Behanwal", name4: "Shri. Jivan Chandrabhan Edanani" },
    { name1: "Shri. Ravi Kishanchand Jagyasi", name2: "Smt. Indira Jamnadas Udasi", name3: "Smt. Jyoti Prakash(Pinto) Bathija", name4: "Shri. Deepak Laxmandas Sirwani" },
    { name1: "Smt. Savita Pravin Torane(Ragde)", name2: "Shri. Gajanan Pralhad Shelake", name3: "Smt. Kavita Lal Panjabi", name4: "Shri. Dhananjay Baburav Bodare" },
    { name1: "Shri. Chandrashekar Keshav Yadav", name2: "Smt. Mitali Rajesh Chanpur", name3: "Smt. Leelabai Laxman Ashan", name4: "Shri. Shankar Govindram Loond" },
    { name1: "Smt. Sangeeta Nitin Sapakale", name2: "Smt. Sheetal Chandrakant Kadam", name3: "Smt. Vasudha Dhananjay Bodare", name4: "Shri. Ramesh Mahadev Chavan" },
    { name1: "Smt. Dipti Navin Dudhani", name2: "Smt. Jyoti Ramesh Chainani", name3: "Smt. Kanchan Amar Loond", name4: "Shri. Satramdas Putandas Jeswani" },
    { name1: "Smt. Anjali Chandrakant Salave", name2: "Smt. Jyotsna Suresh Jadhav", name3: "Smt. Jyoti Shamrav Mane", name4: "Shri. Rajesh Devendra Wankhede" },
    { name1: "Shri. Sumit Sagar Sonkamble", name2: "Shri. Bharat Ramchand Rajvani(Gangotri)", name3: "Smt. Kavita Sudhir Bagul", name4: "Shri. Vijay Chahu Patil" },
    { name1: "Smt. Sunita Baburav Bagade", name2: "Shri. Pramod Namdev tale", name3: "Smt. Minakashi Ravi Patil", name4: "" },
    { name1: "Shri. Kishor Narayandas Vanwari", name2: "Smt. Meena Chandragupt Soneji", name3: "Shri. Vikas Parshuram Patil", name4: "" },
    { name1: "Km. Kavita Suresh Gaikwad", name2: "Shri. Aakash Parshuram Patil", name3: "", name4: "" },
];

const Committee = () => {
    const [selectedButton, setSelectedButton] = useState('Standing Committee');

    const headersMap = {
        "Standing Committee": ["Standing Committee Name"],
        "Women and child Welfare Committee": ["Women and child Welfare Committee Name"],
        "Ward Committee": ["Ward Committee A", "Ward Committee B", "Ward Committee C", "Ward Committee D"],
    };
    const tableHeaders = headersMap[selectedButton] || [];

    // const handleClick = (link, e) => {
    //     if (link === "#") {
    //         e.preventDefault();
    //         Swal.fire({
    //             title: 'Information',
    //             text: 'The PDF for this department will be available soon.',
    //             icon: 'info',
    //             confirmButtonText: 'Ok'
    //         });
    //     }
    // };

    const getTableData = () => {
        switch (selectedButton) {
            case 'Standing Committee':
                return standingCommitteeData;
            case 'Women and child Welfare Committee':
                return womenChildWefareCommitteeData;
            case 'Ward Committee':
                return wardCommitteeData;
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

    const totalEntries = tableData.length;

    const filteredData = tableData.filter((item) =>
        item.name1.toLowerCase().includes(searchTerm.toLowerCase())
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

    const updatedtotalEntries = tableData.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="committee-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Committee</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">UMC</span>
                        <span className="highlighted-text"> Committee</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3" id='municipal-css'>
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                <button className={`btn ${selectedButton === 'Standing Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Standing Committee')}>Standing Committee</button>
                                <button className={`btn ${selectedButton === 'Women and child Welfare Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Women and child Welfare Committee')}>Women and child Welfare Committee</button>
                                <button className={`btn ${selectedButton === 'Ward Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Ward Committee')}>Ward Committee</button>
                            </div>

                            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="entries-wrapper">
                                <label htmlFor="entries" className="entries-label">
                                    Show
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
                                <span className="entries-text">entries</span>
                            </div>

                            <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
                                <label
                                    htmlFor="searchInput"
                                    className="search-label"
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Search
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
                        </div> */}

                            <div className="circular-wrapper mt-5">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="text-center table-heading-styling" width="8%">Sr No.</th>
                                            {tableHeaders.map((header, index) => (
                                                <th
                                                    className="table-heading-styling text-start"
                                                    key={index}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((item, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="font-large text-center">{startIndex + rowIndex + 1}</td>
                                                    {Object.values(item).map((value, colIndex) => (
                                                        <td
                                                            className="text-start"
                                                            key={colIndex}
                                                            style={{ textWrap: "pretty" }}
                                                        >
                                                            {value || "-"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="100%" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                            <div class="last-updated-container">
                                <p className="last-updated-text">
                                    <b>Showing {startEntry} to {endEntry} of {totalEntries} entries</b>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Committee;