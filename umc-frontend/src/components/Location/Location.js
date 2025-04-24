import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import api, { baseURL } from "../api";
import "./Location.css";
import { useTranslation } from "react-i18next";

const Location = () => {
  const [tableData, setTableData] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    fetchPolicy();
    fetchHeaderImage();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchPolicy = async () => {
    try {
      const response = await api.get(`/location-info?lang=${i18n.language}`);
      setTableData(response.data);
    } catch (error) {
      console.error("Failed to fetch privacy policy data!");
    }
  };

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Location");

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>

      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,

        }}
      ></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-4 mb-5" id="location-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('location.home')}
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              {t('location.aboutumc')}
            </Link>
            <span className="breadcrumb-item active1">{t('location.location-title')}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t('location.highlight1')}</span>
            <span className="highlighted-text"> {t('location.highlight-text')}</span>
          </h2>
          <div className="row mt-4 row-styling-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto location-styling">
              <iframe
                title="UMC Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.1717732053835!2d73.15359077503149!3d19.231344182005493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7943e643c5051%3A0x9f3cb696966d87f4!2sUlhasnagar%20Municipal%20Corporation!5e0!3m2!1sen!2sin!4v1745489393221!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="mt-5 col-lg-4 col-md-5 col-sm-12">
            <h3 className="text-orange">
              {t('location.location-title')} <span className="text-black">{t('location.information')}</span>
              <span className="divider"></span>
            </h3>
            <hr />
          </div>

          <div className="row mt-4">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <table className="table table-bordered table-responsive shadow">
                <tbody>
                  {tableData.filter(item => item.type === "Table 1").length > 0 ? (
                    tableData
                      .filter(item => item.type === "Table 1")
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.heading}
                          </td>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#9D9D9D",
                            }}
                          >
                            {item.description}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {t('location.nodata')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <table className="table table-bordered table-responsive shadow">
                <thead className="bg-orange text-white">
                  <tr>
                    <th colSpan="2" className="table-heading-styling">
                      {t('location.emnumber')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.filter(item => item.type === "Table 2").length > 0 ? (
                    tableData
                      .filter(item => item.type === "Table 2")
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.heading}
                          </td>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#9D9D9D",
                            }}
                          >
                            {item.description}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {t('location.nodata')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <table className="table table-bordered table-responsive shadow">
                <thead className="bg-orange text-white">
                  <tr>
                    <th colSpan="2" className="table-heading-styling">
                      {t('location.emnumber')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.filter(item => item.type === "Table 3").length > 0 ? (
                    tableData
                      .filter(item => item.type === "Table 3")
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.heading}
                          </td>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#9D9D9D",
                            }}
                          >
                            {item.description}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {t('location.nodata')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 col-lg-4 col-md-5 col-sm-12">
            <h3 className="text-orange">
              {t('location.city')} <span className="text-black">{t('location.information')}</span>
              <span className="divider"></span>
            </h3>
            <hr />
          </div>

          <div className="row mt-4">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <table className="table table-bordered table-responsive shadow">
                <thead className="bg-orange text-white">
                  <tr>
                    <th colSpan="2" className="table-heading-styling">
                      {t('location.populationandarea')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.filter(item => item.type === "Table 4").length > 0 ? (
                    tableData
                      .filter(item => item.type === "Table 4")
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#292D32",
                            }}
                          >
                            {item.heading}
                          </td>
                          <td
                            width="50%"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#9D9D9D",
                            }}
                          >
                            {item.description}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {t('location.nodata')}
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

export default Location;
