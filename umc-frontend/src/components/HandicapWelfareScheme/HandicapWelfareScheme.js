import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HandicapWelfareScheme.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const HandicapWelfareScheme = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [banner, setBanner] = useState([]);
  const [description, setDescription] = useState([]);
  const [hod, setHod] = useState([]);
  const [pdf, setPdf] = useState([]);
  const { i18n, t } = useTranslation();
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(pdf.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = pdf.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      // Skip further rendering for this iteration
    }

    return pageNumbers;
  };


  const department_name = (i18n.language === 'en') ? "Persons with Disabilities Welfare Department" : "दिव्यांग कल्याणकारी विभाग"

  const fetchBanner = async () => {
    try {
      const response = await api.get("/department-banner");
      const filteredData = response.data.filter((item) => item.name === department_name);
      setBanner(filteredData);
    } catch (error) {
      console.error("Error fetching banner data", error);
    }
  };

  const fetchHod = async () => {
    try {
      const response = await api.get(`/hod-details?lang=${i18n.language}`);
      const filteredData = response.data.filter((item) => item.department === department_name);
      setHod(filteredData);
    } catch (error) {
      console.error("Error fetching hod data", error);
    }
  };

  const fetchDescription = async () => {
    try {
      const response = await api.get(`/department-description?lang=${i18n.language}`);
      const filteredData = response.data.filter((item) => item.department === department_name);
      setDescription(filteredData);
    } catch (error) {
      console.error("Error fetching description data", error);
    }
  }

  const fetchPdf = async () => {
    try {
      const response = await api.get(`/department-pdfs?lang=${i18n.language}`);
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      const filteredData = sortedData.filter((item) => item.department === department_name);
      setPdf(filteredData);
    } catch (error) {
      console.error("Error fetching pdfs data", error);
    }
  }

  useEffect(() => {
    fetchBanner();
    fetchHod();
    fetchDescription();
    fetchPdf();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>

      <div className="">
        <img
          src={`${baseURL}/${banner[0]?.file_path}`}
          alt={banner[0]?.name}
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
              {t('departments.home')}
            </Link>
            <Link to="/departments" className="breadcrumb-item text-decoration-none">
              {t('departments.department')}
            </Link>
            <span className="breadcrumb-item active1">{t('handicapDept.title')}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t('handicapDept.highlight')}</span>
            <span className="highlighted-text"> {t('handicapDept.highlight-text')}</span>
            <hr />
          </h2>

          <div className="row mt-4">
            <div className="col-12">
              <ul className="dept-custom-list">
                {description.map((item, index) => {
                  const subDescriptions = Array.isArray(item.subDescriptions) ? item.subDescriptions : [];
                  return (
                    <>
                      <li>
                        {item.description}
                      </li>
                      {subDescriptions.length > 0 && (
                        <ol style={{ listStyleType: 'none', paddingLeft: '1em' }}>
                          {(() => {
                            const currentLang = i18n.language;
                            const MarathiLetters = [
                              'अ', 'ब', 'क', 'ड', 'इ', 'फ', 'ग', 'ह', 'ई', 'ज',
                              'क', 'ल', 'म', 'न', 'ओ', 'प', 'क़', 'र', 'स', 'त',
                              'उ', 'व', 'व', 'क्ष', 'य', 'ज़'
                            ];

                            return subDescriptions.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  marginBottom: '0.5em'
                                }}
                              >
                                <span style={{ width: '2em', flexShrink: 0 }}>
                                  {currentLang === 'mr'
                                    ? (MarathiLetters[subIndex] || subIndex + 1)
                                    : String.fromCharCode(97 + subIndex)}
                                  .
                                </span>
                                <span>{subItem}</span>
                              </li>
                            ));
                          })()}
                        </ol>
                      )}
                    </>
                  );
                })}
              </ul>
            </div>
          </div>

          {hod.map((hod, index) => (
            <div className="row mt-4">
              <div className="col-lg-3 col-md-4 col-sm-12 col-12">
                <div className="dept-profile-card text-center">
                  <img
                    src={`${baseURL}/${hod.file_path}`}
                    alt={hod.name}
                    className="dept-profile-image"
                  />
                  <p className="dept-custom-title">{hod.name}</p>
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
                          <strong className="dept-label">{t('departments.designation')} :</strong>
                          <span className="dept-value">                {hod.designation} </span>
                        </div>
                      </div>
                      <div className="dept-item">
                        <div className="dept-icon-box">
                          <img src={cicon3} alt="icon" className="dept-icon-image" />
                        </div>
                        <div className="dept-text-box">
                          <strong className="dept-label">
                            {t('departments.qualification')} :
                          </strong>
                          <span className="dept-value"> {hod.education}</span>
                        </div>
                      </div>
                      <div className="dept-item">
                        <div className="dept-icon-box">
                          <img src={cicon4} alt="icon" className="dept-icon-image" />
                        </div>
                        <div className="dept-text-box">
                          <strong className="dept-label">{t('departments.address')} : </strong>
                          <span className="dept-value">
                            {" "}{hod.address}
                          </span>
                        </div>
                      </div>
                      <div className="dept-item">
                        <div className="dept-icon-box">
                          <img src={cicon5} alt="icon" className="dept-icon-image" />
                        </div>
                        <div className="dept-text-box">
                          <strong className="dept-label">{t('departments.phoneNo')} : </strong>
                          <span className="dept-value">{hod.number}</span>
                        </div>
                      </div>
                      <div className="dept-item">
                        <div className="dept-icon-box">
                          <img src={cicon6} alt="icon" className="dept-icon-image" />
                        </div>
                        <div className="dept-text-box">
                          <strong className="dept-label">{t('departments.email')} :</strong>
                          <span className="dept-value"> {hod.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
                        {t('departments.sno')}
                      </th>
                      <th className="table-heading-styling">{t('departments.heading')}</th>
                      <th
                        className="table-heading-styling"
                        style={{ textAlign: "center" }}
                      >
                        {t('departments.action')}
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
                            {(() => {
                              const language = i18n.language;

                              const toMarathiNumbers = (num) => {
                                const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                return num
                                  .toString()
                                  .split("")
                                  .map((digit) => marathiDigits[parseInt(digit, 10)])
                                  .join("");
                              };

                              const number = startIndex + index + 1;
                              return language === "mr" ? toMarathiNumbers(number) : number;
                            })()}
                          </td>
                          <td
                            width="80%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.heading}
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
                              {t('departments.view')}
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "#333333" }}>
                          {t('departments.nodata')}
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
                    {t('departments.previous')}
                  </button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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

export default HandicapWelfareScheme;
