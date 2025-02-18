import React, { useEffect, useState } from "react";
import "./Info.css";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const Info = () => {
  const [activeButton, setActiveButton] = useState(1);
  const [services, setServices] = useState([]);
  const [coData, setCoData] = useState([]);
  const [desc, setDesc] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const colors = ["#42B8F9", "#F8D05C", "#5FD35F", "#F5507A", "#A57BF6"];
  const { i18n, t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 400,
    });
  }, []);

  const fetchDesc = async () => {
    try {
      const response = await api.get(`/history_desc?lang=${i18n.language}`);
      setDesc(response.data);
    } catch (error) {
      console.error("Error fetching desc.");
    }
  };

  const fetchCoData = async () => {
    try {
      const response = await api.get(`/commissioner-details?lang=${i18n.language}`);
      setCoData(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner Details data!", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get(`/home-services1?lang=${i18n.language}`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services", error);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchDesc();
    fetchCoData();
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };



  return (
    <div className="container-fluid mt-5">
      {desc.length === 0 ? (
        <div>Loading data...</div>
      ) : (
        <div className="row align-items-center">
          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-12 profile-div" data-aos="fade-right">
          
            <div className="profile-card">
              <img
                src={`${baseURL}${coData[0]?.image_path}`}
                alt="Commissioner"
                className="profile-image"
              />
              <h5 className="custom-name">{coData[0]?.coName} </h5>
              <p className="custom-title">{coData[0]?.designation}</p>
              <p className="organization">{t('home.organization')}</p>

            </div>
          </div>

          <div className="col-xxl-6 col-xl-5 col-lg-5 col-md-12 welcome-section" data-aos="fade-down">
            <div className="heading">
              <h1 data-aos="fade-up" className="info-heading1"><span className="info-heading2 fw-bold">{t('home.info-heading2')}</span></h1>
            </div>
            <div
              className="description-container"
              style={{
                overflowY: expanded ? "auto" : "hidden",
                maxHeight: "220px",
                gap: "10px",
              }}
            >
              <p className="description">
                {desc.length > 0 && (
                  <div>
                    {expanded
                      ? desc.map((item, index) => (
                        <div key={index}>
                          <p className="description">{item.description}</p>
                        </div>
                      ))
                      : <div>{desc[0].description.slice(0, 480)} <span style={{ color: "gray" }}>...</span></div>
                    }
                  </div>
                )}
              </p>
            </div>

            <button className="see-more-btn" onClick={toggleDescription}>
              {expanded ? t("home.readLess") : t("home.readMore")}
            </button>


          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12" id="info-section" data-aos="fade-top">
            {services.map((service, index) => (
              <Link
                to={service.link}
                key={service.id}
                className={`custom-btn ${activeButton === service.id ? "active" : ""} text-decoration-none`}
                onClick={() => setActiveButton(service.id)}
                {...(service.link.startsWith("http") ? { target: "_blank" } : {})}
              >
                <div
                  className="button-icon-section"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  <img
                    src={`${baseURL}/${service.main_icon_path}`}
                    alt={service.heading}
                    className="btn-icon"
                  />
                </div>

                <span className="nav-divider"></span>

                <div className="button-label">
                  {service.heading}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div >
  );
};

export default Info;
