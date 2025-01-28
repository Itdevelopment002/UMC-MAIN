import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recruitment.css";
import api from "../api"

const Recruitment = () => {
  const [recruitment, setRecruitment] = useState([]);

  useEffect(() => {
    fetchRecruitment();
  }, []);

  const fetchRecruitment = async () => {
    try {
      const response = await api.get("/recruitment");
      setRecruitment(response.data.reverse());
    } catch (error) {
      console.error("Error fetching recruitment:", error);
    }
  };

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
                        width="20%"
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          color: "#9D9D9D",
                          textAlign: "center"
                        }}
                      >
                        {new Date(item.publish_date)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")}
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
