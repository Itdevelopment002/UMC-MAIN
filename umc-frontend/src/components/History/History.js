import React, { useEffect, useState } from "react";
import "./History.css";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const History = () => {
  const [gallerys, setGallerys] = useState([]);
  const [firstTwo, setFirstTwo] = useState([]);
  const [remainingDesc, setRemainingDesc] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchGallerys();
    fetchDesc();
    fetchHeaderImage();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

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
      const response = await api.get(`/history_desc?lang=${i18n.language}`);
      setFirstTwo(response.data.slice(0, 2));
      setRemainingDesc(response.data.slice(2));
    } catch (error) {
      console.error("Error fetching desc.");
    }
  };

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "History");

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

  return (
    <>

      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,

        }}
      ></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="history-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('location.home')}
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              {t('location.aboutumc')}
            </Link>
            <span className="breadcrumb-item active1">{t("history-title2")}</span>
          </nav>

          <div className="row mt-5">
            {gallerys.map((gallery, index) => (
              <div className="col-lg-3 col-md-4 col-sm-12 col-12 sidebar" key={index}>
                <div className="sidebar-image text-center">
                  <img src={`${baseURL}${gallery.file_path}`} alt="UMC Building" className="img-fluid" />
                </div>
              </div>
            ))}
            <div className="col-lg-9 col-md-8 col-sm-12 col-12 content">
              <div className="history-section">
                <h2 className="history-title">
                  <span className="highlight">{t("history-title1")}</span>
                  <span className="highlighted-text"> {t("history-title2")}</span>
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
