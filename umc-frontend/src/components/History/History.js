import React, { useEffect, useState } from "react";
import "./History.css";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
const History = () => {
  const [gallerys, setGallerys] = useState([]);
  const [firstTwo, setFirstTwo] = useState([]);
  const [remainingDesc, setRemainingDesc] = useState([]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchGallerys();
    fetchDesc();
  }, []);

  const fetchGallerys = async () => {
    try {
      const response = await api.get("/history-img");
      setGallerys(response.data);
    } catch (error) {
      console.error("Error fetching home gallery:", error);
    }
  };

  const fetchDesc = async () => {
    try {
      const response = await api.get("/history_desc");
      setFirstTwo(response.data.slice(0, 2));
      setRemainingDesc(response.data.slice(2));
    } catch (error) {
      console.error("Error fetching desc.");
    }
  };

  return (
    <>

      <div className="history-header-image"></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="history-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              About UMC
            </Link>
            <span className="breadcrumb-item active1">History</span>
          </nav>

          <div className="row mt-5">
            {gallerys.map((gallery, index) => (
              <div className="col-lg-3 col-md-4 col-sm-12 col-12 sidebar">
                <div className="sidebar-image text-center">
                  <img
                    src={`${baseURL}${gallery.file_path}`}
                    alt="UMC Building"
                    className="img-fluid"
                  />
                </div>
              </div>
            ))}
            <div className="col-lg-9 col-md-8 col-sm-12 col-12 content">
              <div className="history-section">
                <h2 className="history-title">
                  <span className="highlight">History</span>
                  <span className="highlighted-text"> of UMC</span>
                </h2>
                {firstTwo.map((item, index) => (
                  <div key={index}>
                    <p>{item.description}</p>
                    <br />
                  </div>
                ))}

              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 content custom-content">
                <div className="history-section">
                  {remainingDesc.map((item, index) => (
                    <p key={index}>{item.description}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
