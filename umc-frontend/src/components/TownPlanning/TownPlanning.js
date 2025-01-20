import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TownPlanning.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png'
import banner from '../../assets/images/Departments/planning.jpg'

const employeesData1 = [
  { title: "Buildling Permission 1964 - 1970", link: "https://drive.google.com/file/d/1PN7wVGEGrYz5Y85i_Rc_lSSArTr9HmLH/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2016 - 2017", link: "https://drive.google.com/file/d/1S8uZMTHd_LPHlL_E2SAH1ssVSuy7uDK4/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2015 - 2016", link: "#", action: "View PDF", },
  { title: "Building Permission 2014 - 2015", link: "https://drive.google.com/file/d/1BjSQyQP10smf0QVDR8TUjATOwYZL-5br/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2013 - 2014", link: "https://drive.google.com/file/d/1-CivIITOxMjuU0bjNxUAh0d_dSRjdblO/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2011 - 2012", link: "https://drive.google.com/file/d/1MwxlguDvDqOhOgdPaKEdcitd5e2kbPHV/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2010 - 2011", link: "https://drive.google.com/file/d/15gzPmQe6I-NekZ1LlDSVbIdmSj63Unxs/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2009 - 2010", link: "https://drive.google.com/file/d/1uaNe4RGHm8E2-bqAPg76cs-vLM-RK5sx/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2008 - 2009", link: "https://drive.google.com/file/d/1XcgjmhYM4Z38nM9U0dsrXCgK56b3FIGA/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2007 - 2008", link: "https://drive.google.com/file/d/1_69L384NPYfcS0OKkXrBwxR9U_pr7TDA/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2006 - 2007", link: "https://drive.google.com/file/d/1ydMUufpgT2DNi-K5UH7KlmUIHBYsFue8/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2005 - 2006", link: "https://drive.google.com/file/d/11AiLLX8EHFG1EyPXwYTOGzBFJ0fk7gdI/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2004 - 2005", link: "https://drive.google.com/file/d/1UaO5bz5EqDhkKV-WcY16C8jzg7KDCwag/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2003 - 2004", link: "https://drive.google.com/file/d/1XZ0KywWQYVMkQ1oxua0Tjv2Lt6g_vNPp/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2002 - 2003", link: "https://drive.google.com/file/d/1TkGK-uaQXGDOkfEE5g8WCTBfRitppQfF/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2001 - 2002", link: "https://drive.google.com/file/d/1eQaP4SSj7lTw16PnfzaoGMlXpkF5CNsk/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 2000 - 2001", link: "https://drive.google.com/file/d/1QdD-WtpNM2VsO1Er2NitRRzYkS3fC2KC/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1999 - 2000", link: "https://drive.google.com/file/d/1ogdh2OYVwMxWPyNuKSKpFxGLaUlCCf5C/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1998 - 1999", link: "https://drive.google.com/file/d/1_Cd6xJbaKHPAztHMp3wxE-dbvxzXRzyB/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1997 - 1998", link: "#", action: "View PDF", },
  { title: "Building Permission 1996 - 1997", link: "https://drive.google.com/file/d/1SuYNSso6z1kPuvTju6pxySutD60_sBVC/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1994 - 1995", link: "https://drive.google.com/file/d/1O9IUlp-3DlE9NqmffthrpDenGOQE4Av8/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1993 - 1994", link: "https://drive.google.com/file/d/1xX-hjmKKjsk-0Yicc9o0rJcRY6TKslZJ/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1992 - 1993", link: "https://drive.google.com/file/d/19sir90cXRwr-OU_VaI0_Vvowp80UUyHX/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1991 - 1992", link: "https://drive.google.com/file/d/1EWIh1GTSOjjyU9npnSa1cuCBIwO4-HR-/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1990 - 1991", link: "https://drive.google.com/file/d/1x2nSXP4JN6dEM2LPpjfFCvzxFMP7Uc0R/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1988 - 1989", link: "https://drive.google.com/file/d/1HGejZs-D3SxDw8358oHK7z9oYR4ItjII/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1986 - 1987", link: "https://drive.google.com/file/d/1Be4-S1MLY4eU4dbD-S5BdswOzYqxqeQt/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1984 - 1985", link: "https://drive.google.com/file/d/1CbAyAfAcc1iOdwq-UvmNA_du7MJ_5sC0/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1983-1984", link: "https://drive.google.com/file/d/1IviSV2ZxgzAVdNldHYeK82giFiiFvoKC/view?usp=drive_link", action: "View PDF", },
  { title: "Building Permission 1971-1973", link: "https://drive.google.com/file/d/1j7STip7L3pozioR_GukZTwVNc_rOSCKs/view?usp=drive_link", action: "View PDF", },
];

const ITEMS_PER_PAGE = 10;

const TownPlanning = () => {
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
      {/* <div className="town-header-image"></div> */}

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
        <div className="container-fluid font-location mt-4 mb-2" id="town-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Town Planning</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Town Planning</span>
            <span className="highlighted-text"> Department</span>
            <hr />
          </h2>
          <div className="row mt-4">
            <div className="col-12">
              <ul className="dept-custom-list">
                <li>The duties and functions pertaining to town planning are to prepare regional plans, development plans and town planning schemes; to render assistance to the municipal authorities in the preparation of development plans and town planning schemes; to carry out surveys, prepare existing land-use-plans and development plans; to advise and prepare town development, improvement, extension and slum clearance schemes under the Municipal Acts </li>
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
                <p className="dept-custom-title">-</p>
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
                        <span className="dept-value"> Head of Town Planning Department</span>
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

export default TownPlanning;
