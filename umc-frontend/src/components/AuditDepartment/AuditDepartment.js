

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AuditDepartment.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import banner from '../../assets/images/Departments/audit.jpg';

const employeesData1 = [
  { title: "लेखा परीक्षण अहवाल सन २०१०-११", link: "https://drive.google.com/file/d/19FthgNB29hy4bHH2n-evGJnrm40hOa9v/view?usp=drive_link", action: "View PDF", },
  { title: "लेखा परीक्षण २०१२-१३", link: "#", action: "View PDF" },
  { title: "लेखा परीक्षण २०११-२०१२", link: "https://drive.google.com/file/d/1vQqgp86lTzLgAWrvIb9-MCOYbicuoz32/view?usp=drive_link", action: "View PDF" },
  { title: "लेखा परिक्षण अहवाल सन २०१७-१८", link: "https://drive.google.com/file/d/1i-bHGFmmqSkG_HsnEQeSwPfNwo3CQvyy/view?usp=drive_link", action: "View PDF" },
  { title: "लेखा परिक्षण अहवाल सन २०१३-१४ ते २०१६-१७", link: "https://drive.google.com/file/d/1u8rGiyNiZK956wzd5Kuf7iCgB5x90gBx/view?usp=drive_link", action: "View PDF" },
  { title: "लेखा परिक्षण अहवाल सन २००९ -१०", link: "#", action: "View PDF" },
  { title: "लेखा परिक्षण अहवाल सन २००८-०९", link: "#", action: "View PDF" },
  { title: "UMC Education Department Audit Report 2012-2013", link: "https://drive.google.com/file/d/1vb9ubwxbmae4-szkZSlNLdtYX2kuedKn/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Audit Report 2015-2016", link: "https://drive.google.com/file/d/1sShSCEHe7ORKvbUT-kef74X1AsQxCHHQ/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Audit Report 2014-2015", link: "https://drive.google.com/file/d/1sSLjeO2VLpmtutriX_GFM4Mk7jWqwC31/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Audit Report 2013-2014", link: "https://drive.google.com/file/d/1Qp8FRzGJckY_QqBD9X-qc8RCLvq9EAFN/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Audit Report 2012-2013", link: "https://drive.google.com/file/d/1cFhpi8WppDn6m3FmXnnoHu1NSb3NqY-0/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Audit Report 2011-2012", link: "https://drive.google.com/file/d/1KR0NohMMlE96rIIlUAcODYXy51uI0acQ/view?usp=drive_link", action: "View PDF" },
  { title: "Town Planning Department- Audit Report 2016-17", link: "https://drive.google.com/file/d/1H3IZSlx1l8mn-u5kUtaAg9NwlOTS9aZv/view?usp=drive_link", action: "View PDF" },
  { title: "Tax Department- Audit Report 2016-17", link: "https://drive.google.com/file/d/1GDF1gyhwVz38XeWNNpQgBk-5xyiUIvod/view?usp=drive_link", action: "View PDF" },
  { title: "Local Fund Audit Report 2014-2015", link: "https://drive.google.com/file/d/1ABoUg5fyg7o2zgAD6JVuy_tH8pDPSPSB/view?usp=drive_link", action: "View PDF" },
  { title: "Estate Department- Audit Report 2016-17", link: "https://drive.google.com/file/d/1--sQ6N2JiGqJobtg3ZXPGKt_kPvw5Pnv/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report Water Supply Department 2013-2016", link: "https://drive.google.com/file/d/1gYVaVKHOKGVqQ15hDAARcgJQlH7eVazb/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report Town Planning Department 2013-2016", link: "https://drive.google.com/file/d/1z9PD13mBodMX9ad-gfND2n6_4lcdFcEU/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report Tax Department 2012-2016", link: "https://drive.google.com/file/d/1YE8elyhXpfOsk0h8pPLmjEmVJJ7I_Uzr/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report Public Works Department 2013-2016", link: "https://drive.google.com/file/d/1dDn0gx3rk_Eo7OnN3OpskTqr__Gx7vmP/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report LBT Department 2007-2016", link: "https://drive.google.com/file/d/1yPmRHgGwWQYZuQ105_wB94YTK198Idkr/view?usp=drive_link", action: "View PDF" },
  { title: "AG Report Encroachment Department 2013-2016", link: "https://drive.google.com/file/d/1V57wNi3TRRR3zr83RaVT3qYN71YXoJDp/view?usp=drive_link", action: "View PDF" },
  { title: "Account Department- Audit Report 2016-17", link: "https://drive.google.com/file/d/1irPEtKuu5IFX_HWcXt_yEdZ1WBpqFPc-/view?usp=drive_link", action: "View PDF" },
];

const ITEMS_PER_PAGE = 10;

const AuditDepartment = () => {
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

      {/* <div className="audit-header-image"></div> */}

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
        <div className="container-fluid font-location mt-4 mb-2" id="audit-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Audit Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Audit</span>
            <span className="highlighted-text"> Department</span>
            <hr />
          </h2>
          <div className="row mt-4">
            <div className="col-12">
              <ul className="dept-custom-list">
                <li>Audit of Municipal Fund </li>
                <li>Follow the orders of Standing Committee</li>
                <li>Framing of rules for Auditing </li>
                <li>Control and Check on Accounts of Corporation</li>
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
                <p className="dept-custom-title">Mr. Sharad Deshmukh</p>
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
                        <span className="dept-value"> Head of Audit Department</span>
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
                          {" "}
                          2nd Floor, Audit Department, Head quarter of Ulhasnagar Municipal Corporation, Ulhasnagar-421003
                        </span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon5} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Phone Number :</strong>
                        <span className="dept-value"> 0251-2720116 / 9881250920</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon6} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Email Address :</strong>
                        <span className="dept-value"> umc.audit2017@gmail.com</span>
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

export default AuditDepartment;
