import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ControllerDept.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png'

const employeesData1 = [
  { Srno: "01", Title: "UMC Disaster Management Plan 2024", Action: "View PDF" },
  { Srno: "02", Title: "Regarding emergency management and pre-monsoon review meetings in the Municipal Corporation. (28/04/2022)", Action: "View PDF" },
  { Srno: "03", Title: "UMC Disaster Management Plan 2020", Action: "View PDF" },
  { Srno: "04", Title: "National Disaster Management Authority", Action: "View PDF" },
  { Srno: "05", Title: "District Disaster Management Authority", Action: "View PDF" },
  { Srno: "06", Title: "Disaster Management Act, 2005", Action: "View PDF" },
  { Srno: "07", Title: "UMC Action Plan 2020 and Emergency Contact Numbers", Action: "View PDF" },
  { Srno: "08", Title: "Emergency Response Plan for 2021", Action: "View PDF" },
  { Srno: "09", Title: "Urban Disaster Guidelines", Action: "View PDF" },
  { Srno: "10", Title: "Flood Management Guidelines 2022", Action: "View PDF" },
];

const ControllerDept = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
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
    }

    return pageNumbers;
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>
      <div id="main-content">
        <div className="container-fluid font-location mt-4 mb-2" id="controller-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="/departments" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Controller Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Controller </span>
            <span className="highlighted-text">Department</span>
            <hr />
          </h2>
          <div className="row mt-4">
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
          </div>


          <div className="row mt-4">
            <div className="col-lg-3 col-md-4 col-sm-12 col-12">
              <div className="dept-profile-card text-center">
                <img
                  src={deptimg}
                  alt="dept-img"
                  className="dept-profile-image"
                />
                <p className="dept-custom-title">HOD Name</p>
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
                        <span className="dept-value"> Head of Vehicle Department</span>
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
                        <span className="dept-value"> HOD’s Education</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon4} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Office Address :</strong>
                        <span className="dept-value">
                          {" "}
                          Ulhasnagar Municipal Corporation Near Chopda Court,
                          Ulhasnagar - 421 003, Maharashtra.
                        </span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon5} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Phone Number :</strong>
                        <span className="dept-value"> 022 2745 8040 / 41 / 42</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon6} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Email Address :</strong>
                        <span className="dept-value"> Department email id</span>
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
                          {item.Srno}
                        </td>
                        <td
                          width="80%"
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            color: "#292D32",
                          }}
                        >
                          {item.Title}
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
                          {item.Action}
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

export default ControllerDept;
