import React, { useEffect } from "react";
import "./Commissioner.css";
import { Link } from "react-router-dom";
import Commissionerimg from "../../assets/images/commissioner/Commissioner.png";
import cicon1 from "../../assets/images/commissioner/Vector.png";
import cicon2 from "../../assets/images/commissioner/Vector (1).png";
import cicon3 from "../../assets/images/commissioner/Vector (3).png";
import cicon4 from "../../assets/images/commissioner/Vector (5).png";
import cicon5 from "../../assets/images/commissioner/Vector (6).png";
import cicon6 from "../../assets/images/commissioner/Vector (7).png";

const Commissioner = () => {

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>
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
                  src={Commissionerimg}
                  alt="Commissioner"
                  className="commison-profile-image"
                />
              </div>
              {/* <div className="col-lg-12 col-sm-12 col-12">
                <ul className="list-group list-group-styling">
                  {menuItems.map((item, index) => (
                    <li className="list-group-item custom-list-item" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}
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
                        <span className="value"> Ms. Manisha Awhale</span>
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
                          Commissioner of the Ulhasnagar Municipal Corporation
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
                          -
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
                          1st Floor, Ulhasnagar Municipal Corporation, Ulhasnagar
                          -4.
                        </span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon5} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Phone Number :</strong>
                        <span className="value"> -</span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon6} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">Email Address :</strong>
                        <span className="value"> commissioner@umc.gov.in</span>
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
              <p style={{color: "#666565"}}>
                Ms. Manisha is an IAS topper. She had secured All India Rank of 33 in UPSC CSE in 2018.
              </p>
              <p style={{color: "#666565"}}>
                Manisha Awhale is an IAS officer from the 2019 batch of the Maharashtra cadre. She faced personal challenges, including her mother's illness before her UPSC interview, but she successfully cleared the examinations. Prior to entering the IAS, she started her career in the Indian Railway Accounts Service and has diverse interests as a lawyer, writer, and sportsperson.
              </p>
              <p style={{color: "#666565"}}>
                After completing her probationary period, Manisha was appointed as the Assistant Collector of Solapur. She had gained immense popularity in Solapur district in her very first posting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commissioner;
