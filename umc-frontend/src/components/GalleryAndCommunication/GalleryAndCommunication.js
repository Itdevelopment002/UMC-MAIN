import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "./GalleryAndCommunication.css";
import { useTranslation } from "react-i18next";

const GalleryAndCommunication = () => {
  const [portal, setPortal] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [gallery, setGallery] = useState([]);
  const { i18n, t } = useTranslation();

  const fetchPortal = async () => {
    try {
      const response = await api.get(`/portal-services?lang=${i18n.language}`);
      setPortal(response.data);
    } catch (error) {
      console.error("Error fetching portal services!", error);
    }
  }

  const fetchEmergency = async () => {
    try {
      const response = await api.get(`/emergency-services?lang=${i18n.language}`);
      setEmergency(response.data);
    } catch (error) {
      console.error("Error fetching emergency services!", error);
    }
  }

  const fetchGallery = async () => {
    try {
      const response = await api.get("/home-gallerys");
      setGallery(response.data);
    } catch (error) {
      console.error("Error fetching home gallery!", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchPortal();
      await new Promise((res) => setTimeout(res, 1000));
      await fetchEmergency();
      await new Promise((res) => setTimeout(res, 1000));
      await fetchGallery();
    };
    fetchData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
    });
  }, [gallery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container-fluid font-fam mt-4 mb-4" id="image-com-section">
      <div className="row ">
        <div className="col-lg-8 ">
          <div className="citigen">
            <div className="vertical-line"></div>
            <div className="title-container">
              <h2 className="section-title">
                {t("home.photo")} <span className="subtitle">{t("home.gallery")}</span>
              </h2>
            </div>
            <Link to="/photo-gallery" className="view-all-link">{t("home.viewAll")}</Link>
          </div>

          <div className="row">
            {gallery.map((image, index) => (
              <div className="col-6 col-sm-6 col-md-4 mb-3" key={index}>
                <div className="card border-0">
                  <Link to={`${baseURL}${image.file_path}`} className="glightbox">
                    <img
                      src={`${baseURL}${image.file_path}`}
                      alt={`gallery-${index + 1}`}
                      className="image-style-2 rounded-2"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4 citizen-communication-div">
          <div className="citigen">
            <div className="vertical-line"></div>
            <div className="d-flex">
              <h2 className="section-title">
                {t("home.citizen")} <span className="subtitle">{t("home.communication")}</span>
              </h2>
            </div>
          </div>
          <div className="card card-2 px-3 p-2" style={{ background: "#E2F3FD" }}>
            {portal.map((item, index) => (
              <React.Fragment key={index}>
                <Link
                  to={item.link}
                  target="_blank"
                  className="text-decoration-none custom-communication-effect"
                >
                  <div className="mb-0">
                    <div className="d-flex align-items-center px-2">
                      <img
                        src={`${baseURL}/${item.main_icon_path}`}
                        alt={item.heading}
                        className="image-style-com-2 me-3"
                      />
                      <div>
                        <h6 className="mb-1 h6-styling-gallery">{item.heading}</h6>
                        <small className="text-styling-small">{item.description}</small>
                      </div>
                    </div>
                  </div>
                </Link>
                {index !== portal.length - 1 && (
                  <hr
                    style={{
                      backgroundColor: "#832E37",
                      height: "2px",
                      border: "none",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="contact-section mt-3">
            {emergency.map((item, index) => (
              <React.Fragment key={index}>
                <div className="d-flex align-items-center mb-1 px-2">
                  <Link to={`tel:${item.number}`} className="contact-link">
                    <img
                      src={`${baseURL}/${item.main_icon_path}`}
                      alt={item.heading}
                      className="communication-contact-icon me-2"
                    />
                    <span className="communication-contact-text">{item.heading} - {item.number}</span>
                  </Link>
                </div>
                {index !== emergency.length - 1 && (
                  <hr
                    style={{
                      backgroundColor: "#0000004D",
                      height: "1px",
                      border: "none",
                      padding: '0px',
                      margin: '0px'
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div >
  );
};

export default GalleryAndCommunication;
