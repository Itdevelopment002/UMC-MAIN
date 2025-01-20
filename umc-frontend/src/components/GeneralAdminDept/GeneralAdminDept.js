
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GeneralAdminDept.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import banner from '../../assets/images/Departments/general.jpg'


const employeesData1 = [
  { title: "स्वच्छता निरिक्षक या संवर्गातील पदोन्नती बाबत", link: "https://drive.google.com/file/d/1ZHzt1xdJI16X6GAUWJWXpnK2Jng6dwVt/view?usp=drive_link", action: "View PDF", },
  { title: "सुधारित बडतर्फ आदेश - 2021-22", link: "#", action: "View PDF", },
  { title: "विभागीय परीक्षेचे वेळापत्रक व परीक्षार्थी फॉर्म", link: "https://drive.google.com/file/d/1rgftD3TtQPlnRG87ZS_GYo1Fy1bS1WOj/view?usp=drive_link", action: "View PDF", },
  { title: "विभागीय परीक्षेचे वेळापत्रक व परीक्षार्थी फॉर्म.", link: "https://drive.google.com/file/d/1X9AJfv9kO_asN9gkp4eyYHg4ok2bKPsr/view?usp=drive_link", action: "View PDF", },
  { title: "महापालिकेच्या संकेतस्थळावर \"मुकादम (बांधकाम)\" पदावर पदोन्नती देण्याबाबत अंतिम यादीबाबत", link: "https://drive.google.com/file/d/1xM2tWWXJD_j60KDLpfvrtORGD6zLZvjD/view?usp=drive_link", action: "View PDF", },
  { title: "महापालिका आस्थापनेवरील अधिक्षक या संवर्गाची १ जानेवारी २०२२ ची अंतिम सेवाजेष्ठता यादी प्रसिद्ध करणेबाबत", link: "https://drive.google.com/file/d/1n_xxG_ZBc5R5WiteCELGq4R0JT2d-PK8/view?usp=drive_link", action: "View PDF", },
  { title: "महापालिका आस्थापनेवर कार्यरत कनिष्ठ अभियंता (स्थापत्य) या संवर्गाची ०१ जानेवारी २०२२ ची अंतिम सेवाजेष्ठत यादी प्रसिद्ध करणेबाबत", link: "https://drive.google.com/file/d/16fzmF_Po5TR5EaFmcfPBgbCuKZ_m5KEW/view?usp=drive_link", action: "View PDF", },
  { title: "प्रारूप सेवा जेष्ठता यादी २०२३- वर्ग - १,२,३,४", link: "https://drive.google.com/file/d/1ineO0sRYpoJGGQgBfQEWbzTnw6BK1Otj/view?usp=drive_link", action: "View PDF", },
  { title: "अंतिम सेवाजेष्ठता यादी २०२२ वर्ग-४ (Final Seniority List Class 4 2022)", link: "https://drive.google.com/file/d/1G2YdzXrdq-OyGJpFQvzGG8_aF0DTUKQ6/view?usp=drive_link", action: "View PDF", },
  { title: "अंतिम सेवाजेष्ठता यादी २०२२ वर्ग-३ (Final Seniority List Class 3 2022)", link: "#", action: "View PDF", },
  { title: "अंतिम सेवाजेष्ठता यादी २०२२ वर्ग-२ (Final Seniority List Class 2 2022)", link: "#", action: "View PDF", },
  { title: "अंतिम सेवाजेष्ठता यादी २०२२ वर्ग-१ (Final Seniority List Class 1 2022)", link: "#", action: "View PDF", },
  { title: "Seniority List Class 4 2022 (प्रारूप)", link: "https://drive.google.com/file/d/1VnLEqs6vtJeZDmkUy5m4Xm7sX58u5ssx/view?usp=drive_link", action: "View PDF", },
  { title: "Seniority List Class 3 2022 (प्रारूप)", link: "https://drive.google.com/file/d/1R8zOQ1HrmP1z_-xNr1PR3yWyge7THo78/view?usp=drive_link", action: "View PDF", },
  { title: "Seniority List Class 2 2022 (प्रारूप)", link: "https://drive.google.com/file/d/1jnQarTrEAUYTp1tr6d0dYcIGKZz4NMV1/view?usp=drive_link", action: "View PDF", },
  { title: "Seniority List Class 1 2022 (प्रारूप)", link: "https://drive.google.com/file/d/16K-9Nv_T196Bg-aq5VofmgAoORfj6wpV/view?usp=drive_link", action: "View PDF", },
];

const ITEMS_PER_PAGE = 10;

const GeneralAdminDepartment = () => {
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

      {/* <div className="general-header-image"></div> */}

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
        <div className="container-fluid font-location mt-4 mb-2" id="general-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">General Administrative Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">General Administrative</span>
            <span className="highlighted-text"> Department</span>
            <hr />
          </h2>
          <div className="row mt-4">
            <div className="col-12">
              <ul className="dept-custom-list">
                <li>Maintenance of Service Books:</li>
                <ol type="a">
                  <li>Increments</li>
                  <li>Leave</li>
                  <li>To take note of various orders</li>
                  <li>Fixation of Pay</li>
                </ol>
                <li>All procedure regarding giving benefits of pensions to the employee as per Ulhasnagar Municipal Corporation Pension Rule.</li>
                <li>Implementation of dues, Allowances, and Advances:</li>
                <ol type="a">
                  <li>Traveling Allowance</li>
                  <li>Medical Allowance</li>
                  <li>Vehicle Allowance</li>
                  <li>Cash Allowance</li>
                  <li>Handicap Allowance</li>
                  <li>Washing Allowance</li>
                  <li>Festival Advance</li>
                  <li>Additional Charge Allowance</li>
                </ol>
                <li>Departmental inquiries regarding misconduct of Municipal Employees, Departmental Enquiry conduct under M.C.S.R. 1979 and Punishments imposed under the B.P.M.C. Act, 1949 and M.C.S.R. 1979.</li>
                <li>To attend Court Cases in various Courts regarding Employee matters.</li>
                <li>Pay Bills</li>
                <li>Seniority List</li>
                <li>Municipal Union Correspondence</li>
                <li>Correspondence with Municipal Secretary Department</li>
                <li>Correspondence with Government</li>
                <ol type="a">
                  <li>L.A.Q.</li>
                  <li>Lokayukta references</li>
                  <li>Lokshahi Din</li>
                </ol>
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
                <p className="dept-custom-title">Mr. Manish Hivare</p>
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
                        <span className="dept-value"> Head of General Administrative Department</span>
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
                        <span className="dept-value"> 9594235999</span>
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

export default GeneralAdminDepartment;
