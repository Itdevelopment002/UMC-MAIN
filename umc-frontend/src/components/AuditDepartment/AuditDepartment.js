import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AuditDepartment.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const AuditDepartment = () => {
  const [selectedButton, setSelectedButton] = useState('');
  const [tableData, setTableData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableButtons, setAvailableButtons] = useState([]);
  const [headersMap, setHeadersMap] = useState({});
  const [banner, setBanner] = useState([]);
  const [description, setDescription] = useState([]);
  const [hod, setHod] = useState([]);
  const { i18n, t } = useTranslation();


  useEffect(() => {
    api.get(`/audit-report?lang=${i18n.language}`)
      .then((response) => {
        setTableData(response.data);
        const uniqueNames = [...new Set(response.data.map(item => item.name))];
        setAvailableButtons(uniqueNames);

        const dynamicHeadersMap = {};

        uniqueNames.forEach(name => {
          dynamicHeadersMap[name] = [
            `${name} ${t('muncipal.agenda')}`,
            `${name} ${t('muncipal.minutes')}`,
            `${name} ${t('muncipal.resolution')}`,
          ];
        });

        setHeadersMap(dynamicHeadersMap);

        if (uniqueNames.length > 0) {
          setSelectedButton(uniqueNames[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const tableHeaders = headersMap[selectedButton] || [];

  const getTableData = () => {
    return tableData.filter(item => item.name === selectedButton);
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    setCurrentPage(1);
  };

  const filteredData = getTableData().filter((item) =>
    item.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const updatedTotalEntries = filteredData.length;
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, updatedTotalEntries);

  const department_name = (i18n.language === 'en') ? "Audit Department" : "लेखापरीक्षण विभाग"

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

  useEffect(() => {
    fetchBanner();
    fetchHod();
    fetchDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="container-fluid font-location mt-4 mb-2" id="audit-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('departments.home')}
            </Link>
            <Link to="/departments" className="breadcrumb-item text-decoration-none">
              {t('departments.department')}
            </Link>
            <span className="breadcrumb-item active1">{t('auditDept.title')}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t('auditDept.highlight')}</span>
            <span className="highlighted-text"> {t('auditDept.highlight-text')}</span>
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
                        <ol type="a">
                          {subDescriptions.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              {subItem}
                            </li>
                          ))}
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

          <div className="row mt-4 row-styling-3" id='municipal-css'>
            <div className="col-12">
              <div className="button-group mb-4 d-flex justify-content-start">
                {availableButtons.map((buttonName) => (
                  <button
                    key={buttonName}
                    className={`btn ${selectedButton === buttonName ? "active" : ""}`}
                    onClick={() => handleButtonClick(buttonName)}
                  >
                    {buttonName}
                  </button>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="entries-wrapper">
                  <label htmlFor="entries" className="entries-label">{t('corporation.show')}</label>
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
                  <span className="entries-text">{t('corporation.entries')}</span>
                </div>

                <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
                  <label htmlFor="searchInput" className="search-label" style={{ whiteSpace: "nowrap" }}>
                    {t('corporation.search')}
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
              </div>

              <div className="circular-wrapper">
                <table className="table table-bordered shadow table-responsive">
                  <thead className="bg-orange text-white">
                    <tr>
                      <th className="table-heading-styling text-center" width="8%">{t('departments.sno')}</th>
                      <th className="table-heading-styling" width="25%">{t('corporation.year')}</th>
                      {tableHeaders.map((header, index) => (
                        <th className="table-heading-styling text-center" key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={index}>
                        <td className="font-large text-center">
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

                            const number = startEntry + index
                            return language === "mr" ? toMarathiNumbers(number) : number;
                          })()}
                        </td>
                        <td>{item.year}</td>
                        <td className="text-center">
                          {item.pdf_link1 && item.pdf_link1 !== "#" ? (
                            <Link
                              to={item.pdf_link1}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={pdficon}
                                alt="PDF"
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Link>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          {item.pdf_link2 && item.pdf_link2 !== "#" ? (
                            <Link
                              to={item.pdf_link2}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={pdficon}
                                alt="PDF"
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Link>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          {item.pdf_link3 && item.pdf_link3 !== "#" ? (
                            <Link
                              to={item.pdf_link3}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={pdficon}
                                alt="PDF"
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Link>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="last-updated-container">
                <p className="last-updated-text">
                  <b>{t('corporation.showing')} {startEntry} {t('corporation.to')} {endEntry} {t('corporation.of')} {updatedTotalEntries} {t('corporation.entries')}</b>
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
                    {t('departments.previous')}
                  </button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
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

export default AuditDepartment;
