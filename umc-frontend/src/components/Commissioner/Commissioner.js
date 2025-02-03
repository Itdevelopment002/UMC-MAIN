import React, { useEffect, useState } from "react";
import "./Commissioner.css";
import { Link } from "react-router-dom";
import Commissionerimg from "../../assets/images/commissioner/Commissioner.png";
import cicon1 from "../../assets/images/commissioner/Vector.png";
import cicon2 from "../../assets/images/commissioner/Vector (1).png";
import cicon3 from "../../assets/images/commissioner/Vector (3).png";
import cicon4 from "../../assets/images/commissioner/Vector (5).png";
import cicon5 from "../../assets/images/commissioner/Vector (6).png";
import cicon6 from "../../assets/images/commissioner/Vector (7).png";
import api, { baseURL } from "../api";


const Commissioner = () => {

  const [coData, setCoData] = useState([]);
  const [descData, setDescData] = useState([]);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    fetchCoData();
    fetchDescData();
    fetchHeaderImage();
  }, []);


  const fetchCoData = async () => {
    try {
      const response = await api.get("/commissioner-details");
      setCoData(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner Details data!");
    }
  };
  const fetchDescData = async () => {
    try {
      const response = await api.get("/commissioner-desc");
      setDescData(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner description data!");
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
        <div
          className="container-fluid font-location mt-2 mb-5"
          id="commissioner-css"
        >
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              About UMC
            </Link>
            <span className="breadcrumb-item active1">Commissioner</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Commissioner</span>
            <span className="highlighted-text"> of UMC</span>
          </h2>

          <div className="row mt-4">

            <div className="col-lg-3 col-md-4 col-sm-12 col-12">
              <div className="commison-profile-card text-center">
                <img
                  src={`${baseURL}${coData[0]?.image_path}`}
                  alt="Commissioner_img"
                  className="commison-profile-image"
                />
              </div>
            </div>

            <div className="col-lg-9 col-md-8 col-sm-12 col-12">
              <div className="details-card">
                <div className="commissioner-row">
                  <div className="commissioner-col">
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon1} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Commissioner Name :</strong>
                        <span className="value"> {coData[0]?.coName}</span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon2} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Designation :</strong>
                        <span className="value">
                          {" "}
                          {coData[0]?.designation}
                        </span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon3} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">
                          Education Qualification :
                        </strong>
                        <span className="value">
                          {" "}
                          {coData[0]?.qualification}
                        </span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon4} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Office Address :</strong>
                        <span className="value">
                          {" "}
                          {coData[0]?.address}
                        </span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon5} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Phone Number :</strong>
                        <span className="value"> {coData[0]?.number}</span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon6} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Email Address :</strong>
                        <span className="value"> {coData[0]?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="commisioner-overview">
                <h4>Brief Overview of the Commissioner</h4>
              </div>
              {descData.length > 0 ? (
                descData.map((item, index) => (
                  <p key={index} style={{ color: "#666565" }}>
                    {item.description}
                  </p>
                ))
              ) : (
                <p style={{ color: "#666565" }}>Loading data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commissioner;
