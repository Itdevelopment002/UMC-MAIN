import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EncroachmentDepartment.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import banner from '../../assets/images/Departments/Encroachment Department 1.jpg'

const employeesData1 = [
  { title: "Unauthorized Banner Court Notice", link: "https://drive.google.com/file/d/1X1-4x8VGz8bbEfPdT9eBuH0i8_fUSVL7/view?usp=drive_link", action: "View PDF", },
  { title: "Unauthorized Banner Committee Member List", link: "https://drive.google.com/file/d/1KXis9BapVdzIulBp7Gwh5OBlCXn_92Up/view?usp=drive_link", action: "View PDF" },
  { title: "Theaters, Colleges, Offices Illegal Hoarding, Banner Notice", link: "https://drive.google.com/file/d/18CstPd-Hk8pIJBKJ0DYkAMsnL56rBkBw/view?usp=drive_link", action: "View PDF" },
  { title: "Notice for Unauthorized Banner by Department", link: "https://drive.google.com/file/d/10OLGBkkt8wIbahyZk_bDpHsZvXkcfueg/view?usp=drive_link", action: "View PDF" },
];

const ITEMS_PER_PAGE = 10;

const EncroachmentDepartment = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employeesData1.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = employeesData1.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClick = (link, e) => {
    if (link === "#") {
      e.preventDefault();
      Swal.fire({
        title: 'Information',
        text: 'The PDF for this department will be available soon.',
        icon: 'info',
        confirmButtonText: 'Ok'
      });
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>

      {/* <div className="history-header-image"></div> */}

      <div className="">
        <img
          src={banner}
          alt="dep-img"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </div>

      <div id="main-content">
        <div className="container-fluid font-location mt-4 mb-2" id="encroachment-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Encroachment Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Encroachment</span>
            <span className="highlighted-text"> Department</span>
            <hr />
          </h2>
          {/* <div className="row mt-4">
          <div className="col-12">
            <ul className="dept-custom-list">
              <li>To receive all moneys payable to the Corporation and credit the same in the bank Account of the Corporation </li>
              <li>To make payment on account of Municipal Fund</li>
              <li>To estimate Income & Exp. statement for the next financial year before 31st of March</li>
              <li>To make payment of Salary and pension of the employees </li>
              <li>To make payment of Salary and pension of the employees </li>
              <li>To make scrutiny of every financial proposal on behalf of Hon. commissioner</li>
            </ul>
          </div>
        </div> */}


          <div className="row mt-4">
            <div className="col-lg-3 col-md-4 col-sm-12 col-12">
              <div className="dept-profile-card text-center">
                <img
                  src={deptimg}
                  alt="dept-img"
                  className="dept-profile-image"
                />
                <p className="dept-custom-title">Mr. Ganesh Shimpi</p>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-sm-12 col-12">
              <div className="dept-details-card">
                <div className="dept-row">
                  <div className="dept-col">
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon2} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Designation :</strong>
                        <span className="dept-value"> Head of Encroachment Department</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon3} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">
                          Education Qualification :
                        </strong>
                        <span className="dept-value"> -</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon4} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Office Address :</strong>
                        <span className="dept-value">
                          {" "}-
                        </span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon5} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Phone Number :</strong>
                        <span className="dept-value"> -</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon6} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Email Address :</strong>
                        <span className="dept-value"> -</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4 row-styling-3">
            <div className="col-12">
              <div className="table-wrapper">
                <table className="table table-bordered table-responsive shadow">
                  <thead className="bg-orange text-white">
                    <tr>
                      <th
                        className="table-heading-styling"
                        style={{ textAlign: "center" }}
                      >
                        Sr. No.
                      </th>
                      <th className="table-heading-styling">Details / Information</th>
                      <th
                        className="table-heading-styling"
                        style={{ textAlign: "center" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
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
                            {startIndex + index + 1}
                          </td>
                          <td
                            width="80%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.title}
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
                              {item.action}
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "#333333" }}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <nav aria-label="Page navigation" className="d-flex justify-content-start">
              <ul className="pagination custom-pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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

export default EncroachmentDepartment;
