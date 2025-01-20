import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AccountsDepartment.css";
import "../DepartmentCustomCss/DepartmentCustom.css"
import Swal from 'sweetalert2';
import deptimg from "../../assets/images/Departments/no-img 1.png";
import cicon2 from "../../assets/images/Departments/Vector (1).png";
import cicon3 from "../../assets/images/Departments/Vector (3).png";
import cicon4 from "../../assets/images/Departments/Vector (5).png";
import cicon5 from "../../assets/images/Departments/Vector (6).png";
import cicon6 from "../../assets/images/Departments/Vector (7).png";
import pdficon from '../../assets/images/Departments/document 1.png';
import banner from '../../assets/images/Departments/lekha vibhag.jpg';

const employeesData1 = [
  { title: "अर्थसंकल्पीय अंदाज पत्रक २०२४-२५ (Budget Estimate 2024-25)", link: "https://drive.google.com/file/d/1Wi4ruD4c9LfjH641rIzgb81qC0JqTjOF/view?usp=drive_link", action: "View PDF", },
  { title: "अर्थसंकल्पीय अंदाज पत्रक २०२३-२४ (Budget Estimate 2023-24)", link: "https://drive.google.com/file/d/1qL5_J1CJkSt9t98Ur6MxgyprGFPkhGEX/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Budget 2019-2020", link: "https://drive.google.com/file/d/1pHcAGMS0v3B-vW4nxOln0RrBjCo9MtN2/view?usp=drive_link", action: "View PDF" },
  { title: "UMC Budget 2018-2019", link: "https://drive.google.com/file/d/1DhBmlmRRcuDg_liHA619IADNJhGhMILI/view?usp=drive_link", action: "View PDF" },
  { title: "Financial Statement 2018-19", link: "https://drive.google.com/file/d/1JfrR9_bPKFUhkrdpEOe1xht0IRsABEQx/view?usp=drive_link", action: "View PDF" },
  { title: "Financial Statement 2017-18", link: "https://drive.google.com/file/d/1zhITPqrwOclkA7ljKDbawEezmORjh-5z/view?usp=drive_link", action: "View PDF" },
  { title: "Financial Statement 2016-17", link: "https://drive.google.com/file/d/19e032kXKowxFEyO3CR-0oGt2AZ3xpm99/view?usp=drive_link", action: "View PDF" },
  { title: "Financial Statement 2015-16", link: "https://drive.google.com/file/d/1rQNxpoiKWNtKAXv-R62bKkqGxy5FbBLj/view?usp=drive_link", action: "View PDF" },
  { title: "Expenditure-Day Book(Apr 23- Oct 2023, Apr-22 - March 2023, Dec 2021- MArhttps://drive.google.com/drive/folders/1QUIh7Nv1u5TQU8m10ZNHIIi28WXittHv2022)", link: "https://drive.google.com/file/d/1e5TfOvFIkyfCHyhi5ZlEsEi0VZx8HFsd/view?usp=drive_link", action: "View PDF" },
  { title: "Day Book 2018-2019", link: "https://drive.google.com/file/d/1EhzmCygt1YxR6NGvd3NcGtVwLYC7w3YP/view?usp=drive_link", action: "View PDF" },
  { title: "Day Book 2016-2017", link: "https://drive.google.com/file/d/1eNiT9YskOKrP5iaqTEdjd80tndRa5zlH/view?usp=drive_link", action: "View PDF" },
  { title: "Day Book 1-Jun-2019 to 30-Jun-2019", link: "https://drive.google.com/file/d/1qssQmlCYThEaWlcqkzWP34wKYhLXIQk4/view?usp=drive_link", action: "View PDF" },
  { title: "Day Book 1-Apr-2019 to 31-May-2019", link: "https://drive.google.com/file/d/1n2zAyQEds2Zs48JvE8eTk9WQMQ5VwEei/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 1-4-2020 TO 30-9-2020", link: "https://drive.google.com/file/d/1aMT6pQ1Oj_spxlR78NVB7iy3vetHk7Mf/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 1-10-2020 TO 31-3-2021", link: "https://drive.google.com/file/d/14PhtWvabGPaZppZqO6BoPyzGxnsEmBw-/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 1-08-2021 TO 30-11-2021", link: "https://drive.google.com/file/d/16cXtn5FLET20BGiQgtsPBPW7HRe9YOBE/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 1-04-2021 to 31-07-2021", link: "https://drive.google.com/file/d/1cMc7dA_POk37yC41z1SgOZ0HoNcuZzPG/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 1-01-2020 TO 31-3-2020", link: "https://drive.google.com/file/d/1fKWVrIlIh5lNftBEsG8wDIQQHwO2IqgX/view?usp=drive_link", action: "View PDF" },
  { title: "DAY BOOK 01-07-2019 TO 31-12-2019", link: "https://drive.google.com/file/d/1lAVfx36HFyHP-fPoArsNxXkjgAxmkz93/view?usp=drive_link", action: "View PDF" },
  { title: "Balance Sheet & Income Expenditure Statement 2018-2019", link: "https://drive.google.com/file/d/1huRyUPS1ZUgkbo9isWratx4mR4a1Qi2f/view?usp=drive_link", action: "View PDF" },
  { title: "Balance Sheet & Income Expenditure Statement 2017-2018", link: "https://drive.google.com/file/d/1YpBmqTUvdnE1-4s094UnO-VBIvVTrVcR/view?usp=drive_link", action: "View PDF" },
];

const ITEMS_PER_PAGE = 10;

const AccountsDepartment = () => {
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

        <div className="container-fluid font-location mt-4 mb-2" id="accounts-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Department
            </Link>
            <span className="breadcrumb-item active1">Accounts Department</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Accounts</span>
            <span className="highlighted-text"> Department</span>
            <hr />
          </h2>
          <div className="row mt-4">
            <div className="col-12">
              <ul className="dept-custom-list">
                <li>To receive all moneys payable to the Corporation and credit the same in the bank Account of the Corporation </li>
                <li>To make payment on account of Municipal Fund </li>
                <li>To estimate Income & Exp. statement for the next financial year before 31st of March</li>
                <li>To make payment of Salary and pension of the employees </li>
                <li>To control the budget sanctioned by the Corporation </li>
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
                <p className="dept-custom-title">Mr. Kiran Bhilare</p>
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
                        <span className="dept-value"> Head of Accounts Department</span>
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
                        <strong className="dept-label">Phone Number : </strong>
                        <span className="dept-value">9869357664</span>
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

export default AccountsDepartment;
