import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recruitment.css";
import api, { baseURL } from "../api"
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

const Recruitment = () => {
  const [recruitment, setRecruitment] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

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
  }, [i18n.language]);

  const fetchRecruitment = async () => {
    try {
      const response = await api.get(`/recruitment?lang=${i18n.language}`);
      setRecruitment(response.data.reverse());
    } catch (error) {
      console.error("Error fetching recruitment:", error);
    }
  };

  const contractRecruitment = recruitment.filter(
    (item) => (item.heading === "Contract Basis Recruitment" || item.heading === "करार तत्त्वावर भरती जाहिरात")
  );
  const oldRecruitment = recruitment.filter(
    (item) => (item.heading === "Old Recruitment" || item.heading === "मागील भरती जाहिरात")
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
            {t("breadcrumbHome")}
            </Link>
            <span className="breadcrumb-item active1">{t("recruitment.breadcrumb")}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t("recruitment.jobs")}</span>
            <span className="highlighted-text"> {t("recruitment.umc")}</span>
          </h2>
          <hr />
          <div className="row">
            <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div>
                <h2 className="new-location-title">
                  <span className="new-highlight">{t("recruitment.umc")}</span>
                  <span className="new-highlighted-text">
                    {" "}
                    {t("recruitment.post")}
                  </span>
                </h2>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span className="span-system1">{t("recruitment.recruitmentAdvertisement")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <table className="table table-bordered table-responsive shadow mt-4">
                <thead className="bg-orange text-white">
                  <tr>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("recruitment.srNo")}</th>
                    <th className="table-heading-styling">{t("recruitment.advertisement")}</th>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("recruitment.action")}</th>
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
                            {t("recruitment.viewPDF")}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                      {t("recruitment.noData")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row mt-5">
                <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span className="span-system1">{t("recruitment.oldRecruitmentAdvertisement")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <table className="table table-bordered table-responsive shadow mt-4">
                <thead className="bg-orange text-white">
                  <tr>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("recruitment.srNo")}</th>
                    <th className="table-heading-styling">{t("recruitment.advertisement")}</th>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("recruitment.action")}</th>
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
                            {t("recruitment.viewPDF")}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                      {t("recruitment.noOldDataAvailable")}
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
