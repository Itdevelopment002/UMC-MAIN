import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recruitment.css";
import api, { baseURL } from "../api"
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';

const Recruitment = () => {
  const [recruitment, setRecruitment] = useState([]);
  const [bgImage, setBgImage] = useState("");

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Recruitment");

        if (selectedBanner) {
          setBgImage(`${baseURL}${selectedBanner.file_path}`);
        } else {
          console.error("Banner with specified name not found.");
        }
      } else {
        console.error("No banner image found.");
      }
    } catch (error) {
      console.error("Error fetching header image:", error);
    }
  };

  useEffect(() => {
    fetchRecruitment();
    fetchHeaderImage();
  }, []);

  const fetchRecruitment = async () => {
    try {
      const response = await api.get("/recruitment");
      setRecruitment(response.data.reverse());
    } catch (error) {
      console.error("Error fetching recruitment:", error);
    }
  };

  const contractRecruitment = recruitment.filter(
    (item) => item.heading === "Contract Basis Recruitment"
  );
  const oldRecruitment = recruitment.filter(
    (item) => item.heading === "Old Recruitment"
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  return (
    <>
      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,

        }}
      ></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-4 mb-5" id="rec-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <span className="breadcrumb-item active1">Recruitment</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Jobs</span>
            <span className="highlighted-text"> @ UMC</span>
          </h2>
          <hr />
          <div className="row">
            <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div>
                <h2 className="new-location-title">
                  <span className="new-highlight">UMC</span>
                  <span className="new-highlighted-text">
                    {" "}
                    is looking for candidates for following post's
                  </span>
                </h2>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span className="span-system1">Contract basis Recruitment Advertisement</span>
                    </p>
                  </div>
                </div>
              </div>
              <table className="table table-bordered table-responsive shadow mt-4">
                <thead className="bg-orange text-white">
                  <tr>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Sr. No.</th>
                    <th className="table-heading-styling">Advertisement</th>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contractRecruitment.length > 0 ? (
                    contractRecruitment.map((item, index) => (
                      <tr key={item.id}>
                        <td
                          className="font-large"
                          width="8%"
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            color: "#292D32",
                            textAlign: "center"
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          width="70%"
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            color: "#000000",
                          }}
                        >
                          {item.description}
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
                            View PDF
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No Contract basis recruitment data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row mt-5">
                <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span className="span-system1">Old Recruitment Advertisement</span>
                    </p>
                  </div>
                </div>
              </div>
              <table className="table table-bordered table-responsive shadow mt-4">
                <thead className="bg-orange text-white">
                  <tr>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Sr. No.</th>
                    <th className="table-heading-styling">Advertisement</th>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {oldRecruitment.length > 0 ? (
                    oldRecruitment.map((item, index) => (
                      <tr key={item.id}>
                        <td
                          className="font-large"
                          width="8%"
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            color: "#292D32",
                            textAlign: "center"
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          width="70%"
                          style={{
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            color: "#000000",
                          }}
                        >
                          {item.description}
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
                            View PDF
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No Old recruitment data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recruitment;
