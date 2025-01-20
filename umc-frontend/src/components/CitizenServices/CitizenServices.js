import React, { useEffect } from "react";
import "./CitizenServices.css";
import { Link } from "react-router-dom";
import img1 from "../../assets/images/citizen-services/service-1.png";
import img2 from "../../assets/images/citizen-services/service-2.png";
import img3 from "../../assets/images/citizen-services/service-3.png";
import img4 from "../../assets/images/citizen-services/service-4.png";
import img5 from "../../assets/images/citizen-services/service-5.png";
import img6 from "../../assets/images/citizen-services/service-6.png";
import img7 from "../../assets/images/citizen-services/service-7.png";
import img8 from "../../assets/images/citizen-services/service-8.png";
import vector from "../../assets/images/citizen-services/vector-1.png";
import AOS from 'aos';
import 'aos/dist/aos.css';

const CitizenServices = () => {
  useEffect(() => {
    AOS.init({
      duration: 450,
      delay: 100,
      once: true,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const services = [
    {
      title: "Tenders & Quotation",
      link: "/tenders-and-quotations",
      image: img1,
    },
    {
      title: "Property Tax",
      link: "http://www.onlineumc.org.in:8080/umc/jsp/propertydues.jsp?id=4",
      image: img2,
    },
    {
      title: "Water Tax",
      link: "http://water.umcgov.in/ViewConsumerDetails.aspx",
      image: img3,
    },
    {
      title: "Right to Information",
      link: "https://rtionline.gov.in/",
      image: img4,
    },
    {
      title: "E-Tenders",
      link: "https://mahatenders.gov.in/nicgep/app",
      image: img5,
    },
    {
      title: "Marriage Registration",
      link: "https://marriage.rtsumc.com/",
      image: img6,
    },
    {
      title: "Pandal Permission",
      link: "https://smartumc.com/pandal_app/",
      image: img7,
    },
    {
      title: "Birth Certificate",
      link: "https://crsorgi.gov.in/web/index.php/auth/login",
      image: img8,
    },
  ];

  const menuItems = [
    {
      name: "Pressnote",
      link: "/press-note"
    },
    {
      name: "General Election",
      link: "http://www.umcelection2022.in/"
    },
    {
      name: "Property Tax Department",
      link: "/property-tax-dept"
    },
    {
      name: "Quotation / Tenders",
      link: "/tenders-and-quotations"
    },
    {
      name: "Right to Information",
      link: "/rti"
    },
    {
      name: "Disaster Management",
      link: "/disaster-management-department"
    },

  ];

  const colors = ["#1EB174", "#FA5F68", "#F8C437", "#898989", "#F37F1B", "#0C8DD4"];

  return (
    <div className="background-container" id="citizen-section">
      <div className="container-fluid citigen-section  d-flex flex-wrap justify-content-between">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="citigen mt-1">
              <div className="vertical-line"></div>
              <div className="d-flex">
                <h2 className="section-title">
                  Citizen <span className="subtitle">Services</span>
                </h2>
              </div>
            </div>

            <div className="row">
              {services.map((service, index) => (
                <div className="col-6 col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                  <Link
                    to={service.link}
                    className="text-decoration-none"
                    target={service.link.startsWith("/") ? "_self" : "_blank"}
                    rel={service.link.startsWith("/") ? "" : "noopener noreferrer"}
                  >
                    <div className="service-card text-center">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="service-image mb-3"
                      />
                      <h5 className="service-title">{service.title}</h5>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-5">
            <div className="citigen">
              <div className="vertical-line"></div>
              <div className="d-flex">
                <h2 className="section-title">
                  Video <span className="subtitle">Gallery</span>
                </h2>
              </div>
            </div>

            <div id="citizen-section" className="row">
              <div className="col-12 video-wrapper">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/O6q3seFRC9I?si=i2JZaGyq8Tu3DAa0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="col-12 video-wrapper">
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/AdyXBtJbivI?si=cAODN_67EjJPi7fj"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>


          <div className="col-lg-4 col-md-8 col-sm-7">
            <div className="menu-list">
              {menuItems.map((item, index) => (
                <Link to={item.link} className="text-decoration-none">
                  <div
                    key={index}
                    className="menu-item mb-3"
                    data-aos="fade-right"
                    data-aos-delay={`${index * 100}`}
                    data-aos-duration="500"
                    style={{
                      borderLeft: `4px solid ${colors[index % colors.length]}`,
                    }}
                  >
                    <span className="menu-text">{item.name}</span>
                    <span className="menu-image">
                      <img src={vector} alt="arrow" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenServices;
