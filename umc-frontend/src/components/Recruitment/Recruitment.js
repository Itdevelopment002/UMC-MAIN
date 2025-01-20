import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Recruitment.css";

const Recruitment = () => {

  //   const menuItems = [
  //     "Citizens' Charters",
  //     "Corporators",
  //     "Submit Tenders",
  //     "Quotations",
  //     "Budget",
  //     "Department",
  //     "Ward Offices",
  //     "Circulars",
  //   ];

  const recruitment = [
    {
      advertise: "Public notice about walk in interview at UMC",
      posting: "12-10-2024",
    },
    {
      advertise: "Recruitment of accountant post on contract for UMC",
      posting: "15-10-2024",
    },
    {
      advertise: "Walk in interview for yoga teacher",
      posting: "17-10-2024",
    },
    {
      advertise: "Instruction about recruitment under NUHM",
      posting: "22-10-2024",
    },
    {
      advertise: "Selection and waiting list of post of the counsellor",
      posting: "25-10-2024",
    },
    {
      advertise: "Walk in interview for the post of recruiment at Divyanga Bhavan",
      posting: "01-11-2024",
    },
    {
      advertise: "Recruitment on contract for the post of teachers",
      posting: "05-11-2024",
    },
    {
      advertise: "Appointment of consultant on contract for UMC Zoo",
      posting: "08-11-2024",
    },
    {
      advertise: "Recruitment on contract under NUHM fro part time work",
      posting: "15-11-2024",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>

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

              <table className="table table-bordered table-responsive shadow mt-4">
                <thead className="bg-orange text-white">
                  <tr>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Sr. No.</th>
                    <th className="table-heading-styling">Advertisement</th>
                    <th className="table-heading-styling" style={{ textAlign: "center" }}>Posting Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitment.map((item, index) => (
                    <tr key={index}>
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
                        {item.advertise}
                      </td>
                      <td
                        width="20%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                          textAlign: "center"
                        }}
                      >
                        {item.posting}
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

export default Recruitment;
