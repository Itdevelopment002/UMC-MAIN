import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EnvironmentDepartment.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import banner from '../../assets/images/Departments/paryavaranvibhag.jpg'

const employeesData1 = [
  { title: "मुर्ती विसर्जनाबाबतची मार्गदर्शक तत्वे", link: "https://drive.google.com/file/d/1QzKPvFoVTVraEJhqTxKLBDXB-9Jf5m4z/view?usp=drive_link", action: "View PDF", },
  { title: "दिनांक ५ जुन २०२२ रोजी जागतिक पर्यावरण दिनानिमित्त उल्हासनगर महानगरपालिके मार्फत भाजी मार्केट क्र. १, भाजी मार्केट क्र. २. कृष्णा मंडळ येथील भाजी मार्केट, उल्हासनगर-४ येथे पर्यावरण जनजागृतीकरीता कापडी पिशव्यांचे वाटप", link: "https://drive.google.com/file/d/1z7lFWHE5mHgcSHvN7D3gF4kKwG4NHSpJ/view?usp=drive_link", action: "View PDF" },
  { title: "जागतिक सायकल दिनानिमित्त उल्हासनगर महानगरपालिका आयोजित महापालिका मुख्यालयापासून गोल मैदान व शहाड स्टेशन पासुन परत महापालिका मुख्यालय या मार्गावरून पर्यावरण जनजागृतीकरीता सायकल रॅली दि. ०३.०६.२०२२", link: "#.", action: "View PDF" },
  { title: "Utilization Certificate dated: 24.12.2021", link: "https://drive.google.com/file/d/1kp_BCAJGW3DaPmB9kb5fuzZl-6KHvgJS/view?usp=drive_link", action: "View PDF" },
  { title: "Ulhasnagar Short term action plan/ESR report", link: "https://drive.google.com/file/d/1FIb-IVFKCj0W5o8K6jcGkQ5O89K8cg_o/view?usp=drive_link", action: "View PDF" },
  { title: "Ulhasnagar Municipal Corporation (UMC) Action Plan Final", link: "https://drive.google.com/file/d/16Lzkj0f-su9aEKJzM9AQg_rbmwzNHSRz/view?usp=drive_link", action: "View PDF" },
  { title: "Ulhasnagar monthly progress report dated: 06.07.2021", link: "https://drive.google.com/file/d/1kxfvr8pqkfS81VgiEyzi3Sj0_TOllEj_/view?usp=drive_link", action: "View PDF" },
  { title: "Ulhasnagar Micro Action Plan dated: 12.08.2021", link: "#", action: "View PDF" },
  { title: "Report for Enenrgy Audit at Ulhasnagar Municipal Corporation - JAN 2022", link: "https://drive.google.com/file/d/1kN4zm5CQ1Z8zf_gqy7yu3ToNkLsYoK4i/view?usp=drive_link", action: "View PDF" },
  { title: "Minutes of meeting dated: 28.07.2021", link: "https://drive.google.com/file/d/1eYOnjKK6DHvsy_k64Yihym8uZY2DJiza/view?usp=drive_link", action: "View PDF" },
  { title: "Minutes of meeting dated: 27.12.2019", link: "https://drive.google.com/file/d/13UrdejJxCaKBo3buLi-c7RHDGDOMJcK4/view?usp=drive_link", action: "View PDF" },
  { title: "Minutes of meeting dated: 15.02.2022", link: "https://drive.google.com/file/d/1ZxNP9lai8fy5_qyqeJmZXo425yId3OI7/view?usp=drive_link", action: "View PDF" },
  { title: "Environment Department Orders 2021", link: "https://drive.google.com/file/d/1niMlNYR195G4E6Y2OP9V2g2qbv2PGE5X/view?usp=drive_link", action: "View PDF" },
];

const ITEMS_PER_PAGE = 10;

const EnvironmentDepartment = () => {
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

      {/* <div className="environment-header-image"></div> */}

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
        <div className="container-fluid font-location mt-4 mb-2" id="environment-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Environment Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Environment</span>
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
                <p className="dept-custom-title">Mr. Jamir Lengarekar, Mr. Vishal Kadam, Mrs. Vishakha Sawant</p>
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
                        <span className="dept-value"> Head of Environment Department</span>
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
                          {" "}Ground Floor, Main Administrative Building, Chopra Court Road, Ulhasnagar-421003.                      </span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon5} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Phone Number :</strong>
                        <span className="dept-value">  251-2720104 / 9404242823</span>
                      </div>
                    </div>
                    <div className="dept-item">
                      <div className="dept-icon-box">
                        <img src={cicon6} alt="icon" className="dept-icon-image" />
                      </div>
                      <div className="dept-text-box">
                        <strong className="dept-label">Email Address :</strong>
                        <span className="dept-value"> umcenvironment@gmail.com</span>
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
                              textWrap: "pretty",
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

export default EnvironmentDepartment;
