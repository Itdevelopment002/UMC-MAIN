import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DeathCertificate.css";
import PropertyTaximg from "../../assets/images/online-services/property.png";
import BirthCertificateimg from "../../assets/images/online-services/birth.png";
import DeathCertificateimg from "../../assets/images/online-services/death.png";
import eTenderimg from "../../assets/images/online-services/tender.png";
import api from "../api"

const DeathCertificate = () => {
  const [activeTab, setActiveTab] = useState("#death-certificate");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [tabData, setTabData] = useState([
    {
      id: "#property-tax-payment",
      link: "/property-tax-payment",
      name: "Property Tax Payment",
      description: [
        "Know and Pay Property Tax Online.",
        "Read carefully terms and conditions displayed by bank before making payment."
      ],
      url: "",
      image: PropertyTaximg,
    },
    {
      id: "#birth-certificate",
      link: "/birth-certificate",
      name: "Birth Certificate",
      description: [
        "For Birth Certificate, Please register here.",
      ],
      url: "",
      image: BirthCertificateimg,
    },
    {
      id: "#death-certificate",
      link: "/death-certificate",
      name: "Death Certificate",
      description: [
        "For Death Certificate, Please contact our office.",
      ],
      url: "",
      image: DeathCertificateimg,
    },
    {
      id: "#e-tender",
      link: "/e-tender",
      name: "e-Tender",
      description: [
        "For e-Tender information, visit this page.",
      ],
      url: "",
      image: eTenderimg,
    },
  ]);

  const fetchServices = async () => {
    try {
      const response = await api.get("/online-services-home");
      const serviceData = response.data;
      const updatedTabData = tabData.map((tab) => {
        const matchingService = serviceData.find(
          (service) => service.heading === tab.name
        );
        return matchingService
          ? { ...tab, url: matchingService.link }
          : tab;
      });

      setTabData(updatedTabData);
    } catch (error) {
      console.error("Error fetching service data", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const activeTabData = tabData.find((tab) => tab.id === activeTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>
      <div id="main-content">
        <div
          className="container-fluid font-location mt-4 mb-5"
          id="death-css"
        >
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Online Services
            </Link>
            <span className="breadcrumb-item active1">Death Certificate</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Death</span>
            <span className="highlighted-text"> Certificate</span>
          </h2>
          <div className="row mt-4 row-styling-3">
            <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12">
              <div className="e-services-container p-2">
                <div className="content">
                  <div className="tabs-container roboto-font">
                    <ul className="nav nav-tabs custom-nav-border gap-2">
                      {tabData.map((tab) => (
                        <li className="nav-item" key={tab.id}>
                          <Link
                            className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                            to={tab.link}
                            onClick={() => handleTabClick(tab.id)}
                          >
                            {tab.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="roboto-font p-3">
                    {activeTabData && (
                      <div className="row d-flex align-items-center mt-4">
                        <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start">
                          <div className="tab-description">
                            {activeTabData.description.map((desc, index) => (
                              <p key={index}>
                                {desc} {index === 0 && <Link to={activeTabData.url} target="_blank">Click here</Link>}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div
                          className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start"
                        >
                          <img
                            src={activeTabData.image}
                            alt={activeTabData.name}
                            className="service-image"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="background-img"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeathCertificate;
