import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import api, { baseURL } from "../api";
import "./Location.css";

const Location = () => {


  const [tableData, setTableData] = useState([]);
  const [bgImage, setBgImage] = useState("");


  useEffect(() => {
    fetchPolicy();
    fetchHeaderImage();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await api.get("/location-info");
      setTableData(response.data);
    } catch (error) {
      console.error("Failed to fetch privacy policy data!");
    }
  };

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let latestBanner = response.data[response.data.length - 1];
        setBgImage(`${baseURL}${latestBanner.file_path}`);
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          marginTop: "-20px",
          zIndex: "-1",
        }}
      ></div>
      <div id="main-content">
        <div className="container-fluid font-location mt-4 mb-5" id="location-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              About UMC
            </Link>
            <span className="breadcrumb-item active1">Location</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Location</span>
            <span className="highlighted-text"> of UMC</span>
          </h2>
          <div className="row mt-4 row-styling-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto location-styling">
              <iframe
                title="UMC Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d57828.41779303888!2d73.16582725457208!3d19.227109041239448!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79442948bba51%3A0x28d43fde3c21dbf7!2sUlhasnagar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1735840024338!5m2!1sen!2sin"
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
              Location <span className="text-black">Information</span>
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
                        No data available.
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
                      NO. OF CORPN. EMPLOYEES.
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
                        No data available.
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
                      NO. OF CORPN. EMPLOYEES.
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
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 col-lg-4 col-md-5 col-sm-12">
            <h3 className="text-orange">
              City <span className="text-black">Information</span>
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
                      POPULATION AND AREA
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
                        No data available.
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
