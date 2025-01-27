import React, { useEffect, useState } from "react";
import "./Info.css";
import { Link } from "react-router-dom";
import Commissioner from "../../assets/images/commissioner/Commissioner.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import api, { baseURL } from "../api"

const Info = () => {
  const [activeButton, setActiveButton] = useState(1);
  const [services, setServices] = useState([]);
  const [desc, setDesc] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const colors = ["#42B8F9", "#F8D05C", "#5FD35F", "#F5507A", "#A57BF6"];

  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 400,
    });
  }, []);

  const fetchDesc = async () => {
    try {
      const response = await api.get("/history_desc");
      setDesc(response.data);
    } catch (error) {
      console.error("Error fetching desc.");
    }
  };
  const fetchServices = async () => {
    try {
      const response = await api.get("/home-services1");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services", error);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchDesc();

  }, []);

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
          <div className="col-lg-3 col-md-12 profile-div" data-aos="fade-right">
            <div className="profile-card">
              <img
                src={Commissioner}
                alt="Commissioner"
                className="profile-image"
              />
              <h5 className="custom-name">Ms. Manisha Awhale </h5>
              <p className="custom-title">Commissioner</p>
              <p className="organization">Ulhasnagar Municipal Corporation</p>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 welcome-section" data-aos="fade-down">
            <div className="heading">
              <h1 data-aos="fade-up" className="info-heading1">Welcome to <span className="info-heading2 fw-bold">Ulhasnagar Municipal Corporation</span></h1>
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
              {expanded ? "Read Less.." : "Read More..."}
            </button>


          </div>

          <div className="col-lg-3 col-md-12" id="info-section" data-aos="fade-top">
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
