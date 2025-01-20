import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Location.css";

const Location = () => {

  // const menuItems = [
  //   "Citizens' Charters",
  //   "Corporators",
  //   "Submit Tenders",
  //   "Quotations",
  //   "Budget",
  //   "Department",
  //   "Ward Offices",
  //   "Circulars",
  // ];

  const locationData = [
    { label: "Continent", value: "Asia" },
    { label: "Country", value: "India" },
    { label: "State", value: "Maharashtra" },
    { label: "State Capital", value: "Mumbai" },
    { label: "Location", value: "58 km from Mumbai" },
    { label: "Area", value: "13.50 sq. km" },
    { label: "Time", value: "GMT +05:30" },
    { label: "Height above sea level", value: "19 meters" },
    { label: "Local Languages", value: "Marathi" },
    { label: "Established", value: "January 1960" },
  ];

  const employeesData1 = [
    { label: "Staff (UMC)", value: "-" },
    // { label: "Education Board Employees", value: "-" },
    // { label: "Area (Sq.Km.)", value: "-" },
    { label: "Annual Budget (2022-2023)", value: "-" },
    { label: "Total length of Roads", value: "-" },
    { label: "Industries in city", value: "-" },
    { label: "Population in slum", value: "-" },
    { label: "Municipal Hospitals", value: "-" },
    { label: "Municipal Dispensaries", value: "-" },
  ];

  const employeesData2 = [
    { label: "Municipal Schools", value: "-" },
    { label: "Private Schools", value: "-" },
    { label: "Total Strength of Students in Municipal Schools", value: "-" },
    { label: "Public Garden", value: "-" },
    { label: "Present water supply to city", value: "-" },
    { label: "Water supply per capita per day", value: "-" },
    { label: "Sewerage treatment plant capacity", value: "-" },
  ];

  const areaData = [
    { label: "As per 2011 census", value: "506,098" },
    {
      label: "Present population approx (appr.)", value: "Current estimated population of UMC in 2025 is approximately 737,000"
    },
    { label: "Literate as per 2011 census", value: "87.49 %" },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>
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

            {/* <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12">
              <ul className="list-group list-group-styling">
                {menuItems.map((item, index) => (
                  <li className="list-group-item custom-list-item" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div> */}

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
                  {locationData.map((item, index) => (
                    <tr key={index}>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#292D32",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                        }}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
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
                  {employeesData1.map((item, index) => (
                    <tr key={index}>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#292D32",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                        }}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
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
                  {employeesData2.map((item, index) => (
                    <tr key={index}>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#292D32",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                        }}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
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
                  {areaData.map((item, index) => (
                    <tr key={index}>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#292D32",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        width="50%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                        }}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
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
